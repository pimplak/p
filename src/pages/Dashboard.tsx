import { useEffect } from 'react';
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
import { IconCalendarEvent, IconUsers, IconClock, IconAlertCircle } from '@tabler/icons-react';
import { usePatientStore } from '../stores/usePatientStore';
import { useAppointmentStore } from '../stores/useAppointmentStore';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

export function Dashboard() {
  const { patients, fetchPatients, loading: patientsLoading } = usePatientStore();
  const { 
    appointments, 
    fetchAppointments, 
    getTodaysAppointments, 
    getUpcomingAppointments,
    loading: appointmentsLoading 
  } = useAppointmentStore();

  useEffect(() => {
    fetchPatients();
    fetchAppointments();
  }, [fetchPatients, fetchAppointments]);

  const todaysAppointments = getTodaysAppointments();
  const upcomingAppointments = getUpcomingAppointments();
  const totalAppointments = appointments.length;

  if (patientsLoading || appointmentsLoading) {
    return (
      <Stack>
        <Title order={1}>Dashboard</Title>
        <Grid>
          {[1, 2, 3, 4].map((i) => (
            <Grid.Col key={i} span={{ base: 12, md: 6, lg: 3 }}>
              <Skeleton height={120} />
            </Grid.Col>
          ))}
        </Grid>
      </Stack>
    );
  }

  return (
    <Stack>
      <Title order={1}>Dashboard</Title>
      
      <Grid>
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
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
        
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
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
        
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
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
        
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
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

      <Card>
        <Group justify="space-between" mb="md">
          <Title order={3}>Dzisiejsze wizyty</Title>
          <Button size="sm" variant="light">
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
                <Group justify="space-between">
                  <div>
                    <Text fw={500}>
                      {appointment.patient?.firstName} {appointment.patient?.lastName}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {format(new Date(appointment.date), 'HH:mm', { locale: pl })} - {appointment.duration} min
                    </Text>
                  </div>
                  <Badge color="blue">
                    {appointment.status}
                  </Badge>
                </Group>
              </Card>
            ))}
          </Stack>
        )}
      </Card>
    </Stack>
  );
} 