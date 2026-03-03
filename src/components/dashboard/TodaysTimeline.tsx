import { Badge, Group, Stack, Text, UnstyledButton } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { AppointmentStatus } from '../../types/Appointment';
import type { AppointmentWithPatient } from '../../types/Appointment';

interface TodaysTimelineProps {
  appointments: AppointmentWithPatient[];
  currentAppointmentId?: number;
  onSeeAll?: () => void;
}

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

export function TodaysTimeline({
  appointments,
  currentAppointmentId,
  onSeeAll,
}: TodaysTimelineProps) {
  const { t } = useTranslation();
  const { currentPalette } = useTheme();
  const appointmentTypes = useSettingsStore(state => state.appointmentTypes);
  const now = Date.now();

  // Find the next upcoming appointment (first scheduled one that hasn't started yet)
  const nextUpcomingId = appointments.find(apt => {
    if (apt.status !== AppointmentStatus.SCHEDULED) return false;
    return new Date(apt.date).getTime() > now;
  })?.id;

  const header = (
    <Group justify="space-between" mb="md">
      <Text size="sm" fw={600} style={{ color: currentPalette.text }}>
        {t('dashboard.todaysPlan')}
      </Text>
      {onSeeAll && (
        <UnstyledButton onClick={onSeeAll}>
          <Text size="sm" fw={500} style={{ color: currentPalette.primary }}>
            {t('dashboard.seeAll')}
          </Text>
        </UnstyledButton>
      )}
    </Group>
  );

  if (appointments.length === 0) {
    return (
      <Stack gap="xs">
        {header}
        <Text size="sm" style={{ color: `${currentPalette.text}70` }}>
          {t('dashboard.noAppointmentsToday')}
        </Text>
      </Stack>
    );
  }

  return (
    <Stack gap={0}>
      {header}

      <Stack gap={0}>
        {appointments.map((apt, index) => {
          const start = new Date(apt.date);
          const timeStr = start.toLocaleTimeString('pl-PL', {
            hour: '2-digit',
            minute: '2-digit',
          });
          const isNow = apt.id === currentAppointmentId;
          const isNextUp = apt.id === nextUpcomingId;
          const isDone = apt.status === AppointmentStatus.COMPLETED;
          const isLast = index === appointments.length - 1;

          const patientName = apt.patient
            ? `${apt.patient.firstName} ${apt.patient.lastName}`.trim()
            : t('dashboard.nextAppointmentCard.unknownPatient');
          const typeLabel =
            (apt.type && appointmentTypes.find(tp => tp.id === apt.type)?.label) ||
            t('dashboard.nextAppointmentCard.defaultType');

          const timeUntil = isNextUp ? getTimeUntil(start, t) : '';

          // Status badge
          let badgeLabel = '';
          let badgeBg = '';
          let badgeColor = '';
          if (isNow) {
            badgeLabel = t('dashboard.appointmentStatus.now');
            badgeBg = `${currentPalette.primary}20`;
            badgeColor = currentPalette.primary;
          } else if (isDone) {
            badgeLabel = t('dashboard.appointmentStatus.done');
            badgeBg = `${currentPalette.text}10`;
            badgeColor = `${currentPalette.text}60`;
          }

          const rowBg = isNow ? `${currentPalette.primary}08` : 'transparent';

          return (
            <div
              key={apt.id ?? index}
              style={{
                display: 'grid',
                gridTemplateColumns: '52px 1fr auto',
                gap: '0 12px',
                alignItems: 'center',
                padding: '14px 12px',
                borderBottom: isLast
                  ? 'none'
                  : `1px solid ${currentPalette.primary}15`,
                borderRadius: isNow ? 10 : 0,
                backgroundColor: rowBg,
                margin: isNow ? '2px 0' : 0,
              }}
            >
              {/* Time */}
              <Stack gap={0} align="flex-start">
                <Text
                  size="sm"
                  fw={isNow ? 700 : 500}
                  style={{
                    color: isNow
                      ? currentPalette.primary
                      : isDone
                        ? `${currentPalette.text}50`
                        : `${currentPalette.text}CC`,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {timeStr}
                </Text>
                {isNextUp && timeUntil && (
                  <Text
                    size="xs"
                    style={{ color: currentPalette.primary, fontWeight: 500, marginTop: 1 }}
                  >
                    {timeUntil}
                  </Text>
                )}
              </Stack>

              {/* Patient + type */}
              <Stack gap={2} style={{ minWidth: 0 }}>
                <Text
                  size="sm"
                  fw={600}
                  lineClamp={1}
                  style={{
                    color: isDone ? `${currentPalette.text}70` : currentPalette.text,
                  }}
                >
                  {patientName}
                </Text>
                <Text
                  size="xs"
                  lineClamp={1}
                  style={{ color: `${currentPalette.text}60` }}
                >
                  {typeLabel}
                </Text>
              </Stack>

              {/* Status badge (only for now/done) */}
              <div style={{ flexShrink: 0 }}>
                {badgeLabel ? (
                  <Badge
                    size="xs"
                    radius="sm"
                    style={{
                      backgroundColor: badgeBg,
                      color: badgeColor,
                      border: `1px solid ${badgeColor}50`,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      fontWeight: 700,
                    }}
                  >
                    {badgeLabel}
                  </Badge>
                ) : null}
              </div>
            </div>
          );
        })}
      </Stack>
    </Stack>
  );
}
