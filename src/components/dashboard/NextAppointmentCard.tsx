import { Badge, Card, Group, Stack, Text, Avatar } from '@mantine/core';
import { IconInfoCircle, IconPlayerPlay } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { Button } from '../ui/Button';
import type { AppointmentWithPatient } from '../../types/Appointment';

function getInitials(patient?: { firstName?: string; lastName?: string }): string {
  if (!patient) return '?';
  const first = patient.firstName?.charAt(0) ?? '';
  const last = patient.lastName?.charAt(0) ?? '';
  return (first + last).toUpperCase() || '?';
}

interface NextAppointmentCardProps {
  appointment: AppointmentWithPatient;
  isNow?: boolean;
}

export function NextAppointmentCard({ appointment, isNow }: NextAppointmentCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentPalette } = useTheme();
  const appointmentTypes = useSettingsStore(state => state.appointmentTypes);

  const start = new Date(appointment.date);
  const end = new Date(start.getTime() + (appointment.duration || 60) * 60 * 1000);
  const timeRange = `${start.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })} – ${end.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}`;

  const typeLabel =
    (appointment.type && appointmentTypes.find(t => t.id === appointment.type)?.label) ||
    t('dashboard.nextAppointmentCard.defaultType');

  const patientName = appointment.patient
    ? `${appointment.patient.firstName} ${appointment.patient.lastName}`.trim()
    : t('dashboard.nextAppointmentCard.unknownPatient');

  return (
    <Card
      padding="lg"
      radius="lg"
      style={{
        backgroundColor: `${currentPalette.primary}18`,
        border: `1px solid ${currentPalette.primary}50`,
      }}
    >
      <Stack gap="md">
        {/* Top row: avatar + info + badges */}
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Group gap="md" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
            <Avatar
              size={52}
              radius="xl"
              style={{
                backgroundColor: `${currentPalette.primary}30`,
                color: currentPalette.primary,
                fontWeight: 700,
                fontSize: '1.1rem',
                flexShrink: 0,
              }}
            >
              {getInitials(appointment.patient)}
            </Avatar>
            <Stack gap={3} style={{ minWidth: 0 }}>
              <Text fw={700} size="lg" style={{ color: currentPalette.text }} lineClamp={1}>
                {patientName}
              </Text>
              <Badge
                size="xs"
                radius="sm"
                style={{
                  backgroundColor: `${currentPalette.primary}25`,
                  color: currentPalette.primary,
                  border: `1px solid ${currentPalette.primary}50`,
                  width: 'fit-content',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                {t('status.patient.active')}
              </Badge>
            </Stack>
          </Group>

          {isNow && (
            <Badge
              size="sm"
              radius="md"
              style={{
                backgroundColor: `${currentPalette.primary}25`,
                color: currentPalette.primary,
                border: `1px solid ${currentPalette.primary}60`,
                flexShrink: 0,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              {t('dashboard.appointmentStatus.now')}
            </Badge>
          )}
        </Group>

        {/* Time + type row */}
        <Stack gap={2}>
          <Text
            fw={700}
            size="xl"
            style={{ color: currentPalette.text, letterSpacing: '-0.01em' }}
          >
            {timeRange}
          </Text>
          <Text size="sm" style={{ color: currentPalette.primary, fontWeight: 500 }}>
            {typeLabel}
          </Text>
        </Stack>

        {/* Action buttons */}
        <Group gap="sm">
          <Button
            variant="secondary"
            size="sm"
            leftSection={<IconInfoCircle size={16} />}
            onClick={() => navigate('/calendar')}
            style={{ flex: 1 }}
          >
            {t('dashboard.nextAppointmentCard.details')}
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftSection={<IconPlayerPlay size={16} />}
            onClick={() => navigate('/notes')}
            style={{ flex: 1 }}
          >
            {t('dashboard.nextAppointmentCard.startSession')}
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}
