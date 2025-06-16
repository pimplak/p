import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Title,
  Text,
  Group,
  Button,
  Stack,
  Tabs,
  Badge,
  ActionIcon,
  Modal,
  LoadingOverlay,
  Alert,
  Grid,
  Card,
  Divider,
  Menu,
} from '@mantine/core';
import {
  IconEdit,
  IconArchive,
  IconRestore,
  IconPhone,
  IconMail,
  IconCalendar,
  IconNotes,
  IconTarget,
  IconDots,
  IconAlertCircle,
} from '@tabler/icons-react';
import { usePatientStore } from '../stores/usePatientStore';
import { PatientForm } from './PatientForm';
import { notifications } from '@mantine/notifications';
import type { Patient } from '../types/Patient';

export function PatientProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPatient, archivePatient, restorePatient, loading, error } = usePatientStore();
  
  const [patient, setPatient] = useState<Patient | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [archiveModalOpen, setArchiveModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('overview');

  useEffect(() => {
    if (id) {
      loadPatient(parseInt(id));
    }
  }, [id]);

  const loadPatient = async (patientId: number) => {
    try {
      const patientData = await getPatient(patientId);
      if (patientData) {
        setPatient(patientData);
      } else {
        navigate('/patients', { replace: true });
        notifications.show({
          title: 'Błąd',
          message: 'Nie znaleziono pacjenta',
          color: 'red',
        });
      }
    } catch (error) {
      console.error('Błąd podczas ładowania pacjenta:', error);
      notifications.show({
        title: 'Błąd',
        message: 'Nie udało się załadować danych pacjenta',
        color: 'red',
      });
    }
  };

  const handleArchive = async () => {
    if (!patient?.id) return;
    
    try {
      await archivePatient(patient.id);
      setArchiveModalOpen(false);
      notifications.show({
        title: 'Sukces',
        message: 'Pacjent został zarchiwizowany',
        color: 'green',
      });
      // Odśwież dane pacjenta
      await loadPatient(patient.id);
    } catch {
      notifications.show({
        title: 'Błąd',
        message: 'Nie udało się zarchiwizować pacjenta',
        color: 'red',
      });
    }
  };

  const handleRestore = async () => {
    if (!patient?.id) return;
    
    try {
      await restorePatient(patient.id);
      notifications.show({
        title: 'Sukces',
        message: 'Pacjent został przywrócony',
        color: 'green',
      });
      // Odśwież dane pacjenta
      await loadPatient(patient.id);
    } catch {
      notifications.show({
        title: 'Błąd',
        message: 'Nie udało się przywrócić pacjenta',
        color: 'red',
      });
    }
  };

  const handleEditSuccess = async () => {
    setEditModalOpen(false);
    if (patient?.id) {
      await loadPatient(patient.id);
    }
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'Brak danych';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('pl-PL');
  };

  const calculateAge = (birthDate: Date | string | undefined) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  if (!patient) {
    return (
      <Container size="lg">
        <LoadingOverlay visible={loading} />
        {error && (
          <Alert icon={<IconAlertCircle size="1rem" />} title="Błąd" color="red">
            {error}
          </Alert>
        )}
      </Container>
    );
  }

  return (
    <Container size="lg">
      <Stack gap="md">
        {/* Header */}
        <Paper p="md" withBorder>
          <Group justify="space-between" align="flex-start">
            <Stack gap="xs">
              <Group align="center">
                <Title order={2}>
                  {patient.firstName} {patient.lastName}
                </Title>
                <Badge
                  color={patient.status === 'active' ? 'green' : 'gray'}
                  variant="light"
                >
                  {patient.status === 'active' ? 'Aktywny' : 'Zarchiwizowany'}
                </Badge>
              </Group>
              
              {patient.tags && patient.tags.length > 0 && (
                <Group gap="xs">
                  {patient.tags.map((tag) => (
                    <Badge key={tag} variant="outline" size="sm">
                      {tag}
                    </Badge>
                  ))}
                </Group>
              )}
            </Stack>

            <Group>
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <ActionIcon variant="light">
                    <IconDots size="1rem" />
                  </ActionIcon>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Item
                    leftSection={<IconEdit size="1rem" />}
                    onClick={() => setEditModalOpen(true)}
                  >
                    Edytuj dane
                  </Menu.Item>
                  
                  {patient.phone && (
                    <Menu.Item
                      leftSection={<IconPhone size="1rem" />}
                      component="a"
                      href={`tel:${patient.phone}`}
                    >
                      Zadzwoń
                    </Menu.Item>
                  )}
                  
                  {patient.email && (
                    <Menu.Item
                      leftSection={<IconMail size="1rem" />}
                      component="a"
                      href={`mailto:${patient.email}`}
                    >
                      Wyślij email
                    </Menu.Item>
                  )}

                  <Menu.Divider />

                  {patient.status === 'active' ? (
                    <Menu.Item
                      leftSection={<IconArchive size="1rem" />}
                      color="red"
                      onClick={() => setArchiveModalOpen(true)}
                    >
                      Archiwizuj
                    </Menu.Item>
                  ) : (
                    <Menu.Item
                      leftSection={<IconRestore size="1rem" />}
                      color="green"
                      onClick={handleRestore}
                    >
                      Przywróć
                    </Menu.Item>
                  )}
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Group>
        </Paper>

        {/* Quick Info Cards */}
        <Grid>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card withBorder>
              <Stack gap="xs">
                <Text size="sm" c="dimmed">Kontakt</Text>
                {patient.phone && (
                  <Group gap="xs">
                    <IconPhone size="1rem" />
                    <Text size="sm">{patient.phone}</Text>
                  </Group>
                )}
                {patient.email && (
                  <Group gap="xs">
                    <IconMail size="1rem" />
                    <Text size="sm">{patient.email}</Text>
                  </Group>
                )}
              </Stack>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card withBorder>
              <Stack gap="xs">
                <Text size="sm" c="dimmed">Informacje osobiste</Text>
                <Text size="sm">
                  <strong>Wiek:</strong>{' '}
                  {calculateAge(patient.birthDate) 
                    ? `${calculateAge(patient.birthDate)} lat`
                    : 'Brak danych'
                  }
                </Text>
                <Text size="sm">
                  <strong>Data urodzenia:</strong> {formatDate(patient.birthDate)}
                </Text>
              </Stack>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card withBorder>
              <Stack gap="xs">
                <Text size="sm" c="dimmed">Kontakt awaryjny</Text>
                <Text size="sm">
                  <strong>Osoba:</strong> {patient.emergencyContact || 'Brak danych'}
                </Text>
                <Text size="sm">
                  <strong>Telefon:</strong> {patient.emergencyPhone || 'Brak danych'}
                </Text>
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Tabs */}
        <Tabs value={activeTab} onChange={(value) => value && setActiveTab(value)}>
          <Tabs.List>
            <Tabs.Tab value="overview" leftSection={<IconNotes size="1rem" />}>
              Przegląd
            </Tabs.Tab>
            <Tabs.Tab value="appointments" leftSection={<IconCalendar size="1rem" />}>
              Wizyty
            </Tabs.Tab>
            <Tabs.Tab value="notes" leftSection={<IconNotes size="1rem" />}>
              Notatki
            </Tabs.Tab>
            <Tabs.Tab value="goals" leftSection={<IconTarget size="1rem" />}>
              Cele terapii
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="overview" pt="md">
            <Paper p="md" withBorder>
              <Stack gap="md">
                <div>
                  <Text size="sm" fw={500} mb="xs">Adres</Text>
                  <Text size="sm">{patient.address || 'Brak danych'}</Text>
                </div>
                
                {patient.notes && (
                  <div>
                    <Text size="sm" fw={500} mb="xs">Notatki</Text>
                    <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
                      {patient.notes}
                    </Text>
                  </div>
                )}

                <Divider />

                <div>
                  <Text size="xs" c="dimmed">
                    Utworzono: {formatDate(patient.createdAt)}
                  </Text>
                  <Text size="xs" c="dimmed">
                    Ostatnia aktualizacja: {formatDate(patient.updatedAt)}
                  </Text>
                </div>
              </Stack>
            </Paper>
          </Tabs.Panel>

          <Tabs.Panel value="appointments" pt="md">
            <Paper p="md" withBorder>
              <Text>Lista wizyt będzie tutaj - do implementacji</Text>
            </Paper>
          </Tabs.Panel>

          <Tabs.Panel value="notes" pt="md">
            <Paper p="md" withBorder>
              <Text>System notatek SOAP będzie tutaj - do implementacji</Text>
            </Paper>
          </Tabs.Panel>

          <Tabs.Panel value="goals" pt="md">
            <Paper p="md" withBorder>
              <Text>Cele terapii będą tutaj - do implementacji</Text>
            </Paper>
          </Tabs.Panel>
        </Tabs>
      </Stack>

      {/* Edit Modal */}
      <Modal
        opened={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edytuj dane pacjenta"
        size="lg"
      >
        <PatientForm
          patient={patient}
          onSuccess={handleEditSuccess}
          onCancel={() => setEditModalOpen(false)}
        />
      </Modal>

      {/* Archive Confirmation Modal */}
      <Modal
        opened={archiveModalOpen}
        onClose={() => setArchiveModalOpen(false)}
        title="Potwierdź archiwizację"
        size="sm"
      >
        <Stack gap="md">
          <Text>
            Czy na pewno chcesz zarchiwizować pacjenta{' '}
            <strong>{patient.firstName} {patient.lastName}</strong>?
          </Text>
          <Text size="sm" c="dimmed">
            Pacjent zostanie ukryty z głównej listy, ale wszystkie dane
            będą zachowane i można będzie go przywrócić w każdej chwili.
          </Text>
          <Group justify="flex-end">
            <Button variant="light" onClick={() => setArchiveModalOpen(false)}>
              Anuluj
            </Button>
            <Button color="red" onClick={handleArchive}>
              Archiwizuj
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
} 