import { 
  Title, 
  Button, 
  Group, 
  Card,
  Modal,
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
  ScrollArea
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { 
  IconPlus, 
  IconCalendarEvent, 
  IconEdit, 
  IconTrash, 
  IconChevronLeft, 
  IconChevronRight
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
  eachDayOfInterval
} from 'date-fns';
import { pl } from 'date-fns/locale';
import { useState, useEffect, useMemo } from 'react';
import { AppointmentForm } from '../components/AppointmentForm';
import { FloatingActionButton, type FABAction } from '../components/FloatingActionButton';
import { useAppointmentStore } from '../stores/useAppointmentStore';
import { usePatientStore } from '../stores/usePatientStore';
import type { Appointment, AppointmentWithPatient } from '../types/Appointment';

type CalendarView = 'day' | 'week' | 'month';

function Calendar() {
  const [opened, { open, close }] = useDisclosure(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [view, setView] = useState<CalendarView>('week');
  
  const { 
    fetchAppointments, 
    deleteAppointment,
    getAppointmentsByDateRange,
    error 
  } = useAppointmentStore();

  const { fetchPatients } = usePatientStore();

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
  }, [fetchAppointments, fetchPatients]);

  const handleAddAppointment = (date?: Date) => {
    setEditingAppointment(null);
    if (date) {
      // Można przekazać datę do formularza
      setSelectedDate(date);
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
      case 'scheduled': return 'blue';
      case 'completed': return 'green';
      case 'cancelled': return 'red';
      case 'no_show': return 'orange';
      default: return 'gray';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Zaplanowana';
      case 'completed': return 'Zakończona';
      case 'cancelled': return 'Anulowana';
      case 'no_show': return 'Nieobecność';
      default: return status;
    }
  };

  // FAB Actions dla mobile
  const fabActions: FABAction[] = [
    {
      id: 'add-appointment',
      icon: <IconPlus size="1.2rem" />,
      label: 'Dodaj wizytę',
      color: 'yellowGreen',
      onClick: () => handleAddAppointment(),
    },
  ];

  return (
    <Stack>
      {/* Header */}
      <Group justify="space-between">
        <Title order={1}>Kalendarz</Title>
        <Button 
          leftSection={<IconPlus size="1rem" />} 
          onClick={() => handleAddAppointment()}
          visibleFrom="md"
        >
          Dodaj wizytę
        </Button>
      </Group>

      {error && (
        <Alert color="red" title="Błąd">
          {error}
        </Alert>
      )}

      {/* Calendar Controls */}
      <Card>
        <Group justify="space-between" mb="md">
          {/* View Selector */}
          <SegmentedControl
            value={view}
            onChange={(value) => setView(value as CalendarView)}
            data={[
              { label: 'Dzień', value: 'day' },
              { label: 'Tydzień', value: 'week' },
              { label: 'Miesiąc', value: 'month' },
            ]}
          />

          {/* Navigation */}
          <Group>
            <ActionIcon 
              variant="light" 
              onClick={handlePrevious}
              size="lg"
            >
              <IconChevronLeft size="1.2rem" />
            </ActionIcon>
            
            <Button 
              variant="light" 
              onClick={handleToday}
              size="sm"
            >
              Dzisiaj
            </Button>
            
            <ActionIcon 
              variant="light" 
              onClick={handleNext}
              size="lg"
            >
              <IconChevronRight size="1.2rem" />
            </ActionIcon>
          </Group>
        </Group>

        {/* Period Title */}
        <Group justify="space-between" mb="md">
          <Text size="xl" fw={600}>
            {getCurrentPeriodTitle()}
          </Text>
          
          <Group>
            <DateInput
              placeholder="Przejdź do daty"
              value={selectedDate}
              onChange={(value) => {
                if (value) {
                  const date = typeof value === 'string' ? new Date(value) : value;
                  setSelectedDate(date);
                }
              }}
              size="sm"
              w={180}
            />
            <Select
              placeholder="Status"
              value={statusFilter}
              onChange={(value) => setStatusFilter(value || 'all')}
              data={[
                { value: 'all', label: 'Wszystkie' },
                { value: 'scheduled', label: 'Zaplanowane' },
                { value: 'completed', label: 'Zakończone' },
                { value: 'cancelled', label: 'Anulowane' },
                { value: 'no_show', label: 'Nieobecności' },
              ]}
              size="sm"
              w={140}
            />
          </Group>
        </Group>

        <Divider mb="md" />

        {/* Calendar View */}
        {view === 'day' && (
          <DayView 
            date={selectedDate}
            appointments={currentPeriodAppointments}
            onEditAppointment={handleEditAppointment}
            onDeleteAppointment={handleDeleteAppointment}
            onAddAppointment={handleAddAppointment}
            getStatusColor={getStatusColor}
            getStatusLabel={getStatusLabel}
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
            getStatusLabel={getStatusLabel}
          />
        )}

        {view === 'month' && (
          <MonthView 
            date={selectedDate}
            appointments={currentPeriodAppointments}
            onEditAppointment={handleEditAppointment}
            onDeleteAppointment={handleDeleteAppointment}
            onAddAppointment={handleAddAppointment}
            onDateClick={setSelectedDate}
            getStatusColor={getStatusColor}
            getStatusLabel={getStatusLabel}
          />
        )}
      </Card>

      <Modal 
        opened={opened} 
        onClose={close} 
        title={editingAppointment ? 'Edytuj wizytę' : 'Dodaj wizytę'}
        size="lg"
      >
        <AppointmentForm 
          appointment={editingAppointment} 
          onSuccess={handleFormSuccess}
          onCancel={close}
        />
      </Modal>

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
  getStatusLabel: (status: string) => string;
}

function DayView({ 
  date, 
  appointments, 
  onEditAppointment, 
  onDeleteAppointment, 
  onAddAppointment,
  getStatusColor,
  getStatusLabel 
}: CalendarViewProps) {
  const dayAppointments = appointments.filter(apt => 
    isSameDay(new Date(apt.date), date)
  );

  if (dayAppointments.length === 0) {
    return (
      <Alert icon={<IconCalendarEvent size="1rem" />} title="Brak wizyt">
        Brak wizyt na ten dzień.
        <Button 
          variant="light" 
          size="sm" 
          mt="sm"
          onClick={() => onAddAppointment(date)}
        >
          Dodaj wizytę
        </Button>
      </Alert>
    );
  }

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
          {dayAppointments
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .map((appointment) => (
            <Table.Tr key={appointment.id}>
              <Table.Td>
                <Text fw={500}>
                  {format(new Date(appointment.date), 'HH:mm')}
                </Text>
              </Table.Td>
              <Table.Td>
                <div>
                  <Text fw={500}>
                    {appointment.patient?.firstName} {appointment.patient?.lastName}
                  </Text>
                  {appointment.patient?.phone && (
                    <Text size="sm" c="dimmed">
                      {appointment.patient.phone}
                    </Text>
                  )}
                </div>
              </Table.Td>
              <Table.Td>
                <Text size="sm">
                  {appointment.type || 'Wizyta'}
                </Text>
              </Table.Td>
              <Table.Td>
                <Text size="sm">
                  {appointment.duration} min
                </Text>
              </Table.Td>
              <Table.Td>
                <Text size="sm" fw={500}>
                  {appointment.price ? `${appointment.price} zł` : '-'}
                </Text>
              </Table.Td>
              <Table.Td>
                {appointment.paymentInfo?.isPaid ? (
                  <Badge color="green" size="sm">Opłacono</Badge>
                ) : (
                  <Badge color="red" size="sm">Nieopłacono</Badge>
                )}
              </Table.Td>
              <Table.Td>
                <Badge color={getStatusColor(appointment.status)}>
                  {getStatusLabel(appointment.status)}
                </Badge>
              </Table.Td>
              <Table.Td>
                <Group gap="xs">
                  <ActionIcon 
                    variant="light" 
                    color="blue"
                    onClick={() => onEditAppointment(appointment)}
                  >
                    <IconEdit size="1rem" />
                  </ActionIcon>
                  <ActionIcon 
                    variant="light" 
                    color="red"
                    onClick={() => appointment.id && onDeleteAppointment(appointment.id)}
                  >
                    <IconTrash size="1rem" />
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
  getStatusColor
}: CalendarViewProps) {
  const weekStart = startOfWeek(date, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({
    start: weekStart,
    end: endOfWeek(date, { weekStartsOn: 1 })
  });

  const timeSlots = Array.from({ length: 13 }, (_, i) => 8 + i); // 8:00 - 20:00

  return (
    <ScrollArea>
      <Box style={{ minWidth: '800px' }}>
        {/* Days Header */}
        <Group mb="md" style={{ display: 'grid', gridTemplateColumns: '80px repeat(7, 1fr)', gap: '8px' }}>
          <Box></Box>
          {weekDays.map((day) => (
            <Paper 
              key={day.toISOString()} 
              p="sm" 
              style={{ 
                textAlign: 'center',
                backgroundColor: isToday(day) ? 'var(--color-primary-light)' : 'var(--color-surface)',
                cursor: 'pointer'
              }}
              onClick={() => onAddAppointment(day)}
            >
              <Text size="sm" c="dimmed">
                {format(day, 'EEE', { locale: pl })}
              </Text>
              <Text fw={500} size="lg">
                {format(day, 'd')}
              </Text>
            </Paper>
          ))}
        </Group>

        {/* Time Grid */}
        <Stack gap="xs">
          {timeSlots.map((hour) => (
            <Group key={hour} style={{ display: 'grid', gridTemplateColumns: '80px repeat(7, 1fr)', gap: '8px' }}>
              <Text size="sm" c="dimmed" ta="right" pt="xs">
                {hour}:00
              </Text>
              {weekDays.map((day) => {
                const dayAppointments = appointments.filter(apt => {
                  const aptDate = new Date(apt.date);
                  return isSameDay(aptDate, day) && aptDate.getHours() === hour;
                });

                return (
                  <Paper 
                    key={`${day.toISOString()}-${hour}`}
                    p="xs" 
                    style={{ 
                      minHeight: '60px',
                      backgroundColor: 'var(--color-surface)',
                      cursor: 'pointer',
                      border: '1px solid var(--color-input-border)'
                    }}
                    onClick={() => {
                      const appointmentDate = new Date(day);
                      appointmentDate.setHours(hour, 0, 0, 0);
                      onAddAppointment(appointmentDate);
                    }}
                  >
                    {dayAppointments.map((appointment) => (
                      <Paper
                        key={appointment.id}
                        p="xs"
                        mb="xs"
                        style={{ 
                          backgroundColor: `var(--mantine-color-${getStatusColor(appointment.status)}-light)`,
                          cursor: 'pointer'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditAppointment(appointment);
                        }}
                      >
                        <Text size="xs" fw={500}>
                          {format(new Date(appointment.date), 'HH:mm')}
                        </Text>
                        <Text size="xs" truncate>
                          {appointment.patient?.firstName} {appointment.patient?.lastName}
                        </Text>
                      </Paper>
                    ))}
                  </Paper>
                );
              })}
            </Group>
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
  getStatusColor
}: MonthViewProps) {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  });

  const weekDays = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nie'];

  return (
    <Box>
      {/* Days of Week Header */}
      <Group mb="md" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
        {weekDays.map((day) => (
          <Text key={day} ta="center" fw={500} c="dimmed">
            {day}
          </Text>
        ))}
      </Group>

      {/* Calendar Grid */}
      <Box style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
        {calendarDays.map((day) => {
          const dayAppointments = appointments.filter(apt => 
            isSameDay(new Date(apt.date), day)
          );
          
          const isCurrentMonth = isSameMonth(day, date);
          const isTodayDay = isToday(day);

          return (
            <Paper
              key={day.toISOString()}
              p="sm"
              style={{
                minHeight: '120px',
                backgroundColor: isTodayDay 
                  ? 'var(--color-primary-light)' 
                  : isCurrentMonth 
                    ? 'var(--color-surface)' 
                    : 'var(--color-background)',
                opacity: isCurrentMonth ? 1 : 0.6,
                cursor: 'pointer',
                border: '1px solid var(--color-input-border)'
              }}
              onClick={() => onDateClick(day)}
            >
              <Text 
                size="sm" 
                fw={isTodayDay ? 600 : 400}
                mb="xs"
              >
                {format(day, 'd')}
              </Text>
              
              <Stack gap="xs">
                {dayAppointments.slice(0, 3).map((appointment) => (
                  <Paper
                    key={appointment.id}
                    p="xs"
                    style={{
                      backgroundColor: `var(--mantine-color-${getStatusColor(appointment.status)}-light)`,
                      cursor: 'pointer'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditAppointment(appointment);
                    }}
                  >
                    <Text size="xs" fw={500} truncate>
                      {format(new Date(appointment.date), 'HH:mm')}
                    </Text>
                    <Text size="xs" truncate>
                      {appointment.patient?.firstName} {appointment.patient?.lastName}
                    </Text>
                  </Paper>
                ))}
                
                {dayAppointments.length > 3 && (
                  <Text size="xs" c="dimmed">
                    +{dayAppointments.length - 3} więcej
                  </Text>
                )}
              </Stack>
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
}

export default Calendar; 