import {
  Button,
  Modal,
  Stack,
  Group,
  Text,
  Checkbox,
  Table,
  Badge,
  Select,
  Card,
  ScrollArea,
  ActionIcon,
  Tooltip,
  Progress,
  Divider,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  IconMessage,
  IconSend,
  IconX,
  IconEye,
  IconSelectAll,
} from '@tabler/icons-react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { useState, useMemo, useEffect } from 'react';
import { useAppointmentStore } from '../stores/useAppointmentStore';
import { usePatientStore } from '../stores/usePatientStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useTheme } from '../hooks/useTheme';
import type { AppointmentWithPatient } from '../types/Appointment';
import type { Patient } from '../types/Patient';
import {
  generateSMSMessage,
  getRecommendedTemplate,
  getReminderTiming,
  needsReminder,
  validatePhoneNumber,
  formatPhoneNumber,
  sendSMSReminder,
} from '../utils/sms';

interface BulkSMSRemindersProps {
  variant?: 'button' | 'icon';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  appointments?: AppointmentWithPatient[];
  onRemindersSent?: (count: number) => void;
}

interface AppointmentReminderItem {
  appointment: AppointmentWithPatient;
  patient: Patient;
  selected: boolean;
  templateId: string;
  message: string;
  hasValidPhone: boolean;
  canSendReminder: boolean;
}

