import {
  Button,
  Group,
  Stack,
  Text,
  Alert,
  Select,
  ActionIcon,
  SegmentedControl,
  Box,
  UnstyledButton,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import {
  IconPlus,
  IconChevronLeft,
  IconChevronRight,
  IconCalendarShare,
  IconMessageForward,
} from '@tabler/icons-react';
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addDays,
  addWeeks,
  addMonths,
  subDays,
  subWeeks,
  subMonths,
} from 'date-fns';
import { pl, enUS } from 'date-fns/locale';
import dayjs from 'dayjs';
import { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { AppointmentForm } from '../components/AppointmentForm';
import { BulkSMSReminders } from '../components/BulkSMSReminders';
import { CalendarDayView } from '../components/calendar/CalendarDayView';
import { CalendarMonthView } from '../components/calendar/CalendarMonthView';
import { CalendarWeekView } from '../components/calendar/CalendarWeekView';
import {
  FloatingActionButton,
  type FABAction,
} from '../components/FloatingActionButton';
import { BottomSheet } from '../components/ui/BottomSheet';
import { useTheme } from '../hooks/useTheme';
import { useAppointmentStore } from '../stores/useAppointmentStore';
import { usePatientStore } from '../stores/usePatientStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import { toDate } from '../utils/dates';
import type { CalendarView } from '../components/calendar/types';
import type { Appointment, AppointmentWithPatient } from '../types/Appointment';

function Calendar() {
  const { t, i18n } = useTranslation();
  const [opened, { open, close }] = useDisclosure(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [newAppointmentDate, setNewAppointmentDate] = useState<Date | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [view, setView] = useState<CalendarView>('day');
  const smsRef = useRef<HTMLDivElement>(null);

  const [rescheduleOpened, { open: openReschedule, close: closeReschedule }] = useDisclosure(false);
  const [appointmentToReschedule, setAppointmentToReschedule] = useState<AppointmentWithPatient | null>(null);
  const [newRescheduleDate, setNewRescheduleDate] = useState<Date | null>(null);

  const {
    fetchAppointments,
    deleteAppointment,
    getAppointmentsByDateRange,
    rescheduleAppointment,
    appointments,
    error,
  } = useAppointmentStore();

  const { fetchPatients } = usePatientStore();
  const { currentPalette, utilityColors, isDark } = useTheme();
  const { appointmentHours } = useSettingsStore();
  const dateLocale = i18n.language === 'pl' ? pl : enUS;

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
  }, [fetchAppointments, fetchPatients]);

  // --- Handlers ---

  const handleAddAppointment = (date?: Date) => {
    setEditingAppointment(null);
    if (date && appointmentHours.length > 0) {
      // Snap to closest predefined hour
      const clickedMinutes = date.getHours() * 60 + date.getMinutes();
      let closestTime = appointmentHours[0];
      let closestDiff = Infinity;
      for (const hour of appointmentHours) {
        const [h, m] = hour.split(':').map(Number);
        if (!isNaN(h) && !isNaN(m)) {
          const diff = Math.abs(h * 60 + m - clickedMinutes);
          if (diff < closestDiff) {
            closestDiff = diff;
            closestTime = hour;
          }
        }
      }
      const [snapH, snapM] = closestTime.split(':').map(Number);
      if (!isNaN(snapH) && !isNaN(snapM)) {
        const snapped = new Date(date);
        snapped.setHours(snapH, snapM, 0, 0);
        setNewAppointmentDate(snapped);
      } else {
        setNewAppointmentDate(date);
      }
    } else {
      setNewAppointmentDate(date || new Date());
    }
    open();
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    open();
  };

  const handleDeleteAppointment = async (id: number) => {
    if (window.confirm(t('calendar.confirmDelete'))) {
      await deleteAppointment(id);
    }
  };

  const handleFormSuccess = () => {
    close();
    setEditingAppointment(null);
    setNewAppointmentDate(null);
  };

  const handleRescheduleClick = (appointment: AppointmentWithPatient) => {
    setAppointmentToReschedule(appointment);
    setNewRescheduleDate(new Date(appointment.date));
    openReschedule();
  };

  const handleConfirmReschedule = async () => {
    if (appointmentToReschedule?.id && newRescheduleDate) {
      await rescheduleAppointment(appointmentToReschedule.id, newRescheduleDate);
      closeReschedule();
      setAppointmentToReschedule(null);
      setNewRescheduleDate(null);
    }
  };

  const handleRescheduleDateChange = (value: Date | string | null) => {
    if (!value || !newRescheduleDate) return;
    const dateValue = typeof value === 'string' ? new Date(value) : value;
    if (isNaN(dateValue.getTime())) return;
    const curr = dayjs(newRescheduleDate);
    setNewRescheduleDate(dayjs(dateValue).hour(curr.hour()).minute(curr.minute()).second(0).toDate());
  };

  const handleRescheduleTimeChange = (value: string) => {
    if (!newRescheduleDate) return;
    const [h, m] = value.split(':').map(Number);
    if (!isNaN(h) && !isNaN(m)) {
      setNewRescheduleDate(dayjs(newRescheduleDate).hour(h).minute(m).second(0).toDate());
    }
  };

  const handleJumpToAppointment = (appointmentId: number) => {
    const target = appointments.find(a => a.id === appointmentId);
    if (target) setSelectedDate(new Date(target.date));
  };

  const handlePrevious = () => {
    if (view === 'day') setSelectedDate(subDays(selectedDate, 1));
    else if (view === 'week') setSelectedDate(subWeeks(selectedDate, 1));
    else setSelectedDate(subMonths(selectedDate, 1));
  };

  const handleNext = () => {
    if (view === 'day') setSelectedDate(addDays(selectedDate, 1));
    else if (view === 'week') setSelectedDate(addWeeks(selectedDate, 1));
    else setSelectedDate(addMonths(selectedDate, 1));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setView('day');
  };

  // --- Data ---

  const currentPeriodAppointments = useMemo(() => {
    let startDate: Date;
    let endDate: Date;

    if (view === 'day') {
      startDate = startOfWeek(selectedDate, { weekStartsOn: 1 });
      endDate = endOfWeek(selectedDate, { weekStartsOn: 1 });
    } else if (view === 'week') {
      startDate = startOfWeek(selectedDate, { weekStartsOn: 1 });
      endDate = endOfWeek(selectedDate, { weekStartsOn: 1 });
    } else {
      startDate = startOfMonth(selectedDate);
      endDate = endOfMonth(selectedDate);
    }

    const result = getAppointmentsByDateRange(startDate, endDate);
    return statusFilter === 'all' ? result : result.filter(apt => apt.status === statusFilter);
  }, [selectedDate, view, getAppointmentsByDateRange, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return currentPalette.primary;
      case 'completed': return currentPalette.accent;
      case 'cancelled': return utilityColors.error;
      case 'no_show': return utilityColors.warning;
      default: return currentPalette.text;
    }
  };

  const getStatusLabel = (status: string) => {
    const key = `status.appointment.${status}`;
    return t(key, status);
  };

  const fabActions: FABAction[] = [
    {
      id: 'add-appointment',
      icon: <IconPlus size='1.2rem' />,
      label: t('calendar.addAppointment'),
      onClick: () => handleAddAppointment(),
    },
    {
      id: 'send-reminders',
      icon: <IconMessageForward size='1.2rem' />,
      label: t('bulkSMS.sendReminders'),
      onClick: () => smsRef.current?.click(),
    },
  ];

  // --- Shared view props ---

  const viewProps = {
    date: selectedDate,
    appointments: currentPeriodAppointments,
    onEditAppointment: handleEditAppointment,
    onDeleteAppointment: handleDeleteAppointment,
    onRescheduleAppointment: handleRescheduleClick,
    onJumpToAppointment: handleJumpToAppointment,
    onAddAppointment: handleAddAppointment,
    onDateSelect: setSelectedDate,
    getStatusColor,
    getStatusLabel,
    currentPalette,
    utilityColors,
    isDark,
  };

  return (
    <Stack gap={0}>
      {/* Header */}
      <Box px='md' pt='xs' pb={6} style={{ borderBottom: `1px solid ${currentPalette.primary}15` }}>
        <Group justify='space-between' mb={6}>
          <Group gap={4}>
            <ActionIcon variant='subtle' onClick={handlePrevious} size='sm' style={{ color: currentPalette.text }}>
              <IconChevronLeft size='1rem' />
            </ActionIcon>
            <UnstyledButton onClick={() => setSelectedDate(new Date())}>
              <Text size='sm' fw={700} style={{ textAlign: 'center', textTransform: 'capitalize' }}>
                {view === 'day'
                  ? format(selectedDate, 'd MMMM yyyy', { locale: dateLocale })
                  : view === 'week'
                    ? `${format(startOfWeek(selectedDate, { weekStartsOn: 1 }), 'd', { locale: dateLocale })} – ${format(endOfWeek(selectedDate, { weekStartsOn: 1 }), 'd MMMM yyyy', { locale: dateLocale })}`
                    : format(selectedDate, 'MMMM yyyy', { locale: dateLocale })}
              </Text>
            </UnstyledButton>
            <ActionIcon variant='subtle' onClick={handleNext} size='sm' style={{ color: currentPalette.text }}>
              <IconChevronRight size='1rem' />
            </ActionIcon>
          </Group>

          <Group gap='xs'>
            <Select
              placeholder={t('calendar.filters.all')}
              value={statusFilter}
              onChange={value => setStatusFilter(value || 'all')}
              data={[
                { value: 'all', label: t('calendar.filters.all') },
                { value: 'scheduled', label: t('calendar.filters.scheduled') },
                { value: 'completed', label: t('calendar.filters.completed') },
                { value: 'cancelled', label: t('calendar.filters.cancelled') },
                { value: 'no_show', label: t('calendar.filters.noShow') },
                { value: 'rescheduled', label: t('calendar.filters.rescheduled') },
              ]}
              size='xs'
              w={120}
            />
            <ActionIcon
              variant='filled'
              size='md'
              style={{ backgroundColor: currentPalette.primary, color: isDark ? currentPalette.background : currentPalette.surface }}
              onClick={() => handleAddAppointment()}
              visibleFrom='md'
            >
              <IconPlus size='1rem' />
            </ActionIcon>
          </Group>
        </Group>

        <SegmentedControl
          value={view}
          withItemsBorders={false}
          transitionDuration={300}
          onChange={value => setView(value as CalendarView)}
          data={[
            { label: t('calendar.views.day'), value: 'day' },
            { label: t('calendar.views.week'), value: 'week' },
            { label: t('calendar.views.month'), value: 'month' },
          ]}
          size='xs'
          fullWidth
        />
      </Box>

      {error && (
        <Alert color={utilityColors.error} title={t('common.error')} m='md'>
          {error}
        </Alert>
      )}

      {/* Views */}
      {view === 'day' && <CalendarDayView {...viewProps} />}
      {view === 'week' && (
        <CalendarWeekView
          {...viewProps}
          onDateSelect={d => { setSelectedDate(d); setView('day'); }}
        />
      )}
      {view === 'month' && (
        <CalendarMonthView
          {...viewProps}
          onDateClick={handleDateClick}
          selectedDate={selectedDate}
          allAppointments={appointments}
        />
      )}

      {/* Add/Edit bottom sheet */}
      <BottomSheet
        opened={opened}
        onClose={close}
        title={editingAppointment ? t('calendar.editAppointment') : t('calendar.addAppointment')}
      >
        <AppointmentForm
          appointment={editingAppointment}
          initialDate={newAppointmentDate}
          onSuccess={handleFormSuccess}
          onCancel={close}
        />
      </BottomSheet>

      {/* Reschedule bottom sheet */}
      <BottomSheet opened={rescheduleOpened} onClose={closeReschedule} title={t('calendar.reschedule.title')}>
        <Stack p='md'>
          <Text size='sm'>
            {t('calendar.reschedule.selectNewDate')}{' '}
            <Text span fw={600}>
              {appointmentToReschedule?.patient?.firstName} {appointmentToReschedule?.patient?.lastName}
            </Text>
          </Text>
          <Group grow>
            <DatePickerInput
              label={t('appointmentForm.date')}
              placeholder={t('appointmentForm.datePlaceholder')}
              required
              value={toDate(newRescheduleDate || undefined)}
              onChange={handleRescheduleDateChange}
            />
            <Select
              label={t('appointmentForm.time')}
              placeholder={t('appointmentForm.timePlaceholder')}
              required
              data={appointmentHours}
              value={dayjs(newRescheduleDate).format('HH:mm')}
              onChange={value => value && handleRescheduleTimeChange(value)}
            />
          </Group>
          <Group justify='flex-end' mt='md'>
            <Button variant='subtle' onClick={closeReschedule}>{t('common.cancel')}</Button>
            <Button
              onClick={handleConfirmReschedule}
              disabled={!newRescheduleDate}
              leftSection={<IconCalendarShare size='1rem' />}
            >
              {t('calendar.reschedule.confirmReschedule')}
            </Button>
          </Group>
        </Stack>
      </BottomSheet>

      {/* Hidden SMS trigger for FAB */}
      <div style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
        <BulkSMSReminders variant='custom' size='sm' onRemindersSent={() => fetchAppointments()}>
          <span ref={smsRef} />
        </BulkSMSReminders>
      </div>

      <FloatingActionButton actions={fabActions} />
    </Stack>
  );
}

export default Calendar;
