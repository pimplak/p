import {
  Title,
  Button,
  Group,
  Card,
  Stack,
  Text,
  Badge,
  Alert,
  Select,
  ActionIcon,
  Table,
  SegmentedControl,
  Box,
  Paper,
  Divider,
  ScrollArea,
  Tooltip,
} from '@mantine/core';
import { DateInput, DatePickerInput } from '@mantine/dates';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import {
  IconPlus,
  IconCalendarEvent,
  IconEdit,
  IconTrash,
  IconChevronLeft,
  IconChevronRight,
  IconEye,
  IconEyeOff,
  IconCalendarShare,
  IconArrowRight,
  IconArrowLeft,
} from '@tabler/icons-react';
import {
  format,
  startOfDay,
  endOfDay,
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
  isSameDay,
  isSameMonth,
  isToday,
  eachDayOfInterval,
} from 'date-fns';
import { pl } from 'date-fns/locale';
import dayjs from 'dayjs';
import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AppointmentForm } from '../components/AppointmentForm';
import { BulkSMSReminders } from '../components/BulkSMSReminders';
import {
  FloatingActionButton,
  type FABAction,
} from '../components/FloatingActionButton';
import { SMSReminderButton } from '../components/SMSReminderButton';
import { BottomSheet } from '../components/ui/BottomSheet';
import { ExpandableAppointmentRow } from '../components/ui/ExpandableAppointmentRow';
import { useTheme } from '../hooks/useTheme';
import { useAppointmentStore } from '../stores/useAppointmentStore';
import { usePatientStore } from '../stores/usePatientStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import { toDate } from '../utils/dates';
import type { Appointment, AppointmentWithPatient } from '../types/Appointment';
import type { ColorPalette } from '../types/theme';

type CalendarView = 'day' | 'week' | 'month';

