import { useState, useEffect } from 'react';
import { 
  Title, 
  Button, 
  Group, 
  Card, 
  Text, 
  Badge, 
  ActionIcon,
  Stack,
  TextInput,
  Modal,
  Table,
  Alert,
  Checkbox,
  Divider,
  Skeleton,
  Container
} from '@mantine/core';
import { 
  IconPlus, 
  IconSearch, 
  IconEdit, 
  IconTrash, 
  IconUser, 
  IconDownload,
  IconPhone,
  IconMail,
  IconCalendar
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { DateInput } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import { usePatientStore } from '../stores/usePatientStore';
import { PatientForm } from '../components/PatientForm';
import { exportToExcel } from '../utils/export';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import type { Patient } from '../types/Patient';
import { FloatingActionButton, type FABAction } from '../components/FloatingActionButton';

export function Patients() {
  const { 
    patients, 
    fetchPatients, 
    deletePatient, 
    loading, 
    error 
  } = usePatientStore();
  
  const [opened, { open, close }] = useDisclosure(false);
  const [exportOpened, { open: openExport, close: closeExport }] = useDisclosure(false);
  const [editingPatient, setEditingPatient] = useState<Patient | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Export state
  const [exportPatients, setExportPatients] = useState(true);
  const [exportAppointments, setExportAppointments] = useState(true);
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);
  const [selectedPatients, setSelectedPatients] = useState<number[]>([]);

  const filteredPatients = patients.filter(patient => {
    const query = searchQuery.toLowerCase();
    return (
      patient.firstName.toLowerCase().includes(query) ||
      patient.lastName.toLowerCase().includes(query) ||
      patient.email?.toLowerCase().includes(query) ||
      patient.phone?.includes(query)
    );
  });

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handleAddPatient = () => {
    setEditingPatient(undefined);
    open();
  };

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    open();
  };

  const handleDeletePatient = async (id: number) => {
    await deletePatient(id);
  };

  const handleFormSuccess = () => {
    close();
    setEditingPatient(undefined);
  };

  const handleExport = () => {
    openExport();
  };

  const handlePatientSelection = (patientId: number, checked: boolean) => {
    if (checked) {
      setSelectedPatients(prev => [...prev, patientId]);
    } else {
      setSelectedPatients(prev => prev.filter(id => id !== patientId));
    }
  };

  const selectAllPatients = () => {
    setSelectedPatients(filteredPatients.map(p => p.id!).filter(Boolean));
  };

  const clearSelection = () => {
    setSelectedPatients([]);
  };

  const handleExportData = async () => {
    try {
      const patientsToExport = selectedPatients.length > 0 
        ? patients.filter(p => selectedPatients.includes(p.id!))
        : patients;

      await exportToExcel(
        exportPatients ? patientsToExport : [],
        [], // appointments będą pobrane przez store
        {
          patients: exportPatients,
          appointments: exportAppointments,
          dateFrom: dateFrom || undefined,
          dateTo: dateTo || undefined,
          selectedPatients: selectedPatients.length > 0 ? selectedPatients : undefined
        }
      );

      notifications.show({
        title: 'Sukces!',
        message: 'Dane zostały wyeksportowane',
        color: 'green'
      });
      closeExport();
    } catch {
      notifications.show({
        title: 'Błąd',
        message: 'Nie udało się wyeksportować danych',
        color: 'red'
      });
    }
  };

  // FAB Actions dla mobile
  const fabActions: FABAction[] = [
    {
      id: 'add-patient',
      icon: <IconPlus size="1.2rem" />,
      label: 'Dodaj pacjenta',
      color: 'yellowGreen',
      onClick: handleAddPatient,
    },
    {
      id: 'export',
      icon: <IconDownload size="1.2rem" />,
      label: 'Eksport',
      color: 'blue',
      onClick: handleExport,
    },
  ];

  if (loading) {
    return (
      <Stack>
        <Title order={1}>Pacjenci</Title>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} height={120} />
        ))}
      </Stack>
    );
  }

  if (error) {
    return (
      <Stack>
        <Title order={1}>Pacjenci</Title>
        <Alert color="red" title="Błąd">
          {error}
        </Alert>
      </Stack>
    );
  }

  return (
    <Container fluid>
      <Group justify="space-between" wrap="wrap">
        <Title order={1}>Pacjenci</Title>
        <Group gap="xs" visibleFrom="md">
          <Button 
            leftSection={<IconDownload size="1rem" />} 
            variant="light"
            onClick={handleExport}
          >
            Eksport
          </Button>
          <Button 
            leftSection={<IconPlus size="1rem" />} 
            onClick={handleAddPatient}
          >
            Dodaj pacjenta
          </Button>
        </Group>
      </Group>

      <Card>
        <Group mb="md">
          <TextInput
            placeholder="Szukaj pacjentów..."
            leftSection={<IconSearch size="1rem" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1 }}
          />
        </Group>

        {filteredPatients.length === 0 ? (
          <Alert icon={<IconUser size="1rem" />} title="Brak pacjentów">
            {searchQuery 
              ? 'Nie znaleziono pacjentów pasujących do wyszukiwania.'
              : 'Nie masz jeszcze żadnych pacjentów. Dodaj pierwszego!'
            }
          </Alert>
        ) : (
          <>
            {/* Mobile-first Card Layout with better padding */}
            <Stack gap="md" hiddenFrom="md">
              {filteredPatients.map((patient) => (
                <Card 
                  key={patient.id} 
                  withBorder 
                  p="lg"
                  radius="md"
                  style={{ 
                    background: 'var(--mantine-color-dark-7)',
                    border: '1px solid var(--mantine-color-dark-4)'
                  }}
                >
                  <Stack gap="md">
                    <Group justify="space-between" align="flex-start" wrap="nowrap">
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Text fw={600} size="md" truncate>
                          {patient.firstName} {patient.lastName}
                        </Text>
                        {patient.birthDate && (
                          <Text size="sm" c="dimmed">
                            Ur. {format(new Date(patient.birthDate), 'dd.MM.yyyy')}
                          </Text>
                        )}
                      </div>
                      <Badge size="sm" variant="light" color="blue" style={{ flexShrink: 0 }}>
                        {patient.appointmentCount} wizyt
                      </Badge>
                    </Group>
                    
                    <Stack gap="sm">
                      {patient.phone && (
                        <Group gap="sm" wrap="nowrap">
                          <ActionIcon size="sm" variant="subtle" color="gray" style={{ flexShrink: 0 }}>
                            <IconPhone size="1rem" />
                          </ActionIcon>
                          <Text size="sm" style={{ flex: 1 }}>{patient.phone}</Text>
                        </Group>
                      )}
                      {patient.email && (
                        <Group gap="sm" wrap="nowrap">
                          <ActionIcon size="sm" variant="subtle" color="gray" style={{ flexShrink: 0 }}>
                            <IconMail size="1rem" />
                          </ActionIcon>
                          <Text size="sm" c="dimmed" truncate style={{ flex: 1 }}>
                            {patient.email}
                          </Text>
                        </Group>
                      )}
                      {patient.nextAppointment && (
                        <Group gap="sm" wrap="nowrap">
                          <ActionIcon size="sm" variant="subtle" color="blue" style={{ flexShrink: 0 }}>
                            <IconCalendar size="1rem" />
                          </ActionIcon>
                          <Text size="sm" c="blue" style={{ flex: 1 }}>
                            Następna: {format(new Date(patient.nextAppointment), 'dd.MM.yyyy', { locale: pl })}
                          </Text>
                        </Group>
                      )}
                    </Stack>
                    
                    <Group justify="center" gap="md" mt="sm">
                      <Button 
                        size="sm"
                        variant="light" 
                        color="blue"
                        leftSection={<IconEdit size="1rem" />}
                        onClick={() => handleEditPatient(patient)}
                        style={{ flex: 1 }}
                      >
                        Edytuj
                      </Button>
                      <Button 
                        size="sm"
                        variant="light" 
                        color="red"
                        leftSection={<IconTrash size="1rem" />}
                        onClick={() => patient.id && handleDeletePatient(patient.id)}
                        style={{ flex: 1 }}
                      >
                        Usuń
                      </Button>
                    </Group>
                  </Stack>
                </Card>
              ))}
            </Stack>

            {/* Desktop Table Layout */}
            <Table.ScrollContainer minWidth={800} visibleFrom="md">
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Imię i nazwisko</Table.Th>
                    <Table.Th>Kontakt</Table.Th>
                    <Table.Th>Wizyty</Table.Th>
                    <Table.Th>Ostatnia wizyta</Table.Th>
                    <Table.Th>Następna wizyta</Table.Th>
                    <Table.Th>Akcje</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredPatients.map((patient) => (
                    <Table.Tr key={patient.id}>
                      <Table.Td>
                        <div>
                          <Text fw={500}>
                            {patient.firstName} {patient.lastName}
                          </Text>
                          {patient.birthDate && (
                            <Text size="sm" c="dimmed">
                              Ur. {format(new Date(patient.birthDate), 'dd.MM.yyyy')}
                            </Text>
                          )}
                        </div>
                      </Table.Td>
                      <Table.Td>
                        <div>
                          {patient.phone && (
                            <Text size="sm">{patient.phone}</Text>
                          )}
                          {patient.email && (
                            <Text size="sm" c="dimmed">{patient.email}</Text>
                          )}
                        </div>
                      </Table.Td>
                      <Table.Td>
                        <Badge variant="light">
                          {patient.appointmentCount}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        {patient.lastAppointment ? (
                          <Text size="sm">
                            {format(new Date(patient.lastAppointment), 'dd.MM.yyyy', { locale: pl })}
                          </Text>
                        ) : (
                          <Text size="sm" c="dimmed">-</Text>
                        )}
                      </Table.Td>
                      <Table.Td>
                        {patient.nextAppointment ? (
                          <Text size="sm" c="blue">
                            {format(new Date(patient.nextAppointment), 'dd.MM.yyyy', { locale: pl })}
                          </Text>
                        ) : (
                          <Text size="sm" c="dimmed">-</Text>
                        )}
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <ActionIcon 
                            variant="light" 
                            color="blue"
                            onClick={() => handleEditPatient(patient)}
                          >
                            <IconEdit size="1rem" />
                          </ActionIcon>
                          <ActionIcon 
                            variant="light" 
                            color="red"
                            onClick={() => patient.id && handleDeletePatient(patient.id)}
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
          </>
        )}
      </Card>

      {/* Patient Form Modal */}
      <Modal 
        opened={opened} 
        onClose={close} 
        title={editingPatient ? 'Edytuj pacjenta' : 'Dodaj pacjenta'}
        size="lg"
      >
        <PatientForm 
          patient={editingPatient} 
          onSuccess={handleFormSuccess}
          onCancel={close}
        />
      </Modal>

      {/* Export Modal */}
      <Modal 
        opened={exportOpened} 
        onClose={closeExport} 
        title="Eksport danych"
        size="md"
      >
        <Stack>
          <div>
            <Text fw={500} mb="xs">Co eksportować?</Text>
            <Checkbox
              label="Dane pacjentów"
              checked={exportPatients}
              onChange={(e) => setExportPatients(e.currentTarget.checked)}
            />
            <Checkbox
              label="Wizyty"
              checked={exportAppointments}
              onChange={(e) => setExportAppointments(e.currentTarget.checked)}
            />
          </div>

          <Divider />

          <div>
            <Text fw={500} mb="xs">Zakres dat (wizyty)</Text>
            <Group grow>
              <DateInput
                label="Od"
                placeholder="Wybierz datę"
                value={dateFrom}
                onChange={(value) => {
                  if (value) {
                    const date = typeof value === 'string' ? new Date(value) : value;
                    setDateFrom(date);
                  } else {
                    setDateFrom(null);
                  }
                }}
              />
              <DateInput
                label="Do"
                placeholder="Wybierz datę"
                value={dateTo}
                onChange={(value) => {
                  if (value) {
                    const date = typeof value === 'string' ? new Date(value) : value;
                    setDateTo(date);
                  } else {
                    setDateTo(null);
                  }
                }}
              />
            </Group>
          </div>

          <Divider />

          <div>
            <Group justify="space-between" mb="xs">
              <Text fw={500}>Wybierz pacjentów</Text>
              <Group gap="xs">
                <Button size="xs" variant="light" onClick={selectAllPatients}>
                  Zaznacz wszystkich
                </Button>
                <Button size="xs" variant="light" onClick={clearSelection}>
                  Wyczyść
                </Button>
              </Group>
            </Group>
            <Text size="sm" c="dimmed" mb="sm">
              Pozostaw puste aby eksportować wszystkich
            </Text>
            <Stack gap="xs" mah={200} style={{ overflowY: 'auto' }}>
              {filteredPatients.map((patient) => (
                <Checkbox
                  key={patient.id}
                  label={`${patient.firstName} ${patient.lastName}`}
                  checked={selectedPatients.includes(patient.id!)}
                  onChange={(e) => handlePatientSelection(patient.id!, e.currentTarget.checked)}
                />
              ))}
            </Stack>
          </div>

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={closeExport}>
              Anuluj
            </Button>
            <Button onClick={handleExportData}>
              Eksportuj
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Floating Action Button for mobile */}
      <FloatingActionButton actions={fabActions} />
    </Container>
  );
} 