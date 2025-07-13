import {
  Button,
  Menu,
  Modal,
  Stack,
  Group,
  Text,
  Select,
  Textarea,
  Alert,
  ActionIcon,
  Tooltip,
  Card,
  ScrollArea,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  IconMessage,
  IconChevronDown,
  IconEye,
  IconSend,
  IconClock,
  IconCheck,
  IconAlertCircle,
} from '@tabler/icons-react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { useState, useMemo } from 'react';
import { useAppointmentStore } from '../stores/useAppointmentStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import type { Appointment } from '../types/Appointment';
import type { Patient } from '../types/Patient';
import {
  sendSMSReminder,
  generateSMSMessage,
  getRecommendedTemplate,
  getReminderTiming,
  needsReminder,
  validatePhoneNumber,
  formatPhoneNumber,
} from '../utils/sms';

interface SMSReminderButtonProps {
  patient: Patient;
  appointment: Appointment;
  variant?: 'button' | 'icon' | 'menu-item';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  compact?: boolean;
  onReminderSent?: () => void;
}

export function SMSReminderButton({
  patient,
  appointment,
  variant = 'button',
  size = 'sm',
  compact = false,
  onReminderSent,
}: SMSReminderButtonProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [customMessage, setCustomMessage] = useState('');
  const [previewMode, setPreviewMode] = useState(false);

  const { practitionerName, smsTemplates } = useSettingsStore();
  const { updateAppointment } = useAppointmentStore();

  // Get recommended template on mount
  const recommendedTemplateId = useMemo(() => {
    return getRecommendedTemplate(appointment);
  }, [appointment]);

  // Set recommended template as default
  const currentTemplateId = selectedTemplateId || recommendedTemplateId;

  // Generate message preview
  const messagePreview = useMemo(() => {
    if (customMessage.trim()) {
      return customMessage;
    }

    try {
      return generateSMSMessage(
        currentTemplateId,
        patient,
        appointment,
        practitionerName,
        smsTemplates
      );
    } catch (error) {
      console.error('Error generating SMS message:', error);
      return 'Błąd generowania wiadomości';
    }
  }, [
    currentTemplateId,
    patient,
    appointment,
    practitionerName,
    smsTemplates,
    customMessage,
  ]);

  // Check if patient has valid phone number
  const hasValidPhone = patient.phone && validatePhoneNumber(patient.phone);

  // Get reminder status info
  const reminderTiming = getReminderTiming(appointment);
  const shouldSendReminder = needsReminder(appointment);

  // Handle SMS sending
  const handleSendSMS = async () => {
    if (!hasValidPhone) {
      notifications.show({
        title: 'Błąd',
        message: 'Pacjent nie ma prawidłowego numeru telefonu',
        color: 'red',
      });
      return;
    }

    try {
      // Open SMS app
      sendSMSReminder(
        patient,
        appointment,
        currentTemplateId,
        practitionerName,
        smsTemplates
      );

      // Update appointment with reminder status
      await updateAppointment(appointment.id!, {
        reminderSent: true,
        reminderSentAt: new Date().toISOString(),
      });

      notifications.show({
        title: 'Przypomnienie wysłane',
        message: `Otwarto aplikację SMS z wiadomością dla ${patient.firstName} ${patient.lastName}`,
        color: 'green',
      });

      close();
      onReminderSent?.();
    } catch (error) {
      console.error('Error sending SMS reminder:', error);
      notifications.show({
        title: 'Błąd',
        message: 'Nie udało się wysłać przypomnienia',
        color: 'red',
      });
    }
  };

  // Template options for select
  const templateOptions = smsTemplates.map(template => ({
    value: template.id,
    label: template.name,
  }));

  // Render different variants
  const renderTrigger = () => {
    const isDisabled = !hasValidPhone;
    const reminderSent = appointment.reminderSent;

    switch (variant) {
      case 'icon':
        return (
          <Tooltip
            label={
              isDisabled
                ? 'Brak numeru telefonu'
                : reminderSent
                  ? 'Przypomnienie już wysłane'
                  : 'Wyślij przypomnienie SMS'
            }
          >
            <ActionIcon
              size={size}
              variant={reminderSent ? 'filled' : 'light'}
              color={reminderSent ? 'green' : 'blue'}
              disabled={isDisabled}
              onClick={open}
            >
              {reminderSent ? (
                <IconCheck size='1rem' />
              ) : (
                <IconMessage size='1rem' />
              )}
            </ActionIcon>
          </Tooltip>
        );

      case 'menu-item':
        return (
          <Menu.Item
            leftSection={<IconMessage size='1rem' />}
            disabled={isDisabled}
            onClick={open}
          >
            {reminderSent
              ? 'Przypomnienie wysłane'
              : 'Wyślij przypomnienie SMS'}
          </Menu.Item>
        );

      default:
        return (
          <Button
            size={size}
            variant={reminderSent ? 'filled' : 'light'}
            color={reminderSent ? 'green' : 'blue'}
            leftSection={
              reminderSent ? (
                <IconCheck size='1rem' />
              ) : (
                <IconMessage size='1rem' />
              )
            }
            rightSection={
              compact ? undefined : <IconChevronDown size='0.8rem' />
            }
            disabled={isDisabled}
            onClick={open}
          >
            {compact
              ? reminderSent
                ? 'Wysłane'
                : 'SMS'
              : reminderSent
                ? 'Przypomnienie wysłane'
                : 'Wyślij przypomnienie SMS'}
          </Button>
        );
    }
  };

  return (
    <>
      {renderTrigger()}

      <Modal
        opened={opened}
        onClose={close}
        title='Wyślij przypomnienie SMS'
        size='md'
        centered
      >
        <Stack gap='md'>
          {/* Patient info */}
          <Card withBorder p='sm'>
            <Group justify='space-between'>
              <div>
                <Text fw={500}>
                  {patient.firstName} {patient.lastName}
                </Text>
                <Text size='sm' c='dimmed'>
                  {hasValidPhone
                    ? formatPhoneNumber(patient.phone!)
                    : 'Brak numeru telefonu'}
                </Text>
              </div>
              <div style={{ textAlign: 'right' }}>
                <Text size='sm' fw={500}>
                  {format(new Date(appointment.date), 'dd.MM.yyyy', {
                    locale: pl,
                  })}
                </Text>
                <Text size='sm' c='dimmed'>
                  {format(new Date(appointment.date), 'HH:mm')}
                </Text>
              </div>
            </Group>
          </Card>

          {/* Reminder status */}
          <Alert
            icon={
              appointment.reminderSent ? (
                <IconCheck size='1rem' />
              ) : shouldSendReminder ? (
                <IconClock size='1rem' />
              ) : (
                <IconAlertCircle size='1rem' />
              )
            }
            color={
              appointment.reminderSent
                ? 'green'
                : shouldSendReminder
                  ? 'blue'
                  : 'yellow'
            }
            title={
              appointment.reminderSent
                ? 'Przypomnienie już wysłane'
                : shouldSendReminder
                  ? 'Zalecane wysłanie przypomnienia'
                  : 'Poza optymalnym czasem'
            }
          >
            <Text size='sm'>
              {appointment.reminderSent
                ? `Wysłano: ${format(new Date(appointment.reminderSentAt!), 'dd.MM.yyyy HH:mm', { locale: pl })}`
                : `Wizyta: ${reminderTiming}`}
            </Text>
          </Alert>

          {/* Template selection */}
          <Select
            label='Szablon wiadomości'
            placeholder='Wybierz szablon'
            value={currentTemplateId}
            onChange={value => setSelectedTemplateId(value || '')}
            data={templateOptions}
            searchable
          />

          {/* Message preview/edit */}
          <div>
            <Group justify='space-between' mb='xs'>
              <Text size='sm' fw={500}>
                {previewMode ? 'Podgląd wiadomości' : 'Edytuj wiadomość'}
              </Text>
              <Button
                size='xs'
                variant='subtle'
                leftSection={<IconEye size='0.8rem' />}
                onClick={() => setPreviewMode(!previewMode)}
              >
                {previewMode ? 'Edytuj' : 'Podgląd'}
              </Button>
            </Group>

            {previewMode ? (
              <Card withBorder p='sm'>
                <ScrollArea h={120}>
                  <Text size='sm' style={{ whiteSpace: 'pre-wrap' }}>
                    {messagePreview}
                  </Text>
                </ScrollArea>
              </Card>
            ) : (
              <Textarea
                placeholder='Wpisz własną wiadomość lub zostaw puste aby użyć szablonu'
                value={customMessage}
                onChange={e => setCustomMessage(e.target.value)}
                minRows={4}
                maxRows={6}
                autosize
              />
            )}

            <Text size='xs' c='dimmed' mt='xs'>
              Długość: {messagePreview.length} znaków
            </Text>
          </div>

          {/* Actions */}
          <Group justify='space-between' mt='md'>
            <Button variant='subtle' onClick={close}>
              Anuluj
            </Button>
            <Button
              leftSection={<IconSend size='1rem' />}
              onClick={handleSendSMS}
              disabled={!hasValidPhone}
            >
              Wyślij SMS
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