function Calendar() {
  const { t } = useTranslation();
  const [opened, { open, close }] = useDisclosure(false);
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [newAppointmentDate, setNewAppointmentDate] = useState<Date | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [view, setView] = useState<CalendarView>('day');
  const [hideWeekends, setHideWeekends] = useState(false);

  // Reschedule state
  const [rescheduleOpened, { open: openReschedule, close: closeReschedule }] =
    useDisclosure(false);
  const [appointmentToReschedule, setAppointmentToReschedule] =
    useState<AppointmentWithPatient | null>(null);
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
  const { currentPalette, utilityColors } = useTheme();
  const { appointmentHours } = useSettingsStore();

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
  }, [fetchAppointments, fetchPatients]);

  const handleAddAppointment = (date?: Date) => {
    setEditingAppointment(null);
    if (date) {
      // Ustaw datę dla nowej wizyty
      setNewAppointmentDate(date);
    } else {
      // Jeśli nie przekazano daty, użyj aktualnej
      setNewAppointmentDate(new Date());
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
      await rescheduleAppointment(
        appointmentToReschedule.id,
        newRescheduleDate
      );
      closeReschedule();
      setAppointmentToReschedule(null);
      setNewRescheduleDate(null);
    }
  };

  const handleRescheduleDateChange = (value: Date | string | null) => {
    if (!value || !newRescheduleDate) return;
    const dateValue = typeof value === 'string' ? new Date(value) : value;
    if (isNaN(dateValue.getTime())) return;

    const currentFullDate = dayjs(newRescheduleDate);
    const newDate = dayjs(dateValue)
      .hour(currentFullDate.hour())
      .minute(currentFullDate.minute())
      .second(0)
      .toDate();
    setNewRescheduleDate(newDate);
  };

  const handleRescheduleTimeChange = (value: string) => {
    if (!newRescheduleDate) return;
    const [hoursStr, minutesStr] = value.split(':');
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    if (!isNaN(hours) && !isNaN(minutes)) {
      const newDate = dayjs(newRescheduleDate)
        .hour(hours)
        .minute(minutes)
        .second(0)
        .toDate();
      setNewRescheduleDate(newDate);
    }
  };

  const handleJumpToAppointment = (appointmentId: number) => {
    const target = appointments.find(a => a.id === appointmentId);
    if (target) {
      setSelectedDate(new Date(target.date));
      if (view === 'month' && !isSameMonth(new Date(target.date), selectedDate)) {
        // Month view handles itself via selectedDate
      }
    }
  };

  // Navigation handlers
  const handlePrevious = () => {
    if (view === 'day') {
      setSelectedDate(subDays(selectedDate, 1));
    } else if (view === 'week') {
      setSelectedDate(subWeeks(selectedDate, 1));
    } else if (view === 'month') {
      setSelectedDate(subMonths(selectedDate, 1));
    }
  };

  const handleNext = () => {
    if (view === 'day') {
      setSelectedDate(addDays(selectedDate, 1));
    } else if (view === 'week') {
      setSelectedDate(addWeeks(selectedDate, 1));
    } else if (view === 'month') {
      setSelectedDate(addMonths(selectedDate, 1));
    }
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  const toggleHideWeekends = () => {
    setHideWeekends(!hideWeekends);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setView('day');
  };

  // Get appointments for current view
  const currentPeriodAppointments = useMemo(() => {
    let startDate: Date;
    let endDate: Date;

    if (view === 'day') {
      startDate = startOfDay(selectedDate);
      endDate = endOfDay(selectedDate);
    } else if (view === 'week') {
      startDate = startOfWeek(selectedDate, { weekStartsOn: 1 });
      endDate = endOfWeek(selectedDate, { weekStartsOn: 1 });
    } else {
      startDate = startOfMonth(selectedDate);
      endDate = endOfMonth(selectedDate);
    }

    const appointments = getAppointmentsByDateRange(startDate, endDate);
    return statusFilter === 'all'
      ? appointments
      : appointments.filter(apt => apt.status === statusFilter);
  }, [selectedDate, view, getAppointmentsByDateRange, statusFilter]);

  // Get current period title
  const getCurrentPeriodTitle = () => {
    if (view === 'day') {
      return format(selectedDate, 'dd MMMM yyyy', { locale: pl });
    } else if (view === 'week') {
      const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
      return `${format(weekStart, 'dd MMM', { locale: pl })} - ${format(weekEnd, 'dd MMM yyyy', { locale: pl })}`;
    } else {
      return format(selectedDate, 'MMMM yyyy', { locale: pl });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return currentPalette.primary;
      case 'completed':
        return currentPalette.accent;
      case 'cancelled':
        return utilityColors.error;
      case 'no_show':
        return utilityColors.warning;
      case 'rescheduled':
        return currentPalette.text;
      default:
        return currentPalette.text;
    }
  };

  const getStatusBackgroundColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return `${currentPalette.primary}33`;
      case 'completed':
        return `${currentPalette.accent}33`;
      case 'cancelled':
        return `${utilityColors.error}33`;
      case 'no_show':
        return `${utilityColors.warning}33`;
      case 'rescheduled':
        return `${currentPalette.text}1A`;
      default:
        return `${currentPalette.text}26`;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'scheduled':
        return t('status.appointment.scheduled');
      case 'completed':
        return t('status.appointment.completed');
      case 'cancelled':
        return t('status.appointment.cancelled');
      case 'no_show':
        return t('status.appointment.no_show');
      case 'rescheduled':
        return t('status.appointment.rescheduled');
      default:
        return status;
    }
  };

  // FAB Actions dla mobile
  const fabActions: FABAction[] = [
    {
      id: 'add-appointment',
      icon: <IconPlus size='1.2rem' />,
      label: t('calendar.addAppointment'),
      onClick: () => handleAddAppointment(),
    },
  ];

  return (
    <Stack>
      {/* Header */}
      <Group justify='space-between'>
        <Title order={1}>{t('calendar.title')}</Title>
        <Group gap='sm'>
          <BulkSMSReminders
            size='sm'
            onRemindersSent={() => {
              // Refresh appointments after sending reminders
              fetchAppointments();
            }}
          />
          <Button
            leftSection={<IconPlus size='1rem' />}
            onClick={() => handleAddAppointment()}
            visibleFrom='md'
          >
            {t('calendar.addAppointment')}
          </Button>
        </Group>
      </Group>

      {error && (
        <Alert color={utilityColors.error} title={t('common.error')}>
          {error}
        </Alert>
      )}

      {/* Calendar Controls */}
      <Card>
        <Group justify='space-between' mb='md'>
          {/* View Selector */}
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
          />

          {/* Navigation */}
          <Group>
            <ActionIcon variant='light' onClick={handlePrevious} size='lg'>
              <IconChevronLeft size='1.2rem' />
            </ActionIcon>

            <Button variant='light' onClick={handleToday} size='sm'>
              {t('calendar.today')}
            </Button>

            <ActionIcon variant='light' onClick={handleNext} size='lg'>
              <IconChevronRight size='1.2rem' />
            </ActionIcon>
          </Group>
        </Group>

        {/* Period Title */}
        <Group justify='space-between' mb='md' wrap='wrap'>
          <Text size='xl' fw={600}>
            {getCurrentPeriodTitle()}
          </Text>

          <Group gap='sm' wrap='wrap'>
            <DateInput
              placeholder={t('calendar.jumpToDate')}
              value={selectedDate}
              onChange={value => {
                if (value) {
                  const date =
                    typeof value === 'string' ? new Date(value) : value;
                  setSelectedDate(date);
                }
              }}
              size='sm'
              w={{ base: 150, sm: 180 }}
            />
            <Select
              placeholder={t('status.appointment.scheduled')}
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
              size='sm'
              w={{ base: 120, sm: 140 }}
            />

            {/* Calendar View Options */}
            {view === 'week' && (
              <ActionIcon
                variant={hideWeekends ? 'filled' : 'light'}
                color={currentPalette.primary}
                size='sm'
                onClick={toggleHideWeekends}
                title={hideWeekends ? t('calendar.showWeekends') : t('calendar.hideWeekends')}
              >
                {hideWeekends ? (
                  <IconEyeOff size='1rem' />
                ) : (
                  <IconEye size='1rem' />
                )}
              </ActionIcon>
            )}
          </Group>
        </Group>

        <Divider mb='md' />

        {/* Calendar View */}
        {view === 'day' && (
          <DayView
            date={selectedDate}
            appointments={currentPeriodAppointments}
            onEditAppointment={handleEditAppointment}
            onDeleteAppointment={handleDeleteAppointment}
            onRescheduleAppointment={handleRescheduleClick}
            onJumpToAppointment={handleJumpToAppointment}
            onAddAppointment={handleAddAppointment}
            getStatusColor={getStatusColor}
            getStatusBackgroundColor={getStatusBackgroundColor}
            getStatusLabel={getStatusLabel}
            currentPalette={currentPalette}
            utilityColors={utilityColors}
          />
        )}

        {view === 'week' && (
          <WeekView
            date={selectedDate}
            appointments={currentPeriodAppointments}
            onEditAppointment={handleEditAppointment}
            onDeleteAppointment={handleDeleteAppointment}
            onRescheduleAppointment={handleRescheduleClick}
            onJumpToAppointment={handleJumpToAppointment}
            onAddAppointment={handleAddAppointment}
            getStatusColor={getStatusColor}
            getStatusBackgroundColor={getStatusBackgroundColor}
            getStatusLabel={getStatusLabel}
            hideWeekends={hideWeekends}
            currentPalette={currentPalette}
          />
        )}

        {view === 'month' && (
          <MonthView
            date={selectedDate}
            appointments={currentPeriodAppointments}
            onEditAppointment={handleEditAppointment}
            onDeleteAppointment={handleDeleteAppointment}
            onRescheduleAppointment={handleRescheduleClick}
            onJumpToAppointment={handleJumpToAppointment}
            onAddAppointment={handleAddAppointment}
            onDateClick={handleDateClick}
            getStatusColor={getStatusColor}
            getStatusBackgroundColor={getStatusBackgroundColor}
            getStatusLabel={getStatusLabel}
            currentPalette={currentPalette}
          />
        )}
      </Card>

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

      <BottomSheet
        opened={rescheduleOpened}
        onClose={closeReschedule}
        title={t('calendar.reschedule.title')}
      >
        <Stack p='md'>
          <Text size='sm'>
            {t('calendar.reschedule.selectNewDate')}{' '}
            <Text span fw={600}>
              {appointmentToReschedule?.patient?.firstName}{' '}
              {appointmentToReschedule?.patient?.lastName}
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
            <Button variant='subtle' onClick={closeReschedule}>
              {t('common.cancel')}
            </Button>
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

      {/* Floating Action Button for mobile */}
      <FloatingActionButton actions={fabActions} />
    </Stack>
  );
}

