import { 
  Title, 
  Grid, 
  Card, 
  Text, 
  Group, 
  Badge, 
  Button,
  Stack,
  Skeleton,
  Alert
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCalendarEvent, IconUsers, IconClock, IconAlertCircle, IconDatabase, IconTrash } from '@tabler/icons-react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { FloatingActionButton, type FABAction } from '../components/FloatingActionButton';
import { useAppointmentStore } from '../stores/useAppointmentStore';
import { usePatientStore } from '../stores/usePatientStore';
import { insertSampleData, clearAllData } from '../utils/sampleData';

export function Dashboard() {
  const { patients, fetchPatients, loading: patientsLoading } = usePatientStore();
  const { 
    appointments, 
    fetchAppointments, 
    getTodaysAppointments, 
    getUpcomingAppointments,
    loading: appointmentsLoading 
  } = useAppointmentStore();
  
  const [loadingSampleData, setLoadingSampleData] = useState(false);
  const [clearingData, setClearingData] = useState(false);

  useEffect(() => {
    fetchPatients();
    fetchAppointments();
  }, [fetchPatients, fetchAppointments]);

  const todaysAppointments = getTodaysAppointments();
  const upcomingAppointments = getUpcomingAppointments();
  const totalAppointments = appointments.length;

  const handleInsertSampleData = async () => {
    setLoadingSampleData(true);
    try {
      const inserted = await insertSampleData();
      if (inserted) {
        notifications.show({
          title: 'Sukces!',
          message: 'Przykładowe dane zostały dodane',
          color: 'green'
        });
        // Odśwież dane
        await fetchPatients();
        await fetchAppointments();
      } else {
        notifications.show({
          title: 'Info',
          message: 'Dane już istnieją w bazie',
          color: 'blue'
        });
      }
    } catch {
      notifications.show({
        title: 'Błąd',
        message: 'Nie udało się dodać przykładowych danych',
        color: 'red'
      });
    } finally {
      setLoadingSampleData(false);
    }
  };

  const handleClearData = async () => {
    setClearingData(true);
    try {
      await clearAllData();
      notifications.show({
        title: 'Usunięto',
        message: 'Wszystkie dane zostały usunięte',
        color: 'orange'
      });
      // Odśwież dane
      await fetchPatients();
      await fetchAppointments();
    } catch {
      notifications.show({
        title: 'Błąd',
        message: 'Nie udało się usunąć danych',
        color: 'red'
      });
    } finally {
      setClearingData(false);
    }
  };

  // FAB Actions dla mobile
  const fabActions: FABAction[] = [];
  
  if (patients.length === 0) {
    fabActions.push({
      id: 'add-sample-data',
      icon: <IconDatabase size="1.2rem" />,
      label: 'Dodaj przykładowe dane',
      color: 'blue',
      onClick: handleInsertSampleData,
    });
  }
  
  if (patients.length > 0) {
    fabActions.push({
      id: 'clear-data',
      icon: <IconTrash size="1.2rem" />,
      label: 'Wyczyść dane',
      color: 'red',
      onClick: handleClearData,
    });
  }

  if (patientsLoading || appointmentsLoading) {
    return (
      <Stack>
        <Title order={1}>Dashboard</Title>
        <Grid>
          {[1, 2, 3, 4].map((i) => (
            <Grid.Col key={i} span={{ base: 12, sm: 6, md: 6, lg: 3 }}>
              <Skeleton height={120} />
            </Grid.Col>
          ))}
        </Grid>
      </Stack>
    );
  }

  return (
    <Stack>
      {/* Mobile-friendly header */}
      <Stack gap="sm">
        <Title order={1}>Dashboard</Title>
        <Group justify="flex-end" wrap="wrap" gap="xs" visibleFrom="md">
          {patients.length === 0 && (
            <Button 
              variant="filled" 
              color="blue"
              leftSection={<IconDatabase size="0.9rem" />}
              onClick={handleInsertSampleData}
              loading={loadingSampleData}
              size="sm"
            >
              Dodaj przykładowe dane
            </Button>
          )}
          {patients.length > 0 && (
            <Button 
              variant="outline" 
              color="red"
              leftSection={<IconTrash size="0.9rem" />}
              onClick={handleClearData}
              loading={clearingData}
              size="sm"
            >
              Wyczyść dane
            </Button>
          )}
        </Group>
      </Stack>
      
      {/* Stats Grid - Improved responsive */}
      <Grid>
        <Grid.Col span={{ base: 12, sm: 6, md: 6, lg: 3 }}>
          <Card h={120}>
            <Group justify="space-between" align="flex-start">
              <div>
                <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                  Pacjenci
                </Text>
                <Text fw={700} size="xl">
                  {patients.length}
                </Text>
              </div>
              <IconUsers size="2rem" />
            </Group>
          </Card>
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, sm: 6, md: 6, lg: 3 }}>
          <Card h={120}>
            <Group justify="space-between" align="flex-start">
              <div>
                <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                  Wizyty dzisiaj
                </Text>
                <Text fw={700} size="xl">
                  {todaysAppointments.length}
                </Text>
              </div>
              <IconCalendarEvent size="2rem" />
            </Group>
          </Card>
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, sm: 6, md: 6, lg: 3 }}>
          <Card h={120}>
            <Group justify="space-between" align="flex-start">
              <div>
                <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                  Wszystkie wizyty
                </Text>
                <Text fw={700} size="xl">
                  {totalAppointments}
                </Text>
              </div>
              <IconClock size="2rem" />
            </Group>
          </Card>
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, sm: 6, md: 6, lg: 3 }}>
          <Card h={120}>
            <Group justify="space-between" align="flex-start">
              <div>
                <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                  Nadchodzące
                </Text>
                <Text fw={700} size="xl">
                  {upcomingAppointments.length}
                </Text>
              </div>
              <IconAlertCircle size="2rem" />
            </Group>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Today's appointments card */}
      <Card>
        <Group justify="space-between" mb="md" wrap="wrap">
          <Title order={3}>Dzisiejsze wizyty</Title>
          <Button 
            size="sm" 
            variant="light"
            visibleFrom="sm"
          >
            Zobacz wszystkie
          </Button>
        </Group>
        
        {todaysAppointments.length === 0 ? (
          <Alert icon={<IconCalendarEvent size="1rem" />} title="Brak wizyt">
            Nie masz zaplanowanych wizyt na dziś.
          </Alert>
        ) : (
          <Stack gap="xs">
            {todaysAppointments.map((appointment) => (
              <Card key={appointment.id} withBorder>
                <Group justify="space-between" wrap="wrap" gap="xs">
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <Text fw={500} truncate>
                      {appointment.patient?.firstName} {appointment.patient?.lastName}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {format(new Date(appointment.date), 'HH:mm', { locale: pl })} - {appointment.duration} min
                    </Text>
                  </div>
                  <Badge color="blue" size="sm">
                    {appointment.status}
                  </Badge>
                </Group>
              </Card>
            ))}
          </Stack>
        )}
        
        {/* Mobile-only "See all" button */}
        {todaysAppointments.length > 0 && (
          <Button 
            variant="light" 
            fullWidth 
            mt="md"
            hiddenFrom="sm"
          >
            Zobacz wszystkie wizyty
          </Button>
        )}
      </Card>

      {/* Floating Action Button for mobile */}
      <FloatingActionButton actions={fabActions} />
    </Stack>
  );
} 