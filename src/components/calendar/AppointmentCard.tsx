import {
  Group,
  Stack,
  Text,
  Badge,
  ActionIcon,
  Paper,
} from '@mantine/core';
import {
  IconTrash,
  IconCalendarShare,
  IconArrowRight,
  IconArrowLeft,
} from '@tabler/icons-react';
import { format } from 'date-fns';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { SMSReminderButton } from '../SMSReminderButton';
import type { AppointmentWithPatient } from '../../types/Appointment';
import type { ColorPalette } from '../../types/theme';

interface AppointmentCardProps {
  appointment: AppointmentWithPatient;
  onEdit: (a: AppointmentWithPatient) => void;
  onDelete: (id: number) => void;
  onReschedule: (a: AppointmentWithPatient) => void;
  onJumpTo: (id: number) => void;
  getStatusColor: (s: string) => string;
  getStatusLabel: (s: string) => string;
  currentPalette: ColorPalette;
  utilityColors: { error: string; success: string; warning: string };
  isDark: boolean;
  appointmentTypes: { id: string; label: string }[];
}

export function AppointmentCard({
  appointment,
  onEdit,
  onDelete,
  onReschedule,
  onJumpTo,
  getStatusColor,
  getStatusLabel,
  currentPalette,
  utilityColors,
  isDark,
  appointmentTypes,
}: AppointmentCardProps) {
  const { t } = useTranslation();
  const isRescheduled = appointment.status === 'rescheduled';
  const isCancelled = appointment.status === 'cancelled';
  const endTime = dayjs(appointment.date).add(appointment.duration || 60, 'minute');
  const typeName = appointment.type
    ? appointmentTypes.find(at => at.id === appointment.type)?.label
    : t('appointmentForm.appointmentType');

  return (
    <Paper
      p='sm'
      style={{
        backgroundColor: `${getStatusColor(appointment.status)}15`,
        border: `1px solid ${getStatusColor(appointment.status)}30`,
        borderLeft: `3px solid ${getStatusColor(appointment.status)}`,
        opacity: isRescheduled || isCancelled ? 0.6 : 1,
        cursor: 'pointer',
        borderRadius: '12px',
        transition: 'all 200ms ease',
      }}
      onClick={() => onEdit(appointment)}
    >
      <Group justify='space-between' align='flex-start' wrap='nowrap'>
        <Stack gap={4}>
          <Text size='md' fw={700} style={{ color: currentPalette.text }}>
            {appointment.patient?.firstName} {appointment.patient?.lastName}
          </Text>
          <Text size='sm' style={{ color: `${currentPalette.text}80` }}>
            {typeName}
          </Text>
          <Group gap='xs'>
            <Badge
              size='xs'
              variant='filled'
              style={{
                backgroundColor: getStatusColor(appointment.status),
                color: isDark ? currentPalette.background : '#fff',
              }}
            >
              {getStatusLabel(appointment.status)}
            </Badge>
            <Text size='xs' style={{ color: `${currentPalette.text}60` }}>
              {format(new Date(appointment.date), 'HH:mm')} - {endTime.format('HH:mm')}
            </Text>
          </Group>
        </Stack>

        <Group gap={4} wrap='nowrap'>
          {appointment.patient && !isRescheduled && (
            <SMSReminderButton
              patient={appointment.patient}
              appointment={appointment}
              variant='icon'
              size='sm'
              onReminderSent={() => window.location.reload()}
            />
          )}
          {!isRescheduled && (
            <ActionIcon
              variant='subtle'
              size='sm'
              onClick={e => { e.stopPropagation(); onReschedule(appointment); }}
              style={{ color: `${currentPalette.text}60` }}
            >
              <IconCalendarShare size='0.9rem' />
            </ActionIcon>
          )}
          <ActionIcon
            variant='subtle'
            size='sm'
            onClick={e => { e.stopPropagation(); if (appointment.id) onDelete(appointment.id); }}
            style={{ color: utilityColors.error }}
          >
            <IconTrash size='0.9rem' />
          </ActionIcon>
          {appointment.rescheduledToId && (
            <ActionIcon
              variant='subtle'
              size='sm'
              onClick={e => { e.stopPropagation(); onJumpTo(appointment.rescheduledToId!); }}
              style={{ color: currentPalette.primary }}
            >
              <IconArrowRight size='0.9rem' />
            </ActionIcon>
          )}
          {appointment.rescheduledFromId && (
            <ActionIcon
              variant='subtle'
              size='sm'
              onClick={e => { e.stopPropagation(); onJumpTo(appointment.rescheduledFromId!); }}
              style={{ color: currentPalette.primary }}
            >
              <IconArrowLeft size='0.9rem' />
            </ActionIcon>
          )}
        </Group>
      </Group>

      {appointment.price && (
        <Group gap='xs' mt={4}>
          <Text size='xs' fw={500} style={{ color: `${currentPalette.text}60` }}>
            {appointment.price} zł
          </Text>
          {appointment.paymentInfo?.isPaid ? (
            <Badge size='xs' color={utilityColors.success}>{t('status.payment.paid')}</Badge>
          ) : (
            <Badge size='xs' color={utilityColors.error}>{t('status.payment.unpaid')}</Badge>
          )}
        </Group>
      )}
    </Paper>
  );
}
