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
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
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
import { useState, useEffect, useMemo } from 'react';
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
import type { Appointment, AppointmentWithPatient } from '../types/Appointment';
import type { ColorPalette } from '../types/theme';

type CalendarView = 'day' | 'week' | 'month';

function Calendar() {
  const [opened, { open, close }] = useDisclosure(false);
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [newAppointmentDate, setNewAppointmentDate] = useState<Date | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [view, setView] = useState<CalendarView>('day');
  const [hideWeekends, setHideWeekends] = useState(false);

  const {
    fetchAppointments,
    deleteAppointment,
    getAppointmentsByDateRange,
    appointments,
    error,
  } = useAppointmentStore();

  const { fetchPatients } = usePatientStore();
  const { currentPalette, utilityColors } = useTheme();

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
    if (window.confirm('Czy na pewno chcesz usunąć tę wizytę?')) {
      await deleteAppointment(id);
    }
  };

  const handleFormSuccess = () => {
    close();
    setEditingAppointment(null);
    setNewAppointmentDate(null);
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
  }, [selectedDate, view, getAppointmentsByDateRange, statusFilter, appointments]);

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
      default:
        return `${currentPalette.text}26`;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Zaplanowana';
      case 'completed':
        return 'Zakończona';
      case 'cancelled':
        return 'Anulowana';
      case 'no_show':
        return 'Nieobecność';
      default:
        return status;
    }
  };

  // FAB Actions dla mobile
  const fabActions: FABAction[] = [
    {
      id: 'add-appointment',
      icon: <IconPlus size='1.2rem' />,
      label: 'Dodaj wizytę',
      onClick: () => handleAddAppointment(),
    },
  ];

  return (
    <Stack>
      {/* Header */}
      <Group justify='space-between'>
        <Title order={1}>Kalendarz</Title>
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
            Dodaj wizytę
          </Button>
        </Group>
      </Group>

      {error && (
        <Alert color={utilityColors.error} title='Błąd'>
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
              { label: 'Dzień', value: 'day' },
              { label: 'Tydzień', value: 'week' },
              { label: 'Miesiąc', value: 'month' },
            ]}
          />

          {/* Navigation */}
          <Group>
            <ActionIcon variant='light' onClick={handlePrevious} size='lg'>
              <IconChevronLeft size='1.2rem' />
            </ActionIcon>

            <Button variant='light' onClick={handleToday} size='sm'>
              Dzisiaj
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
              placeholder='Przejdź do daty'
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
              placeholder='Status'
              value={statusFilter}
              onChange={value => setStatusFilter(value || 'all')}
              data={[
                { value: 'all', label: 'Wszystkie' },
                { value: 'scheduled', label: 'Zaplanowane' },
                { value: 'completed', label: 'Zakończone' },
                { value: 'cancelled', label: 'Anulowane' },
                { value: 'no_show', label: 'Nieobecności' },
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
                title={hideWeekends ? 'Pokaż weekendy' : 'Ukryj weekendy'}
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
        title={editingAppointment ? 'Edytuj wizytę' : 'Dodaj wizytę'}
      >
        <AppointmentForm
          appointment={editingAppointment}
          initialDate={newAppointmentDate}
          onSuccess={handleFormSuccess}
          onCancel={close}
        />
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
  onAddAppointment,
  getStatusColor,
  getStatusLabel,
  utilityColors,
  currentPalette,
}: CalendarViewProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  const dayAppointments = appointments.filter(apt =>
    isSameDay(new Date(apt.date), date)
  );

  if (dayAppointments.length === 0) {
    return (
      <Alert icon={<IconCalendarEvent size='1rem' />} title='Brak wizyt'>
        Brak wizyt na ten dzień.
        <Button
          variant='light'
          size='sm'
          mt='sm'
          onClick={() => onAddAppointment(date)}
        >
          Dodaj wizytę
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
            <Table.Th>Godzina</Table.Th>
            <Table.Th>Pacjent</Table.Th>
            <Table.Th>Typ</Table.Th>
            <Table.Th>Czas trwania</Table.Th>
            <Table.Th>Cena</Table.Th>
            <Table.Th>Płatność</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Akcje</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {sortedAppointments.map(appointment => (
            <Table.Tr key={appointment.id}>
              <Table.Td>
                <Text fw={500}>
                  {format(new Date(appointment.date), 'HH:mm')}
                </Text>
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
                <Text size='sm'>{appointment.type || 'Wizyta'}</Text>
              </Table.Td>
              <Table.Td>
                <Text size='sm'>{appointment.duration} min</Text>
              </Table.Td>
              <Table.Td>
                <Text size='sm' fw={500}>
                  {appointment.price ? `${appointment.price} zł` : '-'}
                </Text>
              </Table.Td>
              <Table.Td>
                {appointment.paymentInfo?.isPaid ? (
                  <Badge color={utilityColors?.success || 'green'} size='sm'>
                    Opłacono
                  </Badge>
                ) : (
                  <Badge color={utilityColors?.error || 'red'} size='sm'>
                    Nieopłacono
                  </Badge>
                )}
              </Table.Td>
              <Table.Td>
                <Badge color={getStatusColor(appointment.status)}>
                  {getStatusLabel(appointment.status)}
                </Badge>
              </Table.Td>
              <Table.Td>
                <Group gap='xs'>
                  {appointment.patient && (
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
          ))}
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
                    {dayAppointments.map(appointment => (
                      <Paper
                        key={appointment.id}
                        p='2px'
                        style={{
                          backgroundColor: getStatusBackgroundColor(
                            appointment.status
                          ),
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
                        <Text size='xs' fw={500} style={{ lineHeight: '1.2' }}>
                          {format(new Date(appointment.date), 'HH:mm')}
                        </Text>
                        <Text size='xs' truncate style={{ lineHeight: '1.2' }}>
                          {appointment.patient?.firstName}{' '}
                          {appointment.patient?.lastName}
                        </Text>
                      </Paper>
                    ))}
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

  const weekDays = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nie'];

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
                  {dayAppointments.map(appointment => (
                    <Paper
                      key={appointment.id}
                      p='2px'
                      style={{
                        backgroundColor: getStatusBackgroundColor(
                          appointment.status
                        ),
                        cursor: 'pointer',
                      }}
                      onClick={e => {
                        e.stopPropagation();
                        onEditAppointment(appointment);
                      }}
                    >
                      <Text
                        size='xs'
                        fw={500}
                        truncate
                        style={{ lineHeight: '1.2' }}
                      >
                        {format(new Date(appointment.date), 'HH:mm')}
                      </Text>
                      <Text size='xs' truncate style={{ lineHeight: '1.2' }}>
                        {appointment.patient?.firstName}{' '}
                        {appointment.patient?.lastName}
                      </Text>
                    </Paper>
                  ))}
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
