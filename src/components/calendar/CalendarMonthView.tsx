import {
  Group,
  Stack,
  Text,
  Badge,
  ActionIcon,
  Box,
  Paper,
  UnstyledButton,
} from '@mantine/core';
import {
  IconArrowRight,
  IconUser,
} from '@tabler/icons-react';
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isSameDay,
  isSameMonth,
  isToday,
  eachDayOfInterval,
} from 'date-fns';
import { pl, enUS } from 'date-fns/locale';
import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '../../stores/useSettingsStore';
import type { CalendarViewProps } from './types';
import type { AppointmentWithPatient } from '../../types/Appointment';

interface CalendarMonthViewProps extends CalendarViewProps {
  onDateClick: (date: Date) => void;
  selectedDate: Date;
  allAppointments: AppointmentWithPatient[];
}

export function CalendarMonthView({
  date,
  onEditAppointment,
  onAddAppointment,
  onDateClick,
  selectedDate,
  allAppointments,
  getStatusColor,
  currentPalette,
}: CalendarMonthViewProps) {
  const { t, i18n } = useTranslation();
  const dateLocale = i18n.language === 'pl' ? pl : enUS;
  const appointmentTypes = useSettingsStore(state => state.appointmentTypes);

  const [panelDate, setPanelDate] = useState<Date>(selectedDate);

  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const mondayFirstHeaders = [
    t('weekdays.shortMonday'),
    t('weekdays.shortTuesday'),
    t('weekdays.shortWednesday'),
    t('weekdays.shortThursday'),
    t('weekdays.shortFriday'),
    t('weekdays.shortSaturday'),
    t('weekdays.shortSunday'),
  ];

  // Filter appointments for the visible month range
  const calendarStartTime = calendarStart.getTime();
  const calendarEndTime = calendarEnd.getTime();
  const monthAppointments = useMemo(
    () => allAppointments.filter(apt => {
      const t = new Date(apt.date).getTime();
      return t >= calendarStartTime && t <= calendarEndTime;
    }),
    [allAppointments, calendarStartTime, calendarEndTime]
  );

  const panelAppointments = useMemo(
    () => monthAppointments
      .filter(apt => isSameDay(new Date(apt.date), panelDate))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [monthAppointments, panelDate]
  );

  return (
    <Stack gap={0}>
      {/* Calendar grid */}
      <Box px='md' py='sm'>
        <Box style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '8px' }}>
          {mondayFirstHeaders.map(day => (
            <Text key={day} size='xs' fw={600} ta='center' style={{ color: `${currentPalette.text}60`, textTransform: 'uppercase' }} py={4}>
              {day}
            </Text>
          ))}
        </Box>

        <Box style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
          {calendarDays.map(day => {
            const dayAppointments = monthAppointments.filter(apt => isSameDay(new Date(apt.date), day));
            const isCurrentMonth = isSameMonth(day, date);
            const isTodayDay = isToday(day);
            const isSelected = isSameDay(day, panelDate);

            return (
              <UnstyledButton
                key={day.toISOString()}
                onClick={() => setPanelDate(day)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px 4px',
                  borderRadius: '8px',
                  minHeight: '44px',
                  backgroundColor: isSelected ? `${currentPalette.primary}20` : 'transparent',
                  border: isSelected ? `1px solid ${currentPalette.primary}` : '1px solid transparent',
                  opacity: isCurrentMonth ? 1 : 0.35,
                  transition: 'all 150ms ease',
                }}
              >
                <Text
                  size='sm'
                  fw={isTodayDay ? 800 : isSelected ? 600 : 400}
                  style={{ color: isTodayDay || isSelected ? currentPalette.primary : currentPalette.text }}
                >
                  {format(day, 'd')}
                </Text>
                {dayAppointments.length > 0 && (
                  <Group gap={2} mt={2} justify='center'>
                    {dayAppointments.length <= 3 ? (
                      dayAppointments.map((apt, idx) => (
                        <Box key={idx} style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: getStatusColor(apt.status) }} />
                      ))
                    ) : (
                      <>
                        <Box style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: currentPalette.primary }} />
                        <Text size='8px' style={{ color: `${currentPalette.text}60` }}>+{dayAppointments.length - 1}</Text>
                      </>
                    )}
                  </Group>
                )}
              </UnstyledButton>
            );
          })}
        </Box>
      </Box>

      {/* Selected day panel */}
      <Box px='md' py='md' style={{ borderTop: `1px solid ${currentPalette.primary}15` }}>
        <Group justify='space-between' mb='sm'>
          <Stack gap={2}>
            <Text size='lg' fw={700} style={{ textTransform: 'capitalize' }}>
              {format(panelDate, 'd MMMM yyyy', { locale: dateLocale })}
            </Text>
            <Text size='sm' style={{ color: `${currentPalette.text}60` }}>
              {panelAppointments.length} {t('calendar.monthView.appointments', { count: panelAppointments.length })}
            </Text>
          </Stack>
          <ActionIcon variant='subtle' size='sm' onClick={() => onDateClick(panelDate)} style={{ color: currentPalette.primary }}>
            <IconArrowRight size='1rem' />
          </ActionIcon>
        </Group>

        {panelAppointments.length === 0 ? (
          <Paper
            p='lg'
            style={{
              backgroundColor: `${currentPalette.primary}08`,
              border: `1px dashed ${currentPalette.primary}30`,
              borderRadius: '12px',
              textAlign: 'center',
            }}
          >
            <Text size='sm' style={{ color: `${currentPalette.text}50` }}>
              {t('calendar.noAppointmentsForDay')}
            </Text>
            <UnstyledButton
              onClick={() => onAddAppointment(panelDate)}
              style={{ color: currentPalette.primary, fontWeight: 600, fontSize: '0.875rem', marginTop: '8px' }}
            >
              + {t('calendar.addAppointment')}
            </UnstyledButton>
          </Paper>
        ) : (
          <Stack gap='sm'>
            {panelAppointments.map(appointment => {
              const isRescheduled = appointment.status === 'rescheduled';
              const isCancelled = appointment.status === 'cancelled';
              const typeName = appointment.type
                ? appointmentTypes.find(at => at.id === appointment.type)?.label
                : '';

              return (
                <Paper
                  key={appointment.id}
                  p='sm'
                  style={{
                    borderLeft: `3px solid ${getStatusColor(appointment.status)}`,
                    backgroundColor: currentPalette.surface,
                    border: `1px solid ${currentPalette.primary}15`,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    opacity: isRescheduled || isCancelled ? 0.6 : 1,
                    transition: 'all 200ms ease',
                  }}
                  onClick={() => onEditAppointment(appointment)}
                >
                  <Group justify='space-between' align='flex-start'>
                    <Group gap='sm' align='flex-start'>
                      <Box
                        style={{
                          width: 36, height: 36, borderRadius: '50%',
                          backgroundColor: `${getStatusColor(appointment.status)}20`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}
                      >
                        <IconUser size='1rem' style={{ color: getStatusColor(appointment.status) }} />
                      </Box>
                      <Stack gap={2}>
                        <Text size='sm' fw={600}>
                          {appointment.patient?.firstName} {appointment.patient?.lastName}
                        </Text>
                        <Text size='xs' style={{ color: `${currentPalette.text}60` }}>
                          {typeName || t('appointmentForm.appointmentType')}
                        </Text>
                      </Stack>
                    </Group>

                    <Stack gap={4} align='flex-end'>
                      <Badge
                        size='sm'
                        variant='outline'
                        style={{ borderColor: getStatusColor(appointment.status), color: getStatusColor(appointment.status) }}
                      >
                        {format(new Date(appointment.date), 'HH:mm')}
                      </Badge>
                      <UnstyledButton
                        onClick={e => { e.stopPropagation(); onEditAppointment(appointment); }}
                        style={{ color: `${currentPalette.text}50`, fontSize: '0.75rem' }}
                      >
                        {t('calendar.monthView.details')}
                      </UnstyledButton>
                    </Stack>
                  </Group>
                </Paper>
              );
            })}
          </Stack>
        )}
      </Box>
    </Stack>
  );
}
