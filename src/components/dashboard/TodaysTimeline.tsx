import { ActionIcon, Badge, Group, Menu, Stack, Text, UnstyledButton } from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import {
  IconBuilding,
  IconCalendar,
  IconCheck,
  IconDots,
  IconUser,
  IconVideo,
  IconX,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { APPOINTMENT_TYPES_TEMPLATE } from '../../constants/defaults';
import { useTheme } from '../../hooks/useTheme';
import { useAppointmentStore } from '../../stores/useAppointmentStore';
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

function formatTime(date: Date): string {
  return date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
}

const TIME_COL_WIDTH = 52;
const LINE_COL_WIDTH = 20;

export function TodaysTimeline({
  appointments,
  currentAppointmentId,
  onSeeAll,
}: TodaysTimelineProps) {
  const { t } = useTranslation();
  const { currentPalette } = useTheme();
  const navigate = useNavigate();
  const appointmentTypes = useSettingsStore(state => state.appointmentTypes);
  const { updateAppointment } = useAppointmentStore();
  const now = Date.now();

  const nextUpcomingId = appointments.find(apt => {
    if (apt.status !== AppointmentStatus.SCHEDULED) return false;
    return new Date(apt.date).getTime() > now;
  })?.id;

  const handleMarkComplete = async (apt: AppointmentWithPatient) => {
    if (!apt.id) return;
    try {
      await updateAppointment(apt.id, { status: AppointmentStatus.COMPLETED });
      notifications.show({
        message: t('dashboard.timeline.markedComplete'),
        color: 'green',
      });
    } catch {
      notifications.show({
        message: t('common.error'),
        color: 'red',
      });
    }
  };

  const handleCancel = (apt: AppointmentWithPatient) => {
    if (!apt.id) return;
    const patientName = apt.patient
      ? `${apt.patient.firstName} ${apt.patient.lastName}`.trim()
      : t('dashboard.nextAppointmentCard.unknownPatient');

    modals.openConfirmModal({
      title: t('dashboard.timeline.menuCancel'),
      children: (
        <Text size="sm" style={{ color: `${currentPalette.text}CC` }}>
          {t('dashboard.timeline.cancelConfirm', { name: patientName })}
        </Text>
      ),
      labels: {
        confirm: t('dashboard.timeline.menuCancel'),
        cancel: t('common.cancel'),
      },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await updateAppointment(apt.id!, {
            status: AppointmentStatus.CANCELLED,
            cancelledAt: new Date().toISOString(),
          });
          notifications.show({
            message: t('dashboard.timeline.cancelledSuccess'),
            color: 'orange',
          });
        } catch {
          notifications.show({ message: t('common.error'), color: 'red' });
        }
      },
    });
  };

  const header = (
    <Group justify="space-between" mb="lg" align="center">
      <Text
        size="xs"
        fw={700}
        style={{
          color: `${currentPalette.text}60`,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}
      >
        {t('dashboard.todaysPlan')}
      </Text>
      {onSeeAll && (
        <UnstyledButton onClick={onSeeAll}>
          <Text
            size="xs"
            fw={700}
            style={{
              color: currentPalette.primary,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            {t('dashboard.timeline.viewCalendar')}
          </Text>
        </UnstyledButton>
      )}
    </Group>
  );

  if (appointments.length === 0) {
    return (
      <Stack gap="xs">
        {header}
        <Text size="sm" style={{ color: `${currentPalette.text}60` }}>
          {t('dashboard.noAppointmentsToday')}
        </Text>
      </Stack>
    );
  }

  return (
    <Stack gap={0}>
      {header}

      <div style={{ position: 'relative' }}>
        {/* Vertical timeline line */}
        <div
          style={{
            position: 'absolute',
            left: TIME_COL_WIDTH + LINE_COL_WIDTH / 2 - 0.5,
            top: 16,
            bottom: 16,
            width: 1,
            backgroundColor: `${currentPalette.primary}25`,
            pointerEvents: 'none',
          }}
        />

        <Stack gap={10}>
          {appointments.map((apt, index) => {
            const start = new Date(apt.date);
            const end = new Date(start.getTime() + (apt.duration ?? 60) * 60 * 1000);
            const timeStr = formatTime(start);
            const endTimeStr = formatTime(end);

            const isNow = apt.id === currentAppointmentId;
            const isNextUp = apt.id === nextUpcomingId;
            const isDone = apt.status === AppointmentStatus.COMPLETED;
            const isCancelled = apt.status === AppointmentStatus.CANCELLED;
            const isScheduled = apt.status === AppointmentStatus.SCHEDULED;

            const patientName = apt.patient
              ? `${apt.patient.firstName} ${apt.patient.lastName}`.trim()
              : t('dashboard.nextAppointmentCard.unknownPatient');
            const typeLabel =
              (apt.type && appointmentTypes.find(tp => tp.id === apt.type)?.label) ||
              t('dashboard.nextAppointmentCard.defaultType');

            const timeUntil = isNextUp ? getTimeUntil(start, t) : '';

            const isOnline = apt.type === APPOINTMENT_TYPES_TEMPLATE.ONLINE_SESSION;
            const isInPerson = apt.type === APPOINTMENT_TYPES_TEMPLATE.IN_PERSON_SESSION;

            const DOT_TOP = isNow ? 20 : 14;

            return (
              <div
                key={apt.id ?? index}
                style={{
                  display: 'grid',
                  gridTemplateColumns: `${TIME_COL_WIDTH}px ${LINE_COL_WIDTH}px 1fr`,
                  alignItems: 'flex-start',
                }}
              >
                {/* Time column */}
                <Stack gap={0} align="flex-end" pr={10} pt={`${DOT_TOP - 8}px`}>
                  <Text
                    size="sm"
                    fw={isNow ? 700 : 400}
                    style={{
                      color: isNow
                        ? currentPalette.primary
                        : isCancelled || isDone
                          ? `${currentPalette.text}30`
                          : `${currentPalette.text}70`,
                      fontVariantNumeric: 'tabular-nums',
                      lineHeight: 1.2,
                    }}
                  >
                    {timeStr}
                  </Text>
                  {isNextUp && timeUntil && (
                    <Text
                      size="xs"
                      mt={2}
                      style={{ color: currentPalette.primary, fontWeight: 600, lineHeight: 1 }}
                    >
                      {timeUntil}
                    </Text>
                  )}
                </Stack>

                {/* Dot on the line */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    paddingTop: `${DOT_TOP}px`,
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  <div
                    style={{
                      width: isNow ? 12 : 7,
                      height: isNow ? 12 : 7,
                      borderRadius: '50%',
                      backgroundColor: isNow
                        ? currentPalette.primary
                        : isCancelled || isDone
                          ? `${currentPalette.text}20`
                          : `${currentPalette.primary}55`,
                      boxShadow: isNow
                        ? `0 0 0 4px ${currentPalette.primary}30, 0 0 12px ${currentPalette.primary}40`
                        : 'none',
                      flexShrink: 0,
                    }}
                  />
                </div>

                {/* Appointment card */}
                <div
                  style={{
                    marginLeft: 8,
                    borderRadius: 14,
                    padding: isNow ? '14px 16px' : '10px 14px',
                    backgroundColor: isNow
                      ? `${currentPalette.primary}14`
                      : isCancelled
                        ? `${currentPalette.text}04`
                        : isDone
                          ? `${currentPalette.text}05`
                          : `${currentPalette.text}08`,
                    border: isNow
                      ? `1px solid ${currentPalette.primary}35`
                      : `1px solid ${currentPalette.text}0E`,
                    borderLeft: isNow
                      ? `3px solid ${currentPalette.primary}`
                      : `1px solid ${currentPalette.text}0E`,
                    transition: 'background-color 0.2s',
                  }}
                >
                  <Group justify="space-between" align="flex-start" wrap="nowrap" gap={8}>
                    <Stack gap={4} style={{ minWidth: 0, flex: 1 }}>
                      {/* Patient name row */}
                      <Group gap={6} align="center" wrap="nowrap">
                        {isDone && (
                          <IconCheck
                            size={13}
                            strokeWidth={2.5}
                            style={{ color: `${currentPalette.text}35`, flexShrink: 0 }}
                          />
                        )}
                        <Text
                          size={isNow ? 'md' : 'sm'}
                          fw={isNow ? 700 : 600}
                          lineClamp={1}
                          style={{
                            color: isDone || isCancelled
                              ? `${currentPalette.text}40`
                              : currentPalette.text,
                            textDecoration: isDone || isCancelled ? 'line-through' : 'none',
                            textDecorationColor: `${currentPalette.text}40`,
                            lineHeight: 1.3,
                          }}
                        >
                          {patientName}
                        </Text>
                      </Group>

                      {/* Type + location row */}
                      <Group gap={6} wrap="nowrap" align="center">
                        <Text
                          size="xs"
                          lineClamp={1}
                          style={{
                            color: isDone || isCancelled
                              ? `${currentPalette.text}25`
                              : isNow
                                ? `${currentPalette.text}70`
                                : `${currentPalette.text}50`,
                            lineHeight: 1.3,
                            flexShrink: 1,
                            minWidth: 0,
                          }}
                        >
                          {typeLabel}
                        </Text>

                        {/* Online / in-person chip */}
                        {!isDone && !isCancelled && (isOnline || isInPerson) && (
                          <>
                            <Text size="xs" style={{ color: `${currentPalette.text}25`, flexShrink: 0 }}>
                              •
                            </Text>
                            <Group gap={3} wrap="nowrap" align="center" style={{ flexShrink: 0 }}>
                              {isOnline ? (
                                <IconVideo size={11} style={{ color: isNow ? currentPalette.primary : `${currentPalette.text}50` }} />
                              ) : (
                                <IconBuilding size={11} style={{ color: `${currentPalette.text}50` }} />
                              )}
                              <Text
                                size="xs"
                                style={{
                                  color: isNow && isOnline
                                    ? currentPalette.primary
                                    : `${currentPalette.text}50`,
                                  fontWeight: isOnline && isNow ? 600 : 400,
                                  lineHeight: 1.3,
                                }}
                              >
                                {isOnline
                                  ? t('dashboard.timeline.online')
                                  : t('dashboard.timeline.inPerson')}
                              </Text>
                            </Group>
                          </>
                        )}
                      </Group>

                      {/* End time for current appointment */}
                      {isNow && (
                        <Text
                          size="xs"
                          mt={2}
                          style={{ color: `${currentPalette.primary}80`, fontWeight: 500 }}
                        >
                          {t('dashboard.timeline.endsAt', { time: endTimeStr })}
                        </Text>
                      )}
                    </Stack>

                    {/* Right side */}
                    <Stack gap={4} align="flex-end" style={{ flexShrink: 0 }}>
                      {isNow && (
                        <Badge
                          size="sm"
                          radius="md"
                          style={{
                            backgroundColor: currentPalette.primary,
                            color: '#000',
                            fontWeight: 800,
                            fontSize: 11,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            paddingInline: 10,
                          }}
                        >
                          {t('dashboard.appointmentStatus.now')}
                        </Badge>
                      )}

                      {/* Dots menu for scheduled (not done/cancelled) */}
                      {isScheduled && (
                        <Menu
                          position="bottom-end"
                          withinPortal
                          styles={{
                            dropdown: {
                              backgroundColor: currentPalette.surface,
                              border: `1px solid ${currentPalette.text}18`,
                              borderRadius: 10,
                              padding: '4px',
                            },
                            item: {
                              borderRadius: 7,
                              fontSize: 13,
                              color: currentPalette.text,
                            },
                          }}
                        >
                          <Menu.Target>
                            <ActionIcon
                              size="sm"
                              variant="subtle"
                              style={{ color: `${currentPalette.text}45` }}
                              aria-label={t('common.actions')}
                            >
                              <IconDots size={15} />
                            </ActionIcon>
                          </Menu.Target>

                          <Menu.Dropdown>
                            {apt.patient?.id && (
                              <Menu.Item
                                leftSection={<IconUser size={14} />}
                                onClick={() => navigate(`/patients/${apt.patient!.id}`)}
                              >
                                {t('dashboard.timeline.menuViewPatient')}
                              </Menu.Item>
                            )}
                            <Menu.Item
                              leftSection={<IconCheck size={14} />}
                              onClick={() => handleMarkComplete(apt)}
                            >
                              {t('dashboard.timeline.menuMarkComplete')}
                            </Menu.Item>
                            <Menu.Item
                              leftSection={<IconCalendar size={14} />}
                              onClick={() => navigate('/calendar')}
                            >
                              {t('dashboard.timeline.menuOpenCalendar')}
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Item
                              leftSection={<IconX size={14} />}
                              color="red"
                              onClick={() => handleCancel(apt)}
                            >
                              {t('dashboard.timeline.menuCancel')}
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      )}
                    </Stack>
                  </Group>
                </div>
              </div>
            );
          })}
        </Stack>
      </div>
    </Stack>
  );
}
