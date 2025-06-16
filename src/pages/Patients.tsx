import { useState, useEffect } from 'react';
import { 
  Title, 
  Button, 
  Group, 
  TextInput, 
  Table,
  Card,
  Modal,
  Stack,
  ActionIcon,
  Badge,
  Text,
  Skeleton,
  Alert,
  Checkbox,
  Divider
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus, IconSearch, IconEdit, IconTrash, IconUser, IconDownload } from '@tabler/icons-react';
import { usePatientStore } from '../stores/usePatientStore';
import { useAppointmentStore } from '../stores/useAppointmentStore';
import { PatientForm } from '../components/PatientForm';
import { exportToExcel } from '../utils/export';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import type { Patient } from '../types/Patient';

export function Patients() {
  const [opened, { open, close }] = useDisclosure(false);
  const [exportOpened, { open: openExport, close: closeExport }] = useDisclosure(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Export form state
  const [selectedPatients, setSelectedPatients] = useState<number[]>([]);
  const [exportAppointments, setExportAppointments] = useState(true);
  const [exportPatients, setExportPatients] = useState(true);
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);
  
  const { 
    patients, 
    fetchPatients, 
    deletePatient, 
    searchPatients,
    loading,
    error 
  } = usePatientStore();

  const { appointments, fetchAppointments } = useAppointmentStore();

  useEffect(() => {
    fetchPatients();
    fetchAppointments();
  }, [fetchPatients, fetchAppointments]);

  const filteredPatients = searchQuery ? searchPatients(searchQuery) : patients;

  const handleAddPatient = () => {
    setEditingPatient(null);
    open();
  };

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    open();
  };

  const handleDeletePatient = async (id: number) => {
    if (window.confirm('Czy na pewno chcesz usunąć tego pacjenta?')) {
      await deletePatient(id);
    }
  };

  const handleFormSuccess = () => {
    close();
    setEditingPatient(null);
  };

  const handleExport = () => {
    exportToExcel(patients, appointments, {
      patients: exportPatients,
      appointments: exportAppointments,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      selectedPatients: selectedPatients.length > 0 ? selectedPatients : undefined,
    });
    closeExport();
  };

  const handlePatientSelection = (patientId: number, checked: boolean) => {
    if (checked) {
      setSelectedPatients(prev => [...prev, patientId]);
    } else {
      setSelectedPatients(prev => prev.filter(id => id !== patientId));
    }
  };

  const selectAllPatients = () => {
    const allIds = filteredPatients.map(p => p.id!).filter(Boolean);
    setSelectedPatients(allIds);
  };

  const clearSelection = () => {
    setSelectedPatients([]);
  };

  if (loading) {
    return (
      <Stack>
        <Title order={1}>Pacjenci</Title>
        <Card>
          <Stack>
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} height={50} />
            ))}
          </Stack>
        </Card>
      </Stack>
    );
  }

  return (
    <Stack>
      <Group justify="space-between">
        <Title order={1}>Pacjenci</Title>
        <Group>
          <Button 
            leftSection={<IconDownload size="1rem" />} 
            variant="light"
            onClick={openExport}
          >
            Eksportuj
          </Button>
          <Button leftSection={<IconPlus size="1rem" />} onClick={handleAddPatient}>
            Dodaj pacjenta
          </Button>
        </Group>
      </Group>

      {error && (
        <Alert color="red" title="Błąd">
          {error}
        </Alert>
      )}

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
          <Table.ScrollContainer minWidth={800}>
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
                onChange={setDateFrom}
              />
              <DateInput
                label="Do"
                placeholder="Wybierz datę"
                value={dateTo}
                onChange={setDateTo}
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
            <Button onClick={handleExport}>
              Eksportuj
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
} 