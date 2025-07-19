import {
  Container,
  Stack,
  Title,
  Text,
  Group,
  Card,
  SimpleGrid,
  ActionIcon,
  Tooltip,
} from '@mantine/core';
import { IconPlus, IconCalendar, IconDownload, IconNote } from '@tabler/icons-react';
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BulkSMSReminders } from '../components/BulkSMSReminders';
import { DashboardStats } from '../components/dashboard/DashboardStats';
import { ExportModal } from '../components/ExportModal';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { Button } from '../components/ui/Button';
import { useExport } from '../hooks/useExport';
import { useTheme } from '../hooks/useTheme';
import { useAppointmentStore } from '../stores/useAppointmentStore';
import { usePatientStore } from '../stores/usePatientStore';
import { AppointmentStatus } from '../types/Appointment';

function Dashboard() {
  const navigate = useNavigate();
  const { patients, fetchPatients } = usePatientStore();
  const {
    appointments,
    fetchAppointments,
    getTodaysAppointments,
    getUpcomingAppointments,
  } = useAppointmentStore();
  const { currentPalette, mantineTheme } = useTheme();
  const { exportOpened, handleExport, handleExportData, closeExport } = useExport(
    patients,
    appointments
  );

  // Fetch data on mount
  useEffect(() => {
    fetchPatients();
    fetchAppointments();
  }, [fetchPatients, fetchAppointments]);

  // Calculate real stats
  const stats = useMemo(() => {
    const activePatients = patients.filter(p => p.status === 'active').length;
    const todaysAppointments = getTodaysAppointments().length;

    // Calculate this week's appointments
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const thisWeekAppointments = appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      return aptDate >= startOfWeek && aptDate <= endOfWeek;
    });

    // Calculate average session duration from completed appointments
    const completedAppointments = appointments.filter(
      apt => apt.status === AppointmentStatus.COMPLETED
    );
    const avgDuration =
      completedAppointments.length > 0
        ? Math.round(
            completedAppointments.reduce((sum, apt) => sum + apt.duration, 0) /
              completedAppointments.length
          )
        : 0;

    // Calculate completion rate (completed vs total scheduled)
    const totalScheduled = appointments.filter(
      apt =>
        apt.status === AppointmentStatus.SCHEDULED ||
        apt.status === AppointmentStatus.COMPLETED
    ).length;
    const completionRate =
      totalScheduled > 0
        ? Math.round((completedAppointments.length / totalScheduled) * 100)
        : 0;

    const nextAppointment = getUpcomingAppointments()[0];

    return {
      totalPatients: activePatients,
      sessionsThisWeek: thisWeekAppointments.length,
      avgSessionDuration: avgDuration,
      completionRate,
      totalNotes: 0, // TODO: Implement notes
      todaysAppointments,
      nextAppointment: nextAppointment
        ? {
            time: new Date(nextAppointment.date).toLocaleTimeString('pl-PL', {
              hour: '2-digit',
              minute: '2-digit',
            }),
            patient: `${nextAppointment.patient?.firstName} ${nextAppointment.patient?.lastName}`,
          }
        : null,
    };
  }, [patients, appointments, getTodaysAppointments, getUpcomingAppointments]);

  return (
    <Container
      size={mantineTheme.other.layout.containerSize}
      px={{ base: 'md', sm: 'xl' }}
    >
      <Stack gap={mantineTheme.spacing.xl} py={mantineTheme.spacing.xl}>
        {/* Header */}
        <Group justify='space-between' align='flex-start'>
          <Stack gap={mantineTheme.spacing.xs}>
            <Title
              order={1}
              style={{
                fontSize: '2rem',
                fontWeight: 700,
                color: currentPalette.text,
                letterSpacing: '-0.02em',
                lineHeight: '2.5rem',
              }}
            >
              Dashboard
            </Title>
            <Text
              size={mantineTheme.fontSizes.lg}
              style={{
                lineHeight: '1.6',
                color: `${currentPalette.text}B3`,
              }}
            >
              Witaj ponownie! Oto przegląd Twojej praktyki terapeutycznej.
            </Text>
          </Stack>

          <Group gap='sm'>
            <Tooltip label='Eksportuj dane'>
              <ActionIcon
                size='lg'
                variant='light'
                color='blue'
                onClick={handleExport}
                style={{
                  backgroundColor: currentPalette.surface,
                  border: `1px solid ${currentPalette.primary}60`,
                }}
              >
                <IconDownload size='1.2rem' />
              </ActionIcon>
            </Tooltip>
            <BulkSMSReminders
              size='sm'
              onRemindersSent={() => {
                // Refresh appointments after sending reminders
                fetchAppointments();
              }}
            />
            <div
              onClick={() => navigate('/calendar')}
              style={{ cursor: 'pointer' }}
            >
              <Button variant='primary'>
                <IconPlus
                  size={mantineTheme.other.iconSizes.md}
                  style={{ marginRight: '8px' }}
                />
                Nowa sesja
              </Button>
            </div>
          </Group>
        </Group>

        {/* Stats Cards */}
        <DashboardStats stats={stats} />

        {/* Quick Actions - tylko najważniejsze */}
        <Stack gap={mantineTheme.spacing.lg}>
          <Title
            order={3}
            style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: currentPalette.text,
              letterSpacing: '-0.01em',
            }}
          >
            Szybkie akcje
          </Title>

          <SimpleGrid
            cols={{ base: 1, sm: 2, lg: 3 }}
            spacing={mantineTheme.spacing.xl}
          >
            <Card
              shadow='sm'
              padding='lg'
              radius='md'
              withBorder
              style={{
                backgroundColor: currentPalette.surface,
                border: `1px solid ${currentPalette.primary}`,
                cursor: 'pointer',
                transition: 'all 200ms ease-out',
                color: currentPalette.text,
              }}
              onClick={() => navigate('/calendar')}
            >
              <Stack gap={mantineTheme.spacing.md}>
                <Title order={4} style={{ color: currentPalette.text }}>
                  Kalendarz sesji
                </Title>
                <Text
                  size={mantineTheme.fontSizes.sm}
                  style={{ color: `${currentPalette.text}B3` }}
                >
                  Zarządzaj terminami i planuj spotkania
                </Text>
                <Button variant='secondary' style={{ alignSelf: 'flex-start' }}>
                  Otwórz kalendarz
                </Button>
              </Stack>
            </Card>

            <Card
              shadow='sm'
              padding='lg'
              radius='md'
              withBorder
              style={{
                backgroundColor: currentPalette.surface,
                border: `1px solid ${currentPalette.primary}`,
                cursor: 'pointer',
                transition: 'all 200ms ease-out',
                color: currentPalette.text,
              }}
              onClick={() => navigate('/patients')}
            >
              <Stack gap={mantineTheme.spacing.md}>
                <Title order={4} style={{ color: currentPalette.text }}>
                  Lista pacjentów
                </Title>
                <Text
                  size={mantineTheme.fontSizes.sm}
                  style={{ color: `${currentPalette.text}B3` }}
                >
                  Przeglądaj profile i historie terapii
                </Text>
                <Button variant='secondary' style={{ alignSelf: 'flex-start' }}>
                  Zobacz pacjentów
                </Button>
              </Stack>
            </Card>

            <Card
              shadow='sm'
              padding='lg'
              radius='md'
              withBorder
              style={{
                backgroundColor: currentPalette.surface,
                border: `1px solid ${currentPalette.primary}`,
                cursor: 'pointer',
                transition: 'all 200ms ease-out',
                color: currentPalette.text,
              }}
              onClick={() => navigate('/settings')}
            >
              <Stack gap={mantineTheme.spacing.md}>
                <Title order={4} style={{ color: currentPalette.text }}>
                  Ustawienia
                </Title>
                <Text
                  size={mantineTheme.fontSizes.sm}
                  style={{ color: `${currentPalette.text}B3` }}
                >
                  Konfiguruj aplikację i eksportuj dane
                </Text>
                <Button variant='secondary' style={{ alignSelf: 'flex-start' }}>
                  Otwórz ustawienia
                </Button>
              </Stack>
            </Card>
          </SimpleGrid>
        </Stack>

        {/* Today's Appointments */}
        {stats.todaysAppointments > 0 && (
          <Stack gap={mantineTheme.spacing.lg}>
            <Title
              order={3}
              style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: currentPalette.text,
                letterSpacing: '-0.01em',
              }}
            >
              Dzisiejsze wizyty
            </Title>

            <Card
              shadow='sm'
              padding='lg'
              radius='md'
              withBorder
              style={{
                backgroundColor: currentPalette.surface,
                border: `1px solid ${currentPalette.primary}`,
                color: currentPalette.text,
              }}
            >
              <Stack gap={mantineTheme.spacing.md}>
                <Text
                  size={mantineTheme.fontSizes.lg}
                  fw={600}
                  style={{ color: currentPalette.text }}
                >
                  {stats.todaysAppointments}{' '}
                  {stats.todaysAppointments === 1 ? 'wizyta' : 'wizyt'} na dziś
                </Text>
                <div
                  onClick={() => navigate('/calendar')}
                  style={{ cursor: 'pointer' }}
                >
                  <Button
                    variant='secondary'
                    style={{ alignSelf: 'flex-start' }}
                  >
                    <IconCalendar
                      size={mantineTheme.other.iconSizes.sm}
                      style={{ marginRight: '8px' }}
                    />
                    Zobacz szczegóły
                  </Button>
                </div>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* Floating Action Button - tylko na mobile */}
        <FloatingActionButton
          actions={[
            {
              id: 'new-session',
              icon: <IconPlus size='1.5rem' />,
              label: 'Dodaj sesję',
              onClick: () => navigate('/calendar'),
            },
            {
              id: 'export-excel',
              icon: <IconDownload size='1.5rem' />,
              label: 'Eksport',
              onClick: handleExport,
            },
            {
              id: 'add-note',
              icon: <IconNote size='1.5rem' />,
              label: 'Dodaj notatkę',
              onClick: () => {
                // TODO: Implementacja dodawania notatek
                console.log('Add note clicked');
              },
              disabled: true, // Feature nieaktywny
            },
          ]}
        />

        {/* Export Modal */}
        <ExportModal
          opened={exportOpened}
          onClose={closeExport}
          filteredPatients={patients}
          onExport={handleExportData}
        />
      </Stack>
    </Container>
  );
}

export default Dashboard;
