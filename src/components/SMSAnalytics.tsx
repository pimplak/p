import {
  Card,
  Group,
  Text,
  Stack,
  Badge,
  Progress,
  SimpleGrid,
  Title,
  Divider,
  Table,
  ScrollArea,
  ActionIcon,
  Tooltip,
  Alert,
} from '@mantine/core';
import {
  IconMessage,
  IconCheck,
  IconClock,
  IconAlertCircle,
  IconTrendingUp,
  IconPhone,
  IconCalendar,
  IconInfoCircle,
} from '@tabler/icons-react';
import { format, subDays, subWeeks, subMonths, isAfter, isBefore } from 'date-fns';
import { pl } from 'date-fns/locale';
import { useMemo } from 'react';
import { useAppointmentStore } from '../stores/useAppointmentStore';
import { usePatientStore } from '../stores/usePatientStore';
import type { AppointmentWithPatient } from '../types/Appointment';
import { needsReminder, validatePhoneNumber } from '../utils/sms';

interface SMSAnalyticsProps {
  period?: 'week' | 'month' | 'quarter' | 'all';
}

interface SMSStats {
  totalAppointments: number;
  remindersNeeded: number;
  remindersSent: number;
  remindersRate: number;
  patientsWithPhone: number;
  patientsWithoutPhone: number;
  phoneNumberRate: number;
  upcomingReminders: number;
  overdueReminders: number;
}

interface PatientSMSStats {
  patientId: number;
  patientName: string;
  phone: string | null;
  totalAppointments: number;
  remindersSent: number;
  remindersRate: number;
  lastReminderSent?: string;
  hasValidPhone: boolean;
}

