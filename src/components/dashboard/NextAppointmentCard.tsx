import { Avatar, Group, Stack, Text, ActionIcon } from '@mantine/core';
import { IconClock, IconInfoCircle, IconPlayerPlay, IconBrain, IconHourglass } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { Button } from '../ui/Button';
import type { AppointmentWithPatient } from '../../types/Appointment';

function getTimeUntil(date: Date, t: (key: string, opts?: Record<string, unknown>) => string): string {
  const diffMs = date.getTime() - Date.now();
  if (diffMs <= 0) return '';
  const totalMins = Math.round(diffMs / 60000);
  if (totalMins < 60) return t('dashboard.timeline.inMinutes', { count: totalMins });
  const hours = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  if (mins === 0) return t('dashboard.timeline.inHours', { count: hours });
  return t('dashboard.timeline.inHoursMinutes', { hours, minutes: mins });
}

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
    <div
      style={{
        backgroundColor: `${currentPalette.primary}08`,
        border: `1px solid ${currentPalette.text}10`,
        borderRadius: 16,
        padding: '24px 16px',
      }}
    >
      <div style={{ maxWidth: 420, margin: '0 auto' }}>
        <Group gap="lg" wrap="nowrap" align="flex-start">
          <Avatar
            size={52}
            radius="xl"
            style={{
              backgroundColor: `${currentPalette.primary}20`,
              color: currentPalette.primary,
              fontWeight: 700,
              fontSize: '1.1rem',
              flexShrink: 0,
              border: `2px solid ${currentPalette.primary}30`,
            }}
          >
            {getInitials(appointment.patient)}
          </Avatar>

          <Stack gap={6} style={{ flex: 1, minWidth: 0 }}>
            {/* Status label */}
            <Text
              size="xs"
              fw={800}
              style={{
                color: currentPalette.primary,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontSize: 10,
              }}
            >
              {isNow
                ? t('dashboard.appointmentStatus.now')
                : t('dashboard.nextAppointment')}
            </Text>

            {/* Patient name */}
            <Text
              fw={700}
              lineClamp={1}
              style={{
                color: currentPalette.text,
                fontSize: '1.15rem',
                lineHeight: 1.2,
              }}
            >
              {patientName}
            </Text>

            {/* Time + type info — single line */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                <IconClock size={14} style={{ color: `${currentPalette.text}60`, flexShrink: 0 }} />
                <Text size="sm" style={{ color: `${currentPalette.text}80`, whiteSpace: 'nowrap' }}>
                  {timeRange}
                </Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0, overflow: 'hidden' }}>
                <IconBrain size={14} style={{ color: `${currentPalette.text}60`, flexShrink: 0 }} />
                <Text
                  size="sm"
                  style={{
                    color: `${currentPalette.text}80`,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {typeLabel}
                </Text>
              </div>
            </div>

            {/* Time left */}
            {!isNow && (() => {
              const timeLeft = getTimeUntil(start, t);
              return timeLeft ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <IconHourglass size={14} style={{ color: currentPalette.primary, flexShrink: 0 }} />
                  <Text size="sm" fw={600} style={{ color: currentPalette.primary }}>
                    {timeLeft}
                  </Text>
                </div>
              ) : null;
            })()}
          </Stack>
        </Group>

        {/* Action buttons */}
        <Group gap="sm" mt={16} wrap="nowrap">
          <Button
            variant="primary"
            size="sm"
            leftSection={<IconPlayerPlay size={16} />}
            onClick={() => navigate('/notes')}
            style={{
              flex: 1,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              fontWeight: 700,
              padding: '10px 16px',
            }}
          >
            {t('dashboard.nextAppointmentCard.startSession')}
          </Button>
          <ActionIcon
            size={38}
            variant="subtle"
            style={{
              color: `${currentPalette.text}70`,
              border: `1px solid ${currentPalette.text}15`,
              borderRadius: 10,
              flexShrink: 0,
            }}
            onClick={() => navigate('/calendar')}
            aria-label={t('dashboard.nextAppointmentCard.details')}
          >
            <IconInfoCircle size={18} />
          </ActionIcon>
        </Group>
      </div>
    </div>
  );
}
