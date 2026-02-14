import { Group, Stack, Text, Box } from '@mantine/core';
import {
  IconCircleCheck,
  IconPlayerPlay,
  IconCalendar,
} from '@tabler/icons-react';
import { useTheme } from '../../hooks/useTheme';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { AppointmentStatus } from '../../types/Appointment';
import type { AppointmentWithPatient } from '../../types/Appointment';

interface TodaysTimelineProps {
  appointments: AppointmentWithPatient[];
  currentAppointmentId?: number;
  onSeeAll?: () => void;
}

function getStatusInfo(
  appointment: AppointmentWithPatient,
  isNow: boolean
): { label: string; icon: typeof IconCircleCheck; color: string } {
  if (appointment.status === AppointmentStatus.COMPLETED) {
    return { label: 'Zrobione', icon: IconCircleCheck, color: 'dimmed' };
  }
  if (isNow) {
    return { label: 'Teraz', icon: IconPlayerPlay, color: 'primary' };
  }
  return { label: 'Oczekuje', icon: IconCalendar, color: 'pending' };
}

export function TodaysTimeline({
  appointments,
  currentAppointmentId,
  onSeeAll,
}: TodaysTimelineProps) {
  const { currentPalette, mantineTheme } = useTheme();
  const appointmentTypes = useSettingsStore(state => state.appointmentTypes);

  if (appointments.length === 0) {
    return (
      <Stack gap="md">
        <Group justify="space-between">
          <Text size="sm" fw={600} style={{ color: currentPalette.text }}>
            Plan na dziś
          </Text>
          {onSeeAll && (
            <Text
              size="sm"
              style={{
                color: currentPalette.primary,
                cursor: 'pointer',
              }}
              onClick={onSeeAll}
              role="button"
            >
              Zobacz wszystko
            </Text>
          )}
        </Group>
        <Text size="sm" style={{ color: `${currentPalette.text}B3` }}>
          Brak wizyt na dziś.
        </Text>
      </Stack>
    );
  }

  return (
    <Stack gap={0}>
      <Group justify="space-between" mb="sm">
        <Text size="sm" fw={600} style={{ color: currentPalette.text }}>
          Plan na dziś
        </Text>
        {onSeeAll && (
          <Text
            size="sm"
            style={{
              color: currentPalette.primary,
              cursor: 'pointer',
            }}
            onClick={onSeeAll}
            role="button"
          >
            Zobacz wszystko
          </Text>
        )}
      </Group>

      <Stack gap={0} style={{ position: 'relative' }}>
        {appointments.map((apt, index) => {
          const start = new Date(apt.date);
          const timeStr = start.toLocaleTimeString('pl-PL', {
            hour: '2-digit',
            minute: '2-digit',
          });
          const isNow = apt.id === currentAppointmentId;
          const statusInfo = getStatusInfo(apt, isNow);
          const Icon = statusInfo.icon;
          const patientName = apt.patient
            ? `${apt.patient.firstName} ${apt.patient.lastName}`.trim()
            : 'Pacjent';
          const typeLabel =
            (apt.type && appointmentTypes.find(t => t.id === apt.type)?.label) || 'Wizyta';
          const isLast = index === appointments.length - 1;

          const statusColor =
            statusInfo.color === 'primary'
              ? currentPalette.primary
              : statusInfo.color === 'dimmed'
                ? `${currentPalette.text}99`
                : `${currentPalette.text}B3`;

          return (
            <Group
              key={apt.id ?? index}
              align="flex-start"
              gap="md"
              style={{
                position: 'relative',
                paddingBottom: isLast ? 0 : mantineTheme.spacing?.lg ?? 16,
              }}
            >
              {/* Timeline line */}
              {!isLast && (
                <Box
                  style={{
                    position: 'absolute',
                    left: 11,
                    top: 28,
                    bottom: 0,
                    width: 2,
                    backgroundColor: `${currentPalette.primary}30`,
                  }}
                />
              )}
              <Box
                style={{
                  flexShrink: 0,
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  backgroundColor: `${currentPalette.primary}40`,
                  color: statusColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1,
                }}
              >
                <Icon size={14} stroke={2} />
              </Box>
              <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
                <Text size="sm" fw={500} style={{ color: currentPalette.text }}>
                  {timeStr}
                </Text>
                <Text size="sm" style={{ color: currentPalette.text }}>
                  {patientName}
                </Text>
                <Text size="xs" style={{ color: `${currentPalette.text}B3` }}>
                  {typeLabel}
                </Text>
                <Text
                  size="xs"
                  fw={500}
                  style={{
                    color: statusColor,
                  }}
                >
                  {statusInfo.label}
                </Text>
              </Stack>
            </Group>
          );
        })}
      </Stack>
    </Stack>
  );
}