export function SMSAnalytics({ period = 'month' }: SMSAnalyticsProps) {
  const { appointments } = useAppointmentStore();
  const { patients } = usePatientStore();

  // Filter appointments by period
  const filteredAppointments = useMemo(() => {
    if (period === 'all') return appointments;

    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'week':
        startDate = subDays(now, 7);
        break;
      case 'month':
        startDate = subMonths(now, 1);
        break;
      case 'quarter':
        startDate = subMonths(now, 3);
        break;
      default:
        startDate = subMonths(now, 1);
    }

    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return isAfter(appointmentDate, startDate);
    });
  }, [appointments, period]);

  // Calculate SMS statistics
  const smsStats = useMemo((): SMSStats => {
    const now = new Date();
    const futureAppointments = filteredAppointments.filter(apt => 
      isAfter(new Date(apt.date), now)
    );

    const totalAppointments = filteredAppointments.length;
    const remindersSent = filteredAppointments.filter(apt => apt.reminderSent).length;
    const remindersNeeded = futureAppointments.filter(apt => needsReminder(apt)).length;
    const upcomingReminders = futureAppointments.filter(apt => 
      needsReminder(apt) && !apt.reminderSent
    ).length;
    const overdueReminders = futureAppointments.filter(apt => {
      const appointmentDate = new Date(apt.date);
      const hoursUntil = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);
      return hoursUntil < 24 && hoursUntil > 0 && !apt.reminderSent;
    }).length;

    const uniquePatients = new Set(filteredAppointments.map(apt => apt.patientId));
    const patientsWithPhone = Array.from(uniquePatients).filter(patientId => {
      const patient = patients.find(p => p.id === patientId);
      return patient?.phone && validatePhoneNumber(patient.phone);
    }).length;

    const patientsWithoutPhone = uniquePatients.size - patientsWithPhone;

    return {
      totalAppointments,
      remindersNeeded: remindersNeeded + remindersSent,
      remindersSent,
      remindersRate: totalAppointments > 0 ? (remindersSent / totalAppointments) * 100 : 0,
      patientsWithPhone,
      patientsWithoutPhone,
      phoneNumberRate: uniquePatients.size > 0 ? (patientsWithPhone / uniquePatients.size) * 100 : 0,
      upcomingReminders,
      overdueReminders,
    };
  }, [filteredAppointments, patients]);

  // Calculate per-patient SMS statistics
  const patientStats = useMemo((): PatientSMSStats[] => {
    const patientMap = new Map<number, PatientSMSStats>();

    filteredAppointments.forEach(appointment => {
      const patient = patients.find(p => p.id === appointment.patientId);
      if (!patient) return;

      const existing = patientMap.get(appointment.patientId);
      const hasValidPhone = patient.phone ? validatePhoneNumber(patient.phone) : false;

      if (existing) {
        existing.totalAppointments++;
        if (appointment.reminderSent) {
          existing.remindersSent++;
          if (appointment.reminderSentAt) {
            existing.lastReminderSent = appointment.reminderSentAt as string;
          }
        }
      } else {
        patientMap.set(appointment.patientId, {
          patientId: appointment.patientId,
          patientName: `${patient.firstName} ${patient.lastName}`,
          phone: patient.phone || null,
          totalAppointments: 1,
          remindersSent: appointment.reminderSent ? 1 : 0,
          remindersRate: 0,
          lastReminderSent: appointment.reminderSent ? appointment.reminderSentAt as string : undefined,
          hasValidPhone,
        });
      }
    });

    // Calculate rates
    const stats = Array.from(patientMap.values()).map(stat => ({
      ...stat,
      remindersRate: stat.totalAppointments > 0 ? (stat.remindersSent / stat.totalAppointments) * 100 : 0,
    }));

    return stats.sort((a, b) => b.totalAppointments - a.totalAppointments);
  }, [filteredAppointments, patients]);

  const getPeriodLabel = () => {
    switch (period) {
      case 'week':
        return 'Ostatni tydzień';
      case 'month':
        return 'Ostatni miesiąc';
      case 'quarter':
        return 'Ostatnie 3 miesiące';
      case 'all':
        return 'Cały okres';
      default:
        return 'Ostatni miesiąc';
    }
  };

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="center">
        <Title order={3}>Analiza SMS - {getPeriodLabel()}</Title>
        <Badge variant="light" color="blue">
          {smsStats.totalAppointments} wizyt
        </Badge>
      </Group>

      {/* Overview Cards */}
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }}>
        <Card withBorder p="md">
          <Group justify="space-between">
            <div>
              <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                Przypomnienia wysłane
              </Text>
              <Text fw={700} size="xl">
                {smsStats.remindersSent}
              </Text>
            </div>
            <ActionIcon size="lg" color="green" variant="light">
              <IconCheck size="1.2rem" />
            </ActionIcon>
          </Group>
          <Text size="xs" c="dimmed" mt="sm">
            z {smsStats.remindersNeeded} potrzebnych
          </Text>
          <Progress
            value={smsStats.remindersNeeded > 0 ? (smsStats.remindersSent / smsStats.remindersNeeded) * 100 : 0}
            size="sm"
            mt="sm"
            color="green"
          />
        </Card>

        <Card withBorder p="md">
          <Group justify="space-between">
            <div>
              <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                Skuteczność
              </Text>
              <Text fw={700} size="xl">
                {smsStats.remindersRate.toFixed(1)}%
              </Text>
            </div>
            <ActionIcon size="lg" color="blue" variant="light">
              <IconTrendingUp size="1.2rem" />
            </ActionIcon>
          </Group>
          <Text size="xs" c="dimmed" mt="sm">
            przypomnieć do wizyt
          </Text>
          <Progress
            value={smsStats.remindersRate}
            size="sm"
            mt="sm"
            color="blue"
          />
        </Card>

        <Card withBorder p="md">
          <Group justify="space-between">
            <div>
              <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                Pacjenci z telefonem
              </Text>
              <Text fw={700} size="xl">
                {smsStats.patientsWithPhone}
              </Text>
            </div>
            <ActionIcon size="lg" color="teal" variant="light">
              <IconPhone size="1.2rem" />
            </ActionIcon>
          </Group>
          <Text size="xs" c="dimmed" mt="sm">
            z {smsStats.patientsWithPhone + smsStats.patientsWithoutPhone} pacjentów
          </Text>
          <Progress
            value={smsStats.phoneNumberRate}
            size="sm"
            mt="sm"
            color="teal"
          />
        </Card>

        <Card withBorder p="md">
          <Group justify="space-between">
            <div>
              <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                Oczekujące
              </Text>
              <Text fw={700} size="xl">
                {smsStats.upcomingReminders}
              </Text>
            </div>
            <ActionIcon size="lg" color="orange" variant="light">
              <IconClock size="1.2rem" />
            </ActionIcon>
          </Group>
          <Text size="xs" c="dimmed" mt="sm">
            {smsStats.overdueReminders} pilnych
          </Text>
          <Progress
            value={smsStats.upcomingReminders > 0 ? (smsStats.overdueReminders / smsStats.upcomingReminders) * 100 : 0}
            size="sm"
            mt="sm"
            color="orange"
          />
        </Card>
      </SimpleGrid>

      {/* Alerts */}
      {smsStats.patientsWithoutPhone > 0 && (
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          title="Brak numerów telefonu"
          color="yellow"
        >
          {smsStats.patientsWithoutPhone} pacjentów nie ma podanego numeru telefonu lub numer jest nieprawidłowy.
          To ogranicza możliwość wysyłania przypomnień SMS.
        </Alert>
      )}

      {smsStats.overdueReminders > 0 && (
        <Alert
          icon={<IconClock size="1rem" />}
          title="Pilne przypomnienia"
          color="orange"
        >
          {smsStats.overdueReminders} przypomnieć wymaga natychmiastowego wysłania (wizyty za mniej niż 24h).
        </Alert>
      )}

      {/* Patient Statistics Table */}
      <Card withBorder>
        <Card.Section withBorder inheritPadding py="md">
          <Group justify="space-between">
            <Text fw={500}>Statystyki pacjentów</Text>
            <Badge variant="light">
              {patientStats.length} pacjentów
            </Badge>
          </Group>
        </Card.Section>

        <ScrollArea>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Pacjent</Table.Th>
                <Table.Th>Telefon</Table.Th>
                <Table.Th>Wizyty</Table.Th>
                <Table.Th>Przypomnienia</Table.Th>
                <Table.Th>Skuteczność</Table.Th>
                <Table.Th>Ostatnie</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {patientStats.map((stat) => (
                <Table.Tr key={stat.patientId}>
                  <Table.Td>
                    <Text size="sm" fw={500}>
                      {stat.patientName}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <Text size="sm" c={stat.hasValidPhone ? 'dark' : 'red'}>
                        {stat.phone || 'Brak'}
                      </Text>
                      {!stat.hasValidPhone && stat.phone && (
                        <Tooltip label="Nieprawidłowy numer">
                          <ActionIcon size="xs" color="red" variant="subtle">
                            <IconAlertCircle size="0.8rem" />
                          </ActionIcon>
                        </Tooltip>
                      )}
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{stat.totalAppointments}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{stat.remindersSent}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <Text size="sm">{stat.remindersRate.toFixed(1)}%</Text>
                      <Progress
                        value={stat.remindersRate}
                        size="xs"
                        w={50}
                        color={stat.remindersRate > 75 ? 'green' : stat.remindersRate > 50 ? 'yellow' : 'red'}
                      />
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">
                      {stat.lastReminderSent 
                        ? format(new Date(stat.lastReminderSent), 'dd.MM.yyyy', { locale: pl })
                        : 'Nigdy'
                      }
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </ScrollArea>

        {patientStats.length === 0 && (
          <Text ta="center" c="dimmed" py="xl">
            Brak danych do wyświetlenia
          </Text>
        )}
      </Card>

      {/* Insights */}
      <Card withBorder>
        <Card.Section withBorder inheritPadding py="md">
          <Group>
            <IconInfoCircle size="1.2rem" />
            <Text fw={500}>Spostrzeżenia</Text>
          </Group>
        </Card.Section>

        <Stack gap="sm" p="md">
          {smsStats.remindersRate < 50 && (
            <Alert color="red" variant="light">
              <Text size="sm">
                Niska skuteczność przypomnień ({smsStats.remindersRate.toFixed(1)}%). 
                Rozważ zwiększenie częstotliwości wysyłania przypomnień.
              </Text>
            </Alert>
          )}

          {smsStats.phoneNumberRate < 80 && (
            <Alert color="yellow" variant="light">
              <Text size="sm">
                Tylko {smsStats.phoneNumberRate.toFixed(1)}% pacjentów ma prawidłowy numer telefonu. 
                Zaktualizuj dane kontaktowe pacjentów.
              </Text>
            </Alert>
          )}

          {smsStats.remindersRate > 80 && smsStats.phoneNumberRate > 90 && (
            <Alert color="green" variant="light">
              <Text size="sm">
                Świetna skuteczność przypomnień! Większość pacjentów otrzymuje przypomnienia SMS.
              </Text>
            </Alert>
          )}

          <Text size="sm" c="dimmed">
            💡 Przypomnienia SMS wysyłane są 24-48 godzin przed wizytą dla optymalnej skuteczności.
          </Text>
        </Stack>
      </Card>
    </Stack>
  );
} 