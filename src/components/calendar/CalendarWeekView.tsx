import {
  Group,
  Stack,
  Text,
  Badge,
  Paper,
  ScrollArea,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
  IconUser,
  IconCheck,
} from '@tabler/icons-react';
import {
  format,
  startOfWeek,
  endOfWeek,
  isSameDay,
  isToday,
  eachDayOfInterval,
  getDay,
} from 'date-fns';
import { pl, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '../../stores/useSettingsStore';
import type { CalendarViewProps } from './types';

export function CalendarWeekView({
  date,
  appointments,
  onEditAppointment,
  onDateSelect,
  getStatusColor,
  currentPalette,
}: CalendarViewProps) {
  const { t, i18n } = useTranslation();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const dateLocale = i18n.language === 'pl' ? pl : enUS;
  const appointmentTypes = useSettingsStore(state => state.appointmentTypes);

  const weekStart = startOfWeek(date, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({
    start: weekStart,
    end: endOfWeek(date, { weekStartsOn: 1 }),
  });

  return (
    <ScrollArea scrollbarSize={4}>
      <Group gap='md' px='md' py='md' wrap='nowrap' align='stretch' style={{ minWidth: isMobile ? '800px' : 'auto', width: isMobile ? undefined : '100%' }}>
        {weekDays.map(day => {
          const dayAppointments = appointments
            .filter(apt => isSameDay(new Date(apt.date), day))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

          const isTodayDay = isToday(day);
          const isWeekend = getDay(day) === 0 || getDay(day) === 6;
          const sessCount = dayAppointments.filter(a => a.status === 'scheduled' || a.status === 'completed').length;
          const allCompleted = dayAppointments.length > 0 && dayAppointments.every(a => a.status === 'completed');

          return (
            <Paper
              key={day.toISOString()}
              p='md'
              style={{
                flex: '1 1 0',
                minWidth: isMobile ? '200px' : '140px',
                backgroundColor: isTodayDay ? `${currentPalette.primary}08` : currentPalette.surface,
                border: isTodayDay ? `1px solid ${currentPalette.primary}40` : `1px solid ${currentPalette.primary}15`,
                borderRadius: '16px',
                opacity: isWeekend ? 0.7 : 1,
                cursor: 'pointer',
                transition: 'all 200ms ease',
              }}
              onClick={() => onDateSelect(day)}
            >
              <Group justify='space-between' align='flex-start' mb='sm'>
                <Stack gap={2}>
                  <Text size='lg' fw={700} style={{ color: currentPalette.text, textTransform: 'capitalize' }}>
                    {format(day, 'EEEE', { locale: dateLocale })}
                  </Text>
                  <Text size='sm' style={{ color: `${currentPalette.text}70`, textTransform: 'capitalize' }}>
                    {format(day, 'd MMMM', { locale: dateLocale })}
                  </Text>
                </Stack>
                <Text
                  size='xs'
                  fw={600}
                  style={{
                    color: currentPalette.primary,
                    backgroundColor: `${currentPalette.primary}15`,
                    padding: '2px 8px',
                    borderRadius: '12px',
                  }}
                >
                  {sessCount} {t('calendar.weekView.sessions', { count: sessCount })}
                </Text>
              </Group>

              <Stack gap='xs'>
                {dayAppointments.length === 0 ? (
                  <Text size='sm' ta='center' py='lg' style={{ color: `${currentPalette.text}40` }}>
                    {t('calendar.noAppointments')}
                  </Text>
                ) : (
                  dayAppointments.map(appointment => {
                    const typeName = appointment.type
                      ? appointmentTypes.find(at => at.id === appointment.type)?.label
                      : '';

                    return (
                      <Paper
                        key={appointment.id}
                        p='xs'
                        style={{
                          backgroundColor: `${getStatusColor(appointment.status)}10`,
                          borderLeft: `3px solid ${getStatusColor(appointment.status)}`,
                          borderRadius: '8px',
                          cursor: 'pointer',
                          border: `1px solid ${getStatusColor(appointment.status)}20`,
                        }}
                        onClick={e => { e.stopPropagation(); onEditAppointment(appointment); }}
                      >
                        <Text size='sm' fw={600} truncate>
                          {typeName || t('appointmentForm.appointmentType')}
                        </Text>
                        <Group gap={4} mt={2}>
                          <Badge
                            size='xs'
                            variant='outline'
                            style={{ borderColor: currentPalette.primary, color: currentPalette.primary }}
                          >
                            {format(new Date(appointment.date), 'HH:mm')}
                          </Badge>
                        </Group>
                        <Text size='xs' mt={4} style={{ color: `${currentPalette.text}70` }}>
                          <IconUser size='0.7rem' style={{ verticalAlign: 'middle', marginRight: 4 }} />
                          {appointment.patient?.firstName} {appointment.patient?.lastName?.charAt(0)}.
                        </Text>
                      </Paper>
                    );
                  })
                )}
              </Stack>

              {allCompleted && (
                <Group gap={4} justify='center' mt='sm'>
                  <IconCheck size='0.8rem' style={{ color: currentPalette.primary }} />
                  <Text size='xs' style={{ color: `${currentPalette.text}60` }}>
                    {t('calendar.weekView.dayCompleted')}
                  </Text>
                </Group>
              )}
            </Paper>
          );
        })}
      </Group>
    </ScrollArea>
  );
}
