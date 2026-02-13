import { Card, Group, Stack, Text, Avatar } from '@mantine/core';
import { IconInfoCircle, IconPlayerPlay } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { AppointmentType } from '../../types/Appointment';
import { Button } from '../ui/Button';
import type { AppointmentWithPatient } from '../../types/Appointment';

const TYPE_LABELS: Record<string, string> = {
  [AppointmentType.INITIAL]: 'Wizyta wstępna',
  [AppointmentType.FOLLOW_UP]: 'Wizyta kontrolna',
  [AppointmentType.THERAPY]: 'Terapia',
  [AppointmentType.CONSULTATION]: 'Konsultacja',
  [AppointmentType.ASSESSMENT]: 'Ocena',
};

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
  const navigate = useNavigate();
  const { currentPalette, mantineTheme } = useTheme();
  const start = new Date(appointment.date);
  const end = new Date(start.getTime() + (appointment.duration || 60) * 60 * 1000);
  const timeRange = `${start.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}`;
  const typeLabel = (appointment.type && TYPE_LABELS[appointment.type]) || 'Wizyta';
  const patientName = appointment.patient
    ? `${appointment.patient.firstName} ${appointment.patient.lastName}`.trim()
    : 'Pacjent';

  return (
    <Card
      padding="lg"
      radius="md"
      style={{
        backgroundColor: `${currentPalette.primary}20`,
        border: `1px solid ${currentPalette.primary}60`,
      }}
    >
      <Stack gap={mantineTheme.spacing?.md ?? 'md'}>
        <Group justify="space-between" align="flex-start">
          <Group gap="md">
            <Avatar
              radius="xl"
              color={currentPalette.primary}
              style={{
                backgroundColor: `${currentPalette.primary}40`,
                color: currentPalette.text,
              }}
            >
              {getInitials(appointment.patient)}
            </Avatar>
            <Stack gap={4}>
              <Text fw={600} size="lg" style={{ color: currentPalette.text }}>
                {patientName}
              </Text>
              <Text size="sm" style={{ color: `${currentPalette.text}B3` }}>
                {timeRange}
              </Text>
              <Text size="sm" fw={500} style={{ color: currentPalette.primary }}>
                {typeLabel}
              </Text>
            </Stack>
          </Group>
          {isNow && (
            <Text
              size="xs"
              fw={700}
              style={{
                color: currentPalette.primary,
                backgroundColor: `${currentPalette.primary}30`,
                padding: '4px 10px',
                borderRadius: mantineTheme.radius?.md ?? 8,
              }}
            >
              TERAZ
            </Text>
          )}
        </Group>
        <Group gap="sm">
          <Button
            variant="secondary"
            size="sm"
            leftSection={<IconInfoCircle size={16} />}
            onClick={() => navigate('/calendar')}
          >
            Szczegóły
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftSection={<IconPlayerPlay size={16} />}
            onClick={() => navigate('/notes')}
          >
            Rozpocznij sesję
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}
