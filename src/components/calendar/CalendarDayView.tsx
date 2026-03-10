import {
  Group,
  Stack,
  Text,
  Box,
  ScrollArea,
  UnstyledButton,
} from '@mantine/core';
import {
  format,
  startOfWeek,
  endOfWeek,
  isSameDay,
  isToday,
  eachDayOfInterval,
} from 'date-fns';
import { pl, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { AppointmentCard } from './AppointmentCard';
import type { CalendarViewProps } from './types';

const TIME_SLOTS = Array.from({ length: 15 }, (_, i) => 7 + i); // 7:00 - 21:00

export function CalendarDayView({
  date,
  appointments,
  onEditAppointment,
  onDeleteAppointment,
  onRescheduleAppointment,
  onJumpToAppointment,
  onAddAppointment,
  onDateSelect,
  getStatusColor,
  getStatusLabel,
  currentPalette,
  utilityColors,
  isDark,
}: CalendarViewProps) {
  const { i18n } = useTranslation();
  const appointmentTypes = useSettingsStore(state => state.appointmentTypes);
  const dateLocale = i18n.language === 'pl' ? pl : enUS;

  const weekStart = startOfWeek(date, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({
    start: weekStart,
    end: endOfWeek(date, { weekStartsOn: 1 }),
  });

  const dayAppointments = appointments
    .filter(apt => isSameDay(new Date(apt.date), date))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <Stack gap={0}>
      {/* Horizontal day strip */}
      <ScrollArea scrollbarSize={0}>
        <Group
          gap={6}
          px='md'
          py='sm'
          wrap='nowrap'
          style={{ borderBottom: `1px solid ${currentPalette.primary}15` }}
        >
          {weekDays.map(day => {
            const isSelected = isSameDay(day, date);
            const isTodayDay = isToday(day);
            const hasAppointments = appointments.some(apt => isSameDay(new Date(apt.date), day));

            return (
              <UnstyledButton
                key={day.toISOString()}
                onClick={() => onDateSelect(day)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '8px 12px',
                  borderRadius: '12px',
                  minWidth: '48px',
                  backgroundColor: isSelected ? currentPalette.primary : 'transparent',
                  border: isTodayDay && !isSelected
                    ? `1px solid ${currentPalette.primary}60`
                    : '1px solid transparent',
                  transition: 'all 200ms ease',
                }}
              >
                <Text
                  size='xs'
                  fw={500}
                  style={{
                    color: isSelected
                      ? (isDark ? currentPalette.background : currentPalette.surface)
                      : `${currentPalette.text}80`,
                    textTransform: 'capitalize',
                  }}
                >
                  {format(day, 'EEE', { locale: dateLocale })}
                </Text>
                <Text
                  size='lg'
                  fw={700}
                  style={{
                    color: isSelected
                      ? (isDark ? currentPalette.background : currentPalette.surface)
                      : currentPalette.text,
                  }}
                >
                  {format(day, 'd')}
                </Text>
                {hasAppointments && !isSelected && (
                  <Box
                    style={{
                      width: 4, height: 4, borderRadius: '50%',
                      backgroundColor: currentPalette.primary, marginTop: 2,
                    }}
                  />
                )}
              </UnstyledButton>
            );
          })}
        </Group>
      </ScrollArea>

      {/* Timeline */}
      <ScrollArea h='calc(100vh - 280px)' px='md' py='sm'>
        <Box>
          {TIME_SLOTS.map(hour => {
            const hourAppointments = dayAppointments.filter(
              apt => new Date(apt.date).getHours() === hour
            );

            return (
              <Box key={hour} style={{ display: 'flex', gap: '16px', minHeight: hourAppointments.length > 0 ? 'auto' : '48px' }}>
                <Text
                  size='xs'
                  fw={500}
                  style={{ color: `${currentPalette.text}60`, width: '52px', flexShrink: 0, paddingTop: '4px', textAlign: 'right' }}
                >
                  {`${hour.toString().padStart(2, '0')}:00`}
                </Text>

                <Box style={{ flex: 1, paddingLeft: '16px', position: 'relative' }}>
                  <Box style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '1px', backgroundColor: `${currentPalette.primary}20` }} />

                  {hourAppointments.length > 0 && (
                    <Box style={{ position: 'absolute', left: '-4px', top: '8px', width: '9px', height: '9px', borderRadius: '50%', backgroundColor: currentPalette.primary, border: `2px solid ${currentPalette.background}` }} />
                  )}

                  {hourAppointments.length > 0 ? (
                    <Stack gap='xs' pb='md'>
                      {hourAppointments.map(appointment => (
                        <AppointmentCard
                          key={appointment.id}
                          appointment={appointment}
                          onEdit={onEditAppointment}
                          onDelete={onDeleteAppointment}
                          onReschedule={onRescheduleAppointment}
                          onJumpTo={onJumpToAppointment}
                          getStatusColor={getStatusColor}
                          getStatusLabel={getStatusLabel}
                          currentPalette={currentPalette}
                          utilityColors={utilityColors}
                          isDark={isDark}
                          appointmentTypes={appointmentTypes}
                        />
                      ))}
                    </Stack>
                  ) : (
                    <Box
                      style={{ borderBottom: `1px dashed ${currentPalette.primary}10`, height: '48px', cursor: 'pointer' }}
                      onClick={() => {
                        const d = new Date(date);
                        d.setHours(hour, 0, 0, 0);
                        onAddAppointment(d);
                      }}
                    />
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      </ScrollArea>
    </Stack>
  );
}