// Day View Component
interface CalendarViewProps {
  date: Date;
  appointments: AppointmentWithPatient[];
  onEditAppointment: (appointment: AppointmentWithPatient) => void;
  onDeleteAppointment: (id: number) => void;
  onRescheduleAppointment: (appointment: AppointmentWithPatient) => void;
  onJumpToAppointment: (id: number) => void;
  onAddAppointment: (date?: Date) => void;
  getStatusColor: (status: string) => string;
  getStatusBackgroundColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
  hideWeekends?: boolean;
  currentPalette: ColorPalette;
  utilityColors?: {
    error: string;
    success: string;
    warning: string;
  };
}

function DayView({
  date,
  appointments,
  onEditAppointment,
  onDeleteAppointment,
  onRescheduleAppointment,
  onJumpToAppointment,
  onAddAppointment,
  getStatusColor,
  getStatusLabel,
  utilityColors,
  currentPalette,
}: CalendarViewProps) {
  const { t } = useTranslation();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const appointmentTypes = useSettingsStore(state => state.appointmentTypes);

  const dayAppointments = appointments.filter(apt =>
    isSameDay(new Date(apt.date), date)
  );

  if (dayAppointments.length === 0) {
    return (
      <Alert icon={<IconCalendarEvent size='1rem' />} title={t('calendar.noAppointments')}>
        {t('calendar.noAppointmentsForDay')}
        <Button
          variant='light'
          size='sm'
          mt='sm'
          onClick={() => onAddAppointment(date)}
        >
          {t('calendar.addAppointment')}
        </Button>
      </Alert>
    );
  }

  const sortedAppointments = dayAppointments.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Mobile view with expandable cards
  if (isMobile) {
    return (
      <Stack gap='sm'>
        {sortedAppointments.map(appointment => (
          <ExpandableAppointmentRow
            key={appointment.id}
            appointment={appointment}
            onEditAppointment={onEditAppointment}
            onDeleteAppointment={onDeleteAppointment}
            onRescheduleAppointment={onRescheduleAppointment}
            onJumpToAppointment={onJumpToAppointment}
            getStatusColor={getStatusColor}
            getStatusLabel={getStatusLabel}
            utilityColors={utilityColors}
          />
        ))}
      </Stack>
    );
  }

  // Desktop view with table
  return (
    <Table.ScrollContainer minWidth={800}>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>{t('calendar.table.time')}</Table.Th>
            <Table.Th>{t('calendar.table.patient')}</Table.Th>
            <Table.Th>{t('calendar.table.type')}</Table.Th>
            <Table.Th>{t('calendar.table.duration')}</Table.Th>
            <Table.Th>{t('calendar.table.price')}</Table.Th>
            <Table.Th>{t('calendar.table.payment')}</Table.Th>
            <Table.Th>{t('calendar.table.status')}</Table.Th>
            <Table.Th>{t('calendar.table.actions')}</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {sortedAppointments.map(appointment => {
            const isRescheduled = appointment.status === 'rescheduled';
            const isCancelled = appointment.status === 'cancelled';
            return (
              <Table.Tr
                key={appointment.id}
                style={{ opacity: isRescheduled || isCancelled ? 0.6 : 1 }}
              >
                <Table.Td>
                  <Text fw={500}>
                    {format(new Date(appointment.date), 'HH:mm')}
                  </Text>
                  {isCancelled && appointment.cancelledAt && (
                    <Text size='xs' c='dimmed'>
                      {t('calendar.cancellation.cancelledOn')} {format(new Date(appointment.cancelledAt), 'dd.MM')}
                    </Text>
                  )}
                </Table.Td>
                <Table.Td>
                  <div>
                    <Text fw={500}>
                      {appointment.patient?.firstName}{' '}
                      {appointment.patient?.lastName}
                    </Text>
                    {appointment.patient?.phone && (
                      <Text size='sm' c='dimmed'>
                        {appointment.patient.phone}
                      </Text>
                    )}
                  </div>
                </Table.Td>
                <Table.Td>
                  <Text size='sm'>
                    {(appointment.type &&
                      appointmentTypes.find(t => t.id === appointment.type)
                        ?.label) ||
                      t('appointmentForm.appointmentType')}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text size='sm'>{appointment.duration} min</Text>
                </Table.Td>
                <Table.Td>
                  <Text size='sm' fw={500}>
                    {appointment.price ? `${appointment.price} zł` : '-'}
                  </Text>
                  {isCancelled && (
                    <Text size='xs' c={appointment.requiresPayment ? 'orange' : 'dimmed'}>
                      {t('calendar.cancellation.requiresPayment')} {appointment.requiresPayment ? t('common.yes') : t('common.no')}
                    </Text>
                  )}
                </Table.Td>
                <Table.Td>
                  {appointment.paymentInfo?.isPaid ? (
                    <Badge color={utilityColors?.success || 'green'} size='sm'>
                      {t('status.payment.paid')}
                    </Badge>
                  ) : (
                    <Badge color={utilityColors?.error || 'red'} size='sm'>
                      {t('status.payment.unpaid')}
                    </Badge>
                  )}
                </Table.Td>
                <Table.Td>
                  <Stack gap={4}>
                    <Badge color={getStatusColor(appointment.status)}>
                      {getStatusLabel(appointment.status)}
                    </Badge>
                    {isCancelled && appointment.cancellationReason && (
                       <Tooltip label={appointment.cancellationReason}>
                         <Text size='xs' truncate maw={100} c='dimmed' style={{ cursor: 'help' }}>
                           {appointment.cancellationReason}
                         </Text>
                       </Tooltip>
                    )}
                    {appointment.rescheduledToId && (
                      <Button
                        variant='subtle'
                        size='compact-xs'
                        leftSection={<IconArrowRight size='0.8rem' />}
                        onClick={() =>
                          onJumpToAppointment(appointment.rescheduledToId!)
                        }
                      >
                        {t('calendar.reschedule.toNew')}
                      </Button>
                    )}
                    {appointment.rescheduledFromId && (
                      <Button
                        variant='subtle'
                        size='compact-xs'
                        leftSection={<IconArrowLeft size='0.8rem' />}
                        onClick={() =>
                          onJumpToAppointment(appointment.rescheduledFromId!)
                        }
                      >
                        {t('calendar.reschedule.fromPrevious')}
                      </Button>
                    )}
                  </Stack>
                </Table.Td>
                <Table.Td>
                  <Group gap='xs'>
                    {appointment.patient && !isRescheduled && (
                      <SMSReminderButton
                        patient={appointment.patient}
                        appointment={appointment}
                        variant='icon'
                        size='sm'
                        onReminderSent={() => {
                          // Refresh appointments
                          window.location.reload();
                        }}
                      />
                    )}
                    {!isRescheduled && (
                      <ActionIcon
                        variant='light'
                        color='blue'
                        title={t('calendar.rescheduleAppointment')}
                        onClick={() => onRescheduleAppointment(appointment)}
                      >
                        <IconCalendarShare size='1rem' />
                      </ActionIcon>
                    )}
                    <ActionIcon
                      variant='light'
                      color={currentPalette.primary}
                      onClick={() => onEditAppointment(appointment)}
                    >
                      <IconEdit size='1rem' />
                    </ActionIcon>
                    <ActionIcon
                      variant='light'
                      color={utilityColors?.error || 'red'}
                      onClick={() =>
                        appointment.id && onDeleteAppointment(appointment.id)
                      }
                    >
                      <IconTrash size='1rem' />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}

// Week View Component
function WeekView({
  date,
  appointments,
  onEditAppointment,
  onRescheduleAppointment,
  onJumpToAppointment,
  onAddAppointment,
  getStatusBackgroundColor,
  hideWeekends = false,
  currentPalette,
}: CalendarViewProps) {
  const weekStart = startOfWeek(date, { weekStartsOn: 1 });
  const allWeekDays = eachDayOfInterval({
    start: weekStart,
    end: endOfWeek(date, { weekStartsOn: 1 }),
  });

  // Filter out weekends if hideWeekends is true
  const weekDays = hideWeekends
    ? allWeekDays.filter(day => {
        const dayOfWeek = day.getDay();
        return dayOfWeek !== 0 && dayOfWeek !== 6; // 0 = Sunday, 6 = Saturday
      })
    : allWeekDays;

  const timeSlots = Array.from({ length: 13 }, (_, i) => 8 + i); // 8:00 - 20:00
  const dayCount = weekDays.length;
  // Always use compact style
  const timeColumnWidth = '60px';
  const cellPadding = '4px';
  const cellMinHeight = '45px';

  return (
    <ScrollArea>
      <Box
        style={{
          minWidth: hideWeekends ? '500px' : '650px',
          maxWidth: '100%',
          overflowX: 'auto',
        }}
      >
        {/* Days Header */}
        <Box
          mb='md'
          style={{
            display: 'grid',
            gridTemplateColumns: `${timeColumnWidth} repeat(${dayCount}, 1fr)`,
            gap: cellPadding,
            alignItems: 'stretch',
          }}
        >
          <Box></Box>
          {weekDays.map(day => (
            <Paper
              key={day.toISOString()}
              p='xs'
              style={{
                textAlign: 'center',
                backgroundColor: isToday(day)
                  ? `${currentPalette.primary}20`
                  : currentPalette.surface,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                minHeight: '50px',
              }}
              onClick={() => onAddAppointment(day)}
            >
              <Text size='xs' c='dimmed'>
                {format(day, 'EEE', { locale: pl })}
              </Text>
              <Text fw={500} size='md'>
                {format(day, 'd')}
              </Text>
            </Paper>
          ))}
        </Box>

        {/* Time Grid */}
        <Stack gap='2px'>
          {timeSlots.map(hour => (
            <Box
              key={hour}
              style={{
                display: 'grid',
                gridTemplateColumns: `${timeColumnWidth} repeat(${dayCount}, 1fr)`,
                gap: cellPadding,
                alignItems: 'stretch',
              }}
            >
              <Text
                size='xs'
                c='dimmed'
                ta='right'
                pt='xs'
                style={{
                  alignSelf: 'flex-start',
                  lineHeight: '1.2',
                }}
              >
                {hour}:00
              </Text>
              {weekDays.map(day => {
                const dayAppointments = appointments.filter(apt => {
                  const aptDate = new Date(apt.date);
                  return isSameDay(aptDate, day) && aptDate.getHours() === hour;
                });

                return (
                  <Paper
                    key={`${day.toISOString()}-${hour}`}
                    p='2px'
                    style={{
                      minHeight:
                        dayAppointments.length > 0 ? 'auto' : cellMinHeight,
                      backgroundColor: currentPalette.surface,
                      cursor: 'pointer',
                      border: `1px solid ${currentPalette.primary}40`,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                      minWidth: '80px',
                      width: '100%',
                    }}
                    onClick={() => {
                      const appointmentDate = new Date(day);
                      appointmentDate.setHours(hour, 0, 0, 0);
                      onAddAppointment(appointmentDate);
                    }}
                  >
                    {dayAppointments.map(appointment => {
                      const isRescheduled = appointment.status === 'rescheduled';
                      const isCancelled = appointment.status === 'cancelled';
                      return (
                        <Paper
                          key={appointment.id}
                          p='2px'
                          style={{
                            backgroundColor: getStatusBackgroundColor(
                              appointment.status
                            ),
                            opacity: isRescheduled || isCancelled ? 0.6 : 1,
                            cursor: 'pointer',
                            borderRadius: '4px',
                            width: '100%',
                            minWidth: '100%',
                            maxWidth: '100%',
                            flexShrink: 0,
                            boxSizing: 'border-box',
                          }}
                          onClick={e => {
                            e.stopPropagation();
                            onEditAppointment(appointment);
                          }}
                        >
                          <Group justify='space-between' wrap='nowrap' gap={2}>
                            <Text
                              size='xs'
                              fw={500}
                              style={{ lineHeight: '1.2' }}
                            >
                              {format(new Date(appointment.date), 'HH:mm')}
                            </Text>
                            <Group gap={2}>
                              {appointment.rescheduledToId && (
                                <ActionIcon
                                  size='xs'
                                  variant='subtle'
                                  onClick={e => {
                                    e.stopPropagation();
                                    onJumpToAppointment(
                                      appointment.rescheduledToId!
                                    );
                                  }}
                                >
                                  <IconArrowRight size='0.7rem' />
                                </ActionIcon>
                              )}
                              {appointment.rescheduledFromId && (
                                <ActionIcon
                                  size='xs'
                                  variant='subtle'
                                  onClick={e => {
                                    e.stopPropagation();
                                    onJumpToAppointment(
                                      appointment.rescheduledFromId!
                                    );
                                  }}
                                >
                                  <IconArrowLeft size='0.7rem' />
                                </ActionIcon>
                              )}
                              {!isRescheduled && (
                                <ActionIcon
                                  size='xs'
                                  variant='subtle'
                                  onClick={e => {
                                    e.stopPropagation();
                                    onRescheduleAppointment(appointment);
                                  }}
                                >
                                  <IconCalendarShare size='0.7rem' />
                                </ActionIcon>
                              )}
                            </Group>
                          </Group>
                          <Text size='xs' truncate style={{ lineHeight: '1.2' }}>
                            {appointment.patient?.firstName}{' '}
                            {appointment.patient?.lastName}
                          </Text>
                        </Paper>
                      );
                    })}
                  </Paper>
                );
              })}
            </Box>
          ))}
        </Stack>
      </Box>
    </ScrollArea>
  );
}

// Month View Component
interface MonthViewProps extends CalendarViewProps {
  onDateClick: (date: Date) => void;
}

function MonthView({
  date,
  appointments,
  onEditAppointment,
  onJumpToAppointment,
  onDateClick,
  getStatusBackgroundColor,
  currentPalette,
}: MonthViewProps) {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const { t } = useTranslation();
  const weekDays = [t('weekdays.shortMonday'), t('weekdays.shortTuesday'), t('weekdays.shortWednesday'), t('weekdays.shortThursday'), t('weekdays.shortFriday'), t('weekdays.shortSaturday'), t('weekdays.shortSunday')];

  // Always use compact style
  const cellGap = '4px';
  const cellMinHeight = '90px';
  const cellPadding = 'xs';
  const stackGap = '2px';

  return (
    <ScrollArea>
      <Box style={{ minWidth: '600px' }}>
        {/* Days of Week Header */}
        <Group
          mb='md'
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: cellGap,
          }}
        >
          {weekDays.map(day => (
            <Text key={day} ta='center' fw={500} c='dimmed' size='xs'>
              {day}
            </Text>
          ))}
        </Group>

        {/* Calendar Grid */}
        <Box
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: cellGap,
          }}
        >
          {calendarDays.map(day => {
            const dayAppointments = appointments.filter(apt =>
              isSameDay(new Date(apt.date), day)
            );

            const isCurrentMonth = isSameMonth(day, date);
            const isTodayDay = isToday(day);

            return (
              <Paper
                key={day.toISOString()}
                p={cellPadding}
                style={{
                  minHeight: dayAppointments.length > 0 ? 'auto' : cellMinHeight,
                  backgroundColor: isTodayDay
                    ? `${currentPalette.primary}20`
                    : isCurrentMonth
                      ? currentPalette.surface
                      : currentPalette.background,
                  opacity: isCurrentMonth ? 1 : 0.6,
                  cursor: 'pointer',
                  border: `1px solid ${currentPalette.primary}40`,
                }}
                onClick={() => onDateClick(day)}
              >
                <Text size='xs' fw={isTodayDay ? 600 : 400} mb='4px'>
                  {format(day, 'd')}
                </Text>

                <Stack gap={stackGap}>
                  {dayAppointments.map(appointment => {
                    const isRescheduled = appointment.status === 'rescheduled';
                    const isCancelled = appointment.status === 'cancelled';
                    return (
                      <Paper
                        key={appointment.id}
                        p='2px'
                        style={{
                          backgroundColor: getStatusBackgroundColor(
                            appointment.status
                          ),
                          opacity: isRescheduled || isCancelled ? 0.6 : 1,
                          cursor: 'pointer',
                        }}
                        onClick={e => {
                          e.stopPropagation();
                          onEditAppointment(appointment);
                        }}
                      >
                        <Group justify='space-between' wrap='nowrap' gap={2}>
                          <Text
                            size='xs'
                            fw={500}
                            truncate
                            style={{ lineHeight: '1.2' }}
                          >
                            {format(new Date(appointment.date), 'HH:mm')}
                          </Text>
                          <Group gap={2}>
                            {appointment.rescheduledToId && (
                              <ActionIcon
                                size='xs'
                                variant='subtle'
                                onClick={e => {
                                  e.stopPropagation();
                                  onJumpToAppointment(
                                    appointment.rescheduledToId!
                                  );
                                }}
                              >
                                <IconArrowRight size='0.7rem' />
                              </ActionIcon>
                            )}
                            {appointment.rescheduledFromId && (
                              <ActionIcon
                                size='xs'
                                variant='subtle'
                                onClick={e => {
                                  e.stopPropagation();
                                  onJumpToAppointment(
                                    appointment.rescheduledFromId!
                                  );
                                }}
                              >
                                <IconArrowLeft size='0.7rem' />
                              </ActionIcon>
                            )}
                          </Group>
                        </Group>
                        <Text size='xs' truncate style={{ lineHeight: '1.2' }}>
                          {appointment.patient?.firstName}{' '}
                          {appointment.patient?.lastName}
                        </Text>
                      </Paper>
                    );
                  })}
                </Stack>
              </Paper>
            );
          })}
        </Box>
      </Box>
    </ScrollArea>
  );
}

export default Calendar;
