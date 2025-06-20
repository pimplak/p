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
  Table
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus, IconCalendarEvent, IconEdit, IconTrash } from '@tabler/icons-react';
import { format, startOfDay, endOfDay } from 'date-fns';
import { pl } from 'date-fns/locale';
import { useState, useEffect } from 'react';
import { AppointmentForm } from '../components/AppointmentForm';
import { FloatingActionButton, type FABAction } from '../components/FloatingActionButton';
import { useAppointmentStore } from '../stores/useAppointmentStore';
import { usePatientStore } from '../stores/usePatientStore';
import type { Appointment } from '../types/Appointment';

function Calendar() {
  const [opened, { open, close }] = useDisclosure(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
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

  const handleAddAppointment = () => {
    setEditingAppointment(null);
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

  // Filter appointments by selected date
  const dayAppointments = getAppointmentsByDateRange(
    startOfDay(selectedDate),
    endOfDay(selectedDate)
  );

  const filteredAppointments = statusFilter === 'all' 
    ? dayAppointments
    : dayAppointments.filter(apt => apt.status === statusFilter);

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
      onClick: handleAddAppointment,
    },
  ];

  return (
    <Stack>
      <Group justify="space-between">
        <Title order={1}>Kalendarz</Title>
        <Button 
          leftSection={<IconPlus size="1rem" />} 
          onClick={handleAddAppointment}
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

      <Card>
        <Group mb="md">
          <DateInput
            label="Data"
            placeholder="Wybierz datę"
            value={selectedDate}
            onChange={(value) => {
              if (value) {
                const date = typeof value === 'string' ? new Date(value) : value;
                setSelectedDate(date);
              }
            }}
          />
          <Select
            label="Status"
            placeholder="Wszystkie"
            value={statusFilter}
            onChange={(value) => setStatusFilter(value || 'all')}
            data={[
              { value: 'all', label: 'Wszystkie' },
              { value: 'scheduled', label: 'Zaplanowane' },
              { value: 'completed', label: 'Zakończone' },
              { value: 'cancelled', label: 'Anulowane' },
              { value: 'no_show', label: 'Nieobecności' },
            ]}
          />
        </Group>

        <Text fw={500} mb="md">
          Wizyty na {format(selectedDate, 'dd MMMM yyyy', { locale: pl })}
        </Text>

        {filteredAppointments.length === 0 ? (
          <Alert icon={<IconCalendarEvent size="1rem" />} title="Brak wizyt">
            Brak wizyt na wybrany dzień.
          </Alert>
        ) : (
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
                {filteredAppointments
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
                          onClick={() => handleEditAppointment(appointment)}
                        >
                          <IconEdit size="1rem" />
                        </ActionIcon>
                        <ActionIcon 
                          variant="light" 
                          color="red"
                          onClick={() => appointment.id && handleDeleteAppointment(appointment.id)}
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

export default Calendar; 