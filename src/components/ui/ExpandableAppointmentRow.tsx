import {
  Button,
  Card,
  Group,
  Box,
  Text,
  Badge,
  ActionIcon,
  Collapse,
  Divider,
  Stack,
} from '@mantine/core';
import {
  IconEdit,
  IconTrash,
  IconCalendarShare,
  IconArrowRight,
  IconArrowLeft,
  IconLink,
  IconChevronUp,
  IconChevronDown,
} from '@tabler/icons-react';
import { format } from 'date-fns';
import { useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { SMSReminderButton } from '../SMSReminderButton';
import type { AppointmentWithPatient } from '../../types/Appointment';

interface ExpandableAppointmentRowProps {
  appointment: AppointmentWithPatient;
  onEditAppointment: (appointment: AppointmentWithPatient) => void;
  onDeleteAppointment: (id: number) => void;
  onRescheduleAppointment?: (appointment: AppointmentWithPatient) => void;
  onJumpToAppointment?: (id: number) => void;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
  utilityColors?: {
    error: string;
    success: string;
    warning: string;
  };
}

export function ExpandableAppointmentRow({
  appointment,
  onEditAppointment,
  onDeleteAppointment,
  onRescheduleAppointment,
  onJumpToAppointment,
  getStatusColor,
  getStatusLabel,
  utilityColors,
}: ExpandableAppointmentRowProps) {
  const [expanded, setExpanded] = useState(false);
  const { currentPalette, utilityColors: themeUtilityColors } = useTheme();
  const appointmentTypes = useSettingsStore(state => state.appointmentTypes);

  // Use passed utilityColors or fallback to theme's utilityColors
  const colors = utilityColors || themeUtilityColors;

  const typeLabel =
    (appointment.type &&
      appointmentTypes.find(t => t.id === appointment.type)?.label) ||
    'Wizyta';

  const isRescheduled = appointment.status === 'rescheduled';
  const isCancelled = appointment.status === 'cancelled';

  return (
    <Card
      shadow='sm'
      p='md'
      mb='sm'
      style={{
        cursor: 'pointer',
        opacity: isRescheduled || isCancelled ? 0.7 : 1,
        borderLeft: isRescheduled || isCancelled ? `4px solid ${isCancelled ? colors.error : currentPalette.text}40` : undefined,
      }}
    >
      {/* Main row - always visible */}
      <Group
        justify='space-between'
        onClick={() => setExpanded(!expanded)}
        wrap='nowrap'
      >
        <Box style={{ flex: 1, minWidth: 0 }}>
          <Group gap='sm' wrap='nowrap'>
            <Text fw={600} size='sm'>
              {format(new Date(appointment.date), 'HH:mm')}
            </Text>
            <Text
              fw={500}
              size='sm'
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flex: 1,
              }}
            >
              {appointment.patient?.firstName} {appointment.patient?.lastName}
            </Text>
          </Group>
          <Group gap='xs' mt='xs'>
            <Badge color={getStatusColor(appointment.status)} size='sm'>
              {getStatusLabel(appointment.status)}
            </Badge>
            {appointment.price && (
              <Text size='xs' c='dimmed' fw={500}>
                {appointment.price} zł
              </Text>
            )}
            {isRescheduled && (
              <Badge variant='outline' color='gray' size='xs' leftSection={<IconLink size='0.7rem' />}>
                Historia
              </Badge>
            )}
          </Group>
        </Box>

        <ActionIcon
          variant='subtle'
          size='sm'
          onClick={e => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
        >
          {expanded ? <IconChevronUp /> : <IconChevronDown />}
        </ActionIcon>
      </Group>

      {/* Expanded details */}
      <Collapse in={expanded}>
        <Divider my='md' />
        <Stack gap='sm'>
          {/* Linked Appointments */}
          {appointment.rescheduledToId && onJumpToAppointment && (
            <Button
              variant='light'
              color='blue'
              size='xs'
              fullWidth
              leftSection={<IconArrowRight size='1rem' />}
              onClick={(e) => {
                e.stopPropagation();
                onJumpToAppointment(appointment.rescheduledToId!);
              }}
            >
              Idź do nowej wizyty
            </Button>
          )}
          {appointment.rescheduledFromId && onJumpToAppointment && (
            <Button
              variant='light'
              color='gray'
              size='xs'
              fullWidth
              leftSection={<IconArrowLeft size='1rem' />}
              onClick={(e) => {
                e.stopPropagation();
                onJumpToAppointment(appointment.rescheduledFromId!);
              }}
            >
              Pokaż poprzednią wizytę
            </Button>
          )}

          {/* Patient details */}
          {appointment.patient?.phone && (
            <Group justify='space-between'>
              <Text size='sm' c='dimmed'>
                Telefon:
              </Text>
              <Text size='sm'>{appointment.patient.phone}</Text>
            </Group>
          )}

          {/* Appointment details */}
          {isCancelled && (
            <Box p='sm' style={{ backgroundColor: `${colors.error}15`, borderRadius: '8px' }}>
              <Stack gap='xs'>
                <Group justify='space-between'>
                  <Text size='sm' fw={600} color={colors.error}>Odwołana wizyta</Text>
                  {appointment.cancelledAt && (
                    <Text size='xs' c='dimmed'>{format(new Date(appointment.cancelledAt), 'dd.MM.yyyy HH:mm')}</Text>
                  )}
                </Group>
                <Group justify='space-between'>
                  <Text size='sm' c='dimmed'>Wymaga płatności:</Text>
                  <Badge color={appointment.requiresPayment ? 'orange' : 'gray'} size='sm'>
                    {appointment.requiresPayment ? 'TAK' : 'NIE'}
                  </Badge>
                </Group>
                {appointment.cancellationReason && (
                  <>
                    <Text size='xs' fw={500} c='dimmed'>Powód:</Text>
                    <Text size='sm' fs='italic'>{appointment.cancellationReason}</Text>
                  </>
                )}
              </Stack>
            </Box>
          )}

          <Group justify='space-between'>
            <Text size='sm' c='dimmed'>
              Typ wizyty:
            </Text>
            <Text size='sm'>{typeLabel}</Text>
          </Group>

          <Group justify='space-between'>
            <Text size='sm' c='dimmed'>
              Czas trwania:
            </Text>
            <Text size='sm'>{appointment.duration} min</Text>
          </Group>

          {appointment.price && (
            <Group justify='space-between'>
              <Text size='sm' c='dimmed'>
                Cena:
              </Text>
              <Text size='sm' fw={500}>
                {appointment.price} zł
              </Text>
            </Group>
          )}

          <Group justify='space-between'>
            <Text size='sm' c='dimmed'>
              Płatność:
            </Text>
            {appointment.paymentInfo?.isPaid ? (
              <Badge color={colors.success} size='sm'>
                Opłacono
              </Badge>
            ) : (
              <Badge color={colors.error} size='sm'>
                Nieopłacono
              </Badge>
            )}
          </Group>

          {appointment.notes && (
            <>
              <Text size='sm' c='dimmed'>
                Notatki:
              </Text>
              <Box p='xs' style={{ backgroundColor: `${currentPalette.background}50`, borderRadius: '4px' }}>
                <Text size='sm' style={{ whiteSpace: 'pre-wrap' }}>{appointment.notes}</Text>
              </Box>
            </>
          )}

          {/* Actions */}
          <Divider my='xs' />
          <Group justify='flex-end' gap='xs'>
            {appointment.patient && !isRescheduled && (
              <SMSReminderButton
                patient={appointment.patient}
                appointment={appointment}
                variant='button'
                size='sm'
                onReminderSent={() => {
                  // Refresh appointments
                  window.location.reload();
                }}
              />
            )}
            {!isRescheduled && onRescheduleAppointment && (
              <Button
                variant='light'
                color='blue'
                size='sm'
                leftSection={<IconCalendarShare size='1rem' />}
                onClick={(e) => {
                  e.stopPropagation();
                  onRescheduleAppointment(appointment);
                }}
              >
                Przełóż
              </Button>
            )}
            <ActionIcon
              variant='light'
              color={currentPalette.primary}
              size='lg'
              onClick={e => {
                e.stopPropagation();
                onEditAppointment(appointment);
              }}
            >
              <IconEdit size='1.2rem' />
            </ActionIcon>
            <ActionIcon
              variant='light'
              color={colors.error}
              size='lg'
              onClick={e => {
                e.stopPropagation();
                if (appointment.id) onDeleteAppointment(appointment.id);
              }}
            >
              <IconTrash size='1.2rem' />
            </ActionIcon>
          </Group>
        </Stack>
      </Collapse>
    </Card>
  );
}