export function BulkSMSReminders({
  variant = 'button',
  size = 'sm',
  appointments,
  onRemindersSent,
}: BulkSMSRemindersProps) {
  const { smsTemplates } = useSettingsStore();
  const { currentPalette, utilityColors } = useTheme();
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState(
    'appointment_reminder'
  );
  const [reminderItems, setReminderItems] = useState<AppointmentReminderItem[]>(
    []
  );
  const [sending, setSending] = useState(false);
  const [sendingProgress, setSendingProgress] = useState(0);

  const { getAppointmentsNeedingReminders, updateAppointment } =
    useAppointmentStore();
  const { patients } = usePatientStore();
  const { practitionerName } = useSettingsStore();

  // Get appointments that need reminders
  const appointmentsNeedingReminders = useMemo(() => {
    return appointments || getAppointmentsNeedingReminders();
  }, [appointments, getAppointmentsNeedingReminders]);

  // Initialize reminder items when modal opens
  useEffect(() => {
    if (opened) {
      const items: AppointmentReminderItem[] = appointmentsNeedingReminders
        .map(appointment => {
          const patient = patients.find(p => p.id === appointment.patientId);
          const templateId = getRecommendedTemplate(appointment);
          const hasValidPhone = patient?.phone
            ? validatePhoneNumber(patient.phone)
            : false;
          const canSendReminder =
            needsReminder(appointment) &&
            hasValidPhone &&
            !appointment.reminderSent;

          let message = '';
          if (patient) {
            try {
              message = generateSMSMessage(
                templateId,
                patient,
                appointment,
                practitionerName,
                smsTemplates
              );
            } catch (error) {
              console.error('Error generating message:', error);
              message = 'Błąd generowania wiadomości';
            }
          }

          return {
            appointment,
            patient: patient!,
            selected: canSendReminder,
            templateId,
            message,
            hasValidPhone,
            canSendReminder,
          };
        })
        .filter(item => item.patient); // Filter out items without patient data

      setReminderItems(items);
    }
  }, [
    opened,
    appointmentsNeedingReminders,
    patients,
    practitionerName,
    smsTemplates,
  ]);

  // Update messages when template changes
  useEffect(() => {
    if (selectedTemplateId) {
      setReminderItems(prevItems =>
        prevItems.map(item => {
          try {
            const message = generateSMSMessage(
              selectedTemplateId,
              item.patient,
              item.appointment,
              practitionerName,
              smsTemplates
            );
            return { ...item, message, templateId: selectedTemplateId };
          } catch (error) {
            console.error('Error generating message:', error);
            return { ...item, message: 'Błąd generowania wiadomości' };
          }
        })
      );
    }
  }, [selectedTemplateId, practitionerName, smsTemplates]);

  // Template options
  const templateOptions = smsTemplates.map(template => ({
    value: template.id,
    label: template.name,
  }));

  // Statistics
  const stats = useMemo(() => {
    const total = reminderItems.length;
    const selected = reminderItems.filter(item => item.selected).length;
    const canSend = reminderItems.filter(item => item.canSendReminder).length;
    const noPhone = reminderItems.filter(item => !item.hasValidPhone).length;
    const alreadySent = reminderItems.filter(
      item => item.appointment.reminderSent
    ).length;

    return { total, selected, canSend, noPhone, alreadySent };
  }, [reminderItems]);

  // Handle select all/none
  const handleSelectAll = () => {
    setReminderItems(prevItems =>
      prevItems.map(item => ({ ...item, selected: item.canSendReminder }))
    );
  };

  const handleSelectNone = () => {
    setReminderItems(prevItems =>
      prevItems.map(item => ({ ...item, selected: false }))
    );
  };

  // Handle individual selection
  const handleItemToggle = (index: number) => {
    setReminderItems(prevItems =>
      prevItems.map((item, i) =>
        i === index ? { ...item, selected: !item.selected } : item
      )
    );
  };

  // Send bulk reminders
  const handleSendReminders = async () => {
    const selectedItems = reminderItems.filter(item => item.selected);

    if (selectedItems.length === 0) {
      notifications.show({
        title: 'Brak wybranych przypomnieć',
        message: 'Wybierz co najmniej jedno przypomnienie do wysłania',
        color: 'yellow',
      });
      return;
    }

    setSending(true);
    setSendingProgress(0);

    let sentCount = 0;
    let errorCount = 0;

    for (let i = 0; i < selectedItems.length; i++) {
      const item = selectedItems[i];

      try {
        // Open SMS app for this patient
        sendSMSReminder(
          item.patient,
          item.appointment,
          item.templateId,
          practitionerName,
          smsTemplates
        );

        // Update appointment status
        await updateAppointment(item.appointment.id!, {
          reminderSent: true,
          reminderSentAt: new Date().toISOString(),
        });

        sentCount++;

        // Small delay between messages to prevent overwhelming the system
        if (i < selectedItems.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (error) {
        console.error('Error sending reminder:', error);
        errorCount++;
      }

      setSendingProgress(((i + 1) / selectedItems.length) * 100);
    }

    setSending(false);
    setSendingProgress(0);

    // Show results
    if (sentCount > 0) {
      notifications.show({
        title: 'Przypomnienia wysłane',
        message: `Wysłano ${sentCount} przypomnieć${sentCount === 1 ? '' : 'i'}${errorCount > 0 ? `, ${errorCount} błędów` : ''}`,
        color: errorCount > 0 ? 'yellow' : 'green',
      });
    }

    if (errorCount > 0 && sentCount === 0) {
      notifications.show({
        title: 'Błąd wysyłania',
        message: 'Nie udało się wysłać żadnego przypomnienia',
        color: 'red',
      });
    }

    onRemindersSent?.(sentCount);
    close();
  };

  // Render trigger button
  const renderTrigger = () => {
    const reminderCount = appointmentsNeedingReminders.length;
    const isDisabled = reminderCount === 0;

    if (variant === 'icon') {
      return (
        <Tooltip
          label={
            isDisabled
              ? 'Brak przypomnieć do wysłania'
              : `Wyślij ${reminderCount} przypomnieć`
          }
        >
          <ActionIcon
            size={size}
            variant='light'
            color='blue'
            disabled={isDisabled}
            onClick={open}
          >
            <IconMessage size='1rem' />
          </ActionIcon>
        </Tooltip>
      );
    }

    return (
      <Button
        size={size}
        variant='light'
        color='blue'
        leftSection={<IconMessage size='1rem' />}
        disabled={isDisabled}
        onClick={open}
      >
        Wyślij przypomnienia ({reminderCount})
      </Button>
    );
  };

  return (
    <>
      {renderTrigger()}

      <Modal
        opened={opened}
        onClose={close}
        title='Wyślij przypomnienia SMS'
        size='xl'
        centered
      >
        <Stack gap='md'>
          {/* Statistics */}
          <Card withBorder p='sm'>
            <Group justify='space-between'>
              <div>
                <Text size='sm' fw={500}>
                  Statystyki
                </Text>
                <Text size='xs' c='dimmed'>
                  Wybrano: {stats.selected} z {stats.total}
                </Text>
              </div>
              <Group gap='sm'>
                <Badge color={currentPalette.primary} variant='light'>
                  Do wysłania: {stats.canSend}
                </Badge>
                {stats.noPhone > 0 && (
                  <Badge color={utilityColors.error} variant='light'>
                    Brak telefonu: {stats.noPhone}
                  </Badge>
                )}
                {stats.alreadySent > 0 && (
                  <Badge color={utilityColors.success} variant='light'>
                    Już wysłane: {stats.alreadySent}
                  </Badge>
                )}
              </Group>
            </Group>
          </Card>

          {/* Template selection */}
          <Select
            label='Szablon wiadomości'
            placeholder='Wybierz szablon'
            value={selectedTemplateId}
            onChange={value =>
              setSelectedTemplateId(value || 'appointment_reminder')
            }
            data={templateOptions}
            searchable
          />

          {/* Bulk actions */}
          <Group justify='space-between'>
            <Group gap='sm'>
              <Button
                size='xs'
                variant='subtle'
                leftSection={<IconSelectAll size='0.8rem' />}
                onClick={handleSelectAll}
              >
                Zaznacz wszystkie
              </Button>
              <Button
                size='xs'
                variant='subtle'
                leftSection={<IconX size='0.8rem' />}
                onClick={handleSelectNone}
              >
                Odznacz wszystkie
              </Button>
            </Group>
            <Text size='sm' c='dimmed'>
              {stats.selected} zaznaczonych
            </Text>
          </Group>

          {/* Appointments table */}
          <ScrollArea h={400}>
            <Table highlightOnHover withRowBorders={false} striped='even'>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Wybierz</Table.Th>
                  <Table.Th>Pacjent</Table.Th>
                  <Table.Th>Telefon</Table.Th>
                  <Table.Th>Wizyta</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Podgląd</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {reminderItems.map((item, index) => (
                  <Table.Tr
                    key={item.appointment.id}
                    onClick={() => handleItemToggle(index)}
                  >
                    <Table.Td>
                      <Checkbox
                        checked={item.selected}
                        disabled={!item.canSendReminder}
                        onChange={() => handleItemToggle(index)}
                      />
                    </Table.Td>
                    <Table.Td>
                      <div>
                        <Text size='sm' fw={500}>
                          {item.patient.firstName} {item.patient.lastName}
                        </Text>
                      </div>
                    </Table.Td>
                    <Table.Td>
                      <Text size='sm' c={item.hasValidPhone ? 'dark' : 'red'}>
                        {item.patient.phone
                          ? formatPhoneNumber(item.patient.phone)
                          : 'Brak'}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <div>
                        <Text size='sm'>
                          {format(
                            new Date(item.appointment.date),
                            'dd.MM.yyyy',
                            { locale: pl }
                          )}
                        </Text>
                        <Text size='xs' c='dimmed'>
                          {format(new Date(item.appointment.date), 'HH:mm')}
                        </Text>
                      </div>
                    </Table.Td>
                    <Table.Td>
                      {item.appointment.reminderSent ? (
                        <Badge
                          color={utilityColors.success}
                          variant='light'
                          size='sm'
                        >
                          Wysłane
                        </Badge>
                      ) : item.canSendReminder ? (
                        <Badge
                          color={currentPalette.primary}
                          variant='light'
                          size='sm'
                        >
                          {getReminderTiming(item.appointment)}
                        </Badge>
                      ) : !item.hasValidPhone ? (
                        <Badge
                          color={utilityColors.error}
                          variant='light'
                          size='sm'
                        >
                          Brak telefonu
                        </Badge>
                      ) : (
                        <Badge
                          color={utilityColors.warning}
                          variant='light'
                          size='sm'
                        >
                          Poza czasem
                        </Badge>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <Tooltip label='Podgląd wiadomości'>
                        <ActionIcon
                          size='sm'
                          variant='subtle'
                          onClick={() => {
                            notifications.show({
                              title: `Wiadomość dla ${item.patient.firstName} ${item.patient.lastName}`,
                              message: item.message,
                              color: 'blue',
                              autoClose: false,
                            });
                          }}
                        >
                          <IconEye size='0.8rem' />
                        </ActionIcon>
                      </Tooltip>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </ScrollArea>

          {/* Sending progress */}
          {sending && (
            <Card withBorder p='sm'>
              <Group justify='space-between' mb='xs'>
                <Text size='sm' fw={500}>
                  Wysyłanie przypomnieć...
                </Text>
                <Text size='sm'>{Math.round(sendingProgress)}%</Text>
              </Group>
              <Progress value={sendingProgress} animated />
            </Card>
          )}

          {/* Actions */}
          <Divider />
          <Group justify='space-between'>
            <Button variant='subtle' onClick={close} disabled={sending}>
              Anuluj
            </Button>
            <Button
              leftSection={<IconSend size='1rem' />}
              onClick={handleSendReminders}
              disabled={stats.selected === 0 || sending}
              loading={sending}
            >
              Wyślij {stats.selected} przypomnieć
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
