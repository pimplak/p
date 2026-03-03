import { Avatar, Group, Stack, Text, ActionIcon } from '@mantine/core';
import { IconClock, IconInfoCircle, IconPlayerPlay, IconBrain } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { getTimeUntil } from '../../utils/dates';
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

  const timeUntilLabel = isNow
    ? t('dashboard.appointmentStatus.now')
    : getTimeUntil(start, t) || t('dashboard.nextAppointment');

  const patientName = appointment.patient
    ? `${appointment.patient.firstName} ${appointment.patient.lastName}`.trim()
    : t('dashboard.nextAppointmentCard.unknownPatient');

  return (
    <div
      style={{
        backgroundColor: `${currentPalette.primary}08`,
        borderTop: `1px solid ${currentPalette.text}10`,
        borderBottom: `1px solid ${currentPalette.text}10`,
        padding: '48px 28px',
      }}
    >
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <Group gap="lg" wrap="nowrap" align="flex-start">
          <Avatar
            size={72}
            radius="xl"
            style={{
              backgroundColor: `${currentPalette.primary}20`,
              color: currentPalette.primary,
              fontWeight: 700,
              fontSize: '1.4rem',
              flexShrink: 0,
              border: `2px solid ${currentPalette.primary}30`,
            }}
          >
            {getInitials(appointment.patient)}
          </Avatar>

          <Stack gap={12} style={{ flex: 1, minWidth: 0 }}>
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
              {timeUntilLabel}
            </Text>

            {/* Patient name */}
            <Text
              fw={800}
              lineClamp={1}
              style={{
                color: currentPalette.text,
                fontSize: '1.4rem',
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
          </Stack>
        </Group>

        {/* Action buttons */}
        <Group gap="sm" mt={28} wrap="nowrap">
          <Button
            variant="primary"
            size="md"
            leftSection={<IconPlayerPlay size={18} />}
            onClick={() => navigate('/notes')}
            style={{
              flex: 1,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              fontWeight: 700,
              padding: '14px 20px',
            }}
          >
            {t('dashboard.nextAppointmentCard.startSession')}
          </Button>
          <ActionIcon
            size={48}
            variant="subtle"
            style={{
              color: `${currentPalette.text}70`,
              border: `1px solid ${currentPalette.text}15`,
              borderRadius: 12,
              flexShrink: 0,
            }}
            onClick={() => navigate('/calendar')}
            aria-label={t('dashboard.nextAppointmentCard.details')}
          >
            <IconInfoCircle size={20} />
          </ActionIcon>
        </Group>
      </div>
    </div>
  );
}
