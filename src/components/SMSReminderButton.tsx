import {
  Button,
  Menu,
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
import { useTranslation } from 'react-i18next';
import { useAppointmentStore } from '../stores/useAppointmentStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import {
  sendSMSReminder,
  generateSMSMessage,
  getRecommendedTemplate,
  getReminderTiming,
  needsReminder,
  validatePhoneNumber,
  formatPhoneNumber,
} from '../utils/sms';
import { BottomSheet } from './ui/BottomSheet';
import type { Appointment } from '../types/Appointment';
import type { Patient } from '../types/Patient';

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
  const { t } = useTranslation();
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
      return t('smsReminder.messageGenerationError');
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
        title: t('common.error'),
        message: t('smsReminder.invalidPhoneError'),
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
        title: t('smsReminder.reminderSent'),
        message: t('smsReminder.sendSuccess', { firstName: patient.firstName, lastName: patient.lastName }),
        color: 'green',
      });

      close();
      onReminderSent?.();
    } catch (error) {
      console.error('Error sending SMS reminder:', error);
      notifications.show({
        title: t('common.error'),
        message: t('smsReminder.sendError'),
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
                ? t('smsReminder.noPhoneNumber')
                : reminderSent
                  ? t('smsReminder.alreadySent')
                  : t('smsReminder.sendReminder')
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
              ? t('smsReminder.reminderSent')
              : t('smsReminder.sendReminder')}
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
                ? t('smsReminder.sent')
                : t('smsReminder.sms')
              : reminderSent
                ? t('smsReminder.reminderSent')
                : t('smsReminder.sendReminder')}
          </Button>
        );
    }
  };

  return (
    <>
      {renderTrigger()}

      <BottomSheet
        opened={opened}
        onClose={close}
        title={t('smsReminder.sendReminder')}
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
                    : t('smsReminder.noPhoneNumber')}
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
                ? t('smsReminder.alertTitles.alreadySent')
                : shouldSendReminder
                  ? t('smsReminder.alertTitles.recommended')
                  : t('smsReminder.alertTitles.outsideTime')
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
            label={t('smsReminder.templateLabel')}
            placeholder={t('smsReminder.templatePlaceholder')}
            value={currentTemplateId}
            onChange={value => setSelectedTemplateId(value || '')}
            data={templateOptions}
            searchable
          />

          {/* Message preview/edit */}
          <div>
            <Group justify='space-between' mb='xs'>
              <Text size='sm' fw={500}>
                {previewMode ? t('smsReminder.messagePreview') : t('smsReminder.editMessage')}
              </Text>
              <Button
                size='xs'
                variant='subtle'
                leftSection={<IconEye size='0.8rem' />}
                onClick={() => setPreviewMode(!previewMode)}
              >
                {previewMode ? t('smsReminder.edit') : t('smsReminder.preview')}
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
                placeholder={t('smsReminder.customMessagePlaceholder')}
                value={customMessage}
                onChange={e => setCustomMessage(e.target.value)}
                minRows={4}
                maxRows={6}
                autosize
              />
            )}

            <Text size='xs' c='dimmed' mt='xs'>
              {t('smsReminder.characterCount', { length: messagePreview.length })}
            </Text>
          </div>

          {/* Actions */}
          <Group justify='space-between' mt='md'>
            <Button variant='subtle' onClick={close}>
              {t('common.cancel')}
            </Button>
            <Button
              leftSection={<IconSend size='1rem' />}
              onClick={handleSendSMS}
              disabled={!hasValidPhone}
            >
              {t('smsReminder.sendSMS')}
            </Button>
          </Group>
        </Stack>
      </BottomSheet>
    </>
  );
}
