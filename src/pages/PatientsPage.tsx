import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Title, 
  Button, 
  Group, 
  Card, 
  Alert,
  Skeleton,
  Container,
  Modal,
  Stack,
  Text,
  Badge,
  ActionIcon,
  Switch,
  Menu
} from '@mantine/core';
import { 
  IconPlus, 
  IconUser, 
  IconDownload,
  IconPhone,
  IconMail,
  IconCalendar,
  IconEdit,
  IconArchive,
  IconRestore,
  IconArchiveOff,
  IconDots
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useDebounce } from 'use-debounce';
import { notifications } from '@mantine/notifications';
import { usePatientStore } from '../stores/usePatientStore';
import { PatientForm } from '../components/PatientForm';
import { PatientSearchBar } from '../components/PatientSearchBar';
import { PatientTable } from '../components/PatientTable';
import { ExportModal } from '../components/ExportModal';
import { exportToExcel } from '../utils/export';
import type { Patient } from '../types/Patient';
import { FloatingActionButton, type FABAction } from '../components/FloatingActionButton';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

export function PatientsPage() {
  const navigate = useNavigate();
  const { 
    patients, 
    fetchPatients, 
    archivePatient,
    restorePatient,
    showArchived,
    toggleShowArchived,
    loading, 
    error 
  } = usePatientStore();
  
  const [opened, { open, close }] = useDisclosure(false);
  const [exportOpened, { open: openExport, close: closeExport }] = useDisclosure(false);
  const [editingPatient, setEditingPatient] = useState<Patient | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Debounce search query - 300ms throttling  
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);

  const filteredPatients = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return patients;
    
    const query = debouncedSearchQuery.toLowerCase();
    return patients.filter(patient => 
      patient.firstName.toLowerCase().includes(query) ||
      patient.lastName.toLowerCase().includes(query) ||
      patient.email?.toLowerCase().includes(query) ||
      patient.phone?.includes(query) ||
      patient.tags?.some(tag => tag.toLowerCase().includes(query))
    );
  }, [patients, debouncedSearchQuery]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handleAddPatient = useCallback(() => {
    setEditingPatient(undefined);
    open();
  }, [open]);

  const handleEditPatient = useCallback((patient: Patient) => {
    setEditingPatient(patient);
    open();
  }, [open]);

  const handleViewPatient = useCallback((patient: Patient) => {
    navigate(`/patients/${patient.id}`);
  }, [navigate]);

  const handleArchivePatient = useCallback(async (id: number) => {
    try {
      await archivePatient(id);
      notifications.show({
        title: 'Sukces',
        message: 'Pacjent został zarchiwizowany',
        color: 'green',
      });
    } catch {
      notifications.show({
        title: 'Błąd',
        message: 'Nie udało się zarchiwizować pacjenta',
        color: 'red',
      });
    }
  }, [archivePatient]);

  const handleRestorePatient = useCallback(async (id: number) => {
    try {
      await restorePatient(id);
      notifications.show({
        title: 'Sukces',
        message: 'Pacjent został przywrócony',
        color: 'green',
      });
    } catch {
      notifications.show({
        title: 'Błąd',
        message: 'Nie udało się przywrócić pacjenta',
        color: 'red',
      });
    }
  }, [restorePatient]);

  const handleFormSuccess = () => {
    close();
    setEditingPatient(undefined);
  };

  const handleExport = () => {
    openExport();
  };

  const handleExportData = async (options: {
    exportPatients: boolean;
    exportAppointments: boolean;
    dateFrom: Date | null;
    dateTo: Date | null;
    selectedPatients: number[];
  }) => {
    try {
      const patientsToExport = options.selectedPatients.length > 0 
        ? patients.filter(p => options.selectedPatients.includes(p.id!))
        : patients;

      await exportToExcel(
        options.exportPatients ? patientsToExport : [],
        [], // appointments będą pobrane przez store
        {
          patients: options.exportPatients,
          appointments: options.exportAppointments,
          dateFrom: options.dateFrom || undefined,
          dateTo: options.dateTo || undefined,
          selectedPatients: options.selectedPatients.length > 0 ? options.selectedPatients : undefined
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
      <Container fluid>
        <Title order={1}>Pacjenci</Title>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} height={120} />
        ))}
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid>
        <Title order={1}>Pacjenci</Title>
        <Alert color="red" title="Błąd">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid>
      <Group justify="space-between" wrap="wrap">
        <Title order={1}>Pacjenci</Title>
        <Group gap="xs" visibleFrom="md">
          <Switch
            label="Pokaż zarchiwizowanych"
            checked={showArchived}
            onChange={toggleShowArchived}
            thumbIcon={
              showArchived ? (
                <IconArchiveOff size="0.8rem" stroke={3} />
              ) : (
                <IconArchive size="0.8rem" stroke={3} />
              )
            }
          />
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
        <PatientSearchBar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {filteredPatients.length === 0 ? (
          <Alert icon={<IconUser size="1rem" />} title="Brak pacjentów">
            {debouncedSearchQuery 
              ? 'Nie znaleziono pacjentów pasujących do wyszukiwania.'
              : showArchived 
                ? 'Nie masz żadnych zarchiwizowanych pacjentów.'
                : 'Nie masz jeszcze żadnych aktywnych pacjentów. Dodaj pierwszego!'
            }
          </Alert>
        ) : (
          <>
            {/* Mobile-first Card List */}
            <Stack gap="md" hiddenFrom="md">
              {filteredPatients.map((patient) => (
                <Card 
                  key={patient.id} 
                  withBorder 
                  p="lg"
                  radius="md"
                  style={{ 
                    background: patient.status === 'archived' 
                      ? 'var(--mantine-color-gray-9)' 
                      : 'var(--mantine-color-dark-7)',
                    border: '1px solid var(--mantine-color-dark-4)',
                    opacity: patient.status === 'archived' ? 0.7 : 1,
                    cursor: 'pointer'
                  }}
                  onClick={() => handleViewPatient(patient)}
                >
                  <Stack gap="md">
                    <Group justify="space-between" align="flex-start" wrap="nowrap">
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Group gap="xs" align="center">
                          <Text fw={600} size="md" truncate>
                            {patient.firstName} {patient.lastName}
                          </Text>
                          <Badge
                            size="xs"
                            color={patient.status === 'active' ? 'green' : 'gray'}
                            variant="light"
                          >
                            {patient.status === 'active' ? 'Aktywny' : 'Zarchiwizowany'}
                          </Badge>
                        </Group>
                        {patient.birthDate && (
                          <Text size="sm" c="dimmed">
                            Ur. {format(
                              typeof patient.birthDate === 'string' 
                                ? new Date(patient.birthDate) 
                                : patient.birthDate, 
                              'dd.MM.yyyy'
                            )}
                          </Text>
                        )}
                        {patient.tags && patient.tags.length > 0 && (
                          <Group gap={4} mt={4}>
                            {patient.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="outline" size="xs">
                                {tag}
                              </Badge>
                            ))}
                            {patient.tags.length > 3 && (
                              <Badge variant="outline" size="xs" c="dimmed">
                                +{patient.tags.length - 3}
                              </Badge>
                            )}
                          </Group>
                        )}
                      </div>
                      <Group>
                        <Badge size="sm" variant="light" color="blue" style={{ flexShrink: 0 }}>
                          {patient.appointmentCount} wizyt
                        </Badge>
                        <Menu shadow="md" width={180}>
                          <Menu.Target>
                            <ActionIcon 
                              variant="light" 
                              size="sm"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <IconDots size="1rem" />
                            </ActionIcon>
                          </Menu.Target>

                          <Menu.Dropdown>
                            <Menu.Item
                              leftSection={<IconEdit size="1rem" />}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditPatient(patient);
                              }}
                            >
                              Edytuj
                            </Menu.Item>
                            
                            {patient.status === 'active' ? (
                              <Menu.Item
                                leftSection={<IconArchive size="1rem" />}
                                color="red"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (patient.id) handleArchivePatient(patient.id);
                                }}
                              >
                                Archiwizuj
                              </Menu.Item>
                            ) : (
                              <Menu.Item
                                leftSection={<IconRestore size="1rem" />}
                                color="green"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (patient.id) handleRestorePatient(patient.id);
                                }}
                              >
                                Przywróć
                              </Menu.Item>
                            )}
                          </Menu.Dropdown>
                        </Menu>
                      </Group>
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
                            Następna: {format(
                              typeof patient.nextAppointment === 'string' 
                                ? new Date(patient.nextAppointment) 
                                : patient.nextAppointment, 
                              'dd.MM.yyyy', 
                              { locale: pl }
                            )}
                          </Text>
                        </Group>
                      )}
                    </Stack>
                  </Stack>
                </Card>
              ))}
            </Stack>

            {/* Desktop Table Layout */}
            <PatientTable
              patients={filteredPatients}
              onEdit={handleEditPatient}
              onView={handleViewPatient}
              onArchive={handleArchivePatient}
              onRestore={handleRestorePatient}
            />
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
      <ExportModal
        opened={exportOpened}
        onClose={closeExport}
        filteredPatients={filteredPatients}
        onExport={handleExportData}
      />

      {/* Floating Action Button for mobile */}
      <FloatingActionButton actions={fabActions} />
    </Container>
  );
} 