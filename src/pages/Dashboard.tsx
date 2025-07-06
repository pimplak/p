import { 
  Container, 
  Stack, 
  Title, 
  Text, 
  Group,
  Card,
  SimpleGrid
} from '@mantine/core';
import { IconPlus, IconCalendar } from '@tabler/icons-react';
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BulkSMSReminders } from '../components/BulkSMSReminders';
import { DashboardStats } from '../components/dashboard/DashboardStats';
import { Button } from '../components/ui/Button';
import { GlassFAB } from '../components/ui/GlassFAB';
import { useAppointmentStore } from '../stores/useAppointmentStore';
import { usePatientStore } from '../stores/usePatientStore';
import { PRESETS, DESIGN_SYSTEM, getIconSize } from '../theme/designSystem';
import { AppointmentStatus } from '../types/Appointment';

function Dashboard() {
  const navigate = useNavigate();
  const { patients, fetchPatients } = usePatientStore();
  const { appointments, fetchAppointments, getTodaysAppointments, getUpcomingAppointments } = useAppointmentStore();

  // Fetch data on mount
  useEffect(() => {
    fetchPatients();
    fetchAppointments();
  }, [fetchPatients, fetchAppointments]);

  // Calculate real stats
  const stats = useMemo(() => {
    const activePatients = patients.filter(p => p.status === 'active').length;
    const todaysAppointments = getTodaysAppointments();
    const upcomingAppointments = getUpcomingAppointments();
    
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
    const completedAppointments = appointments.filter(apt => 
      apt.status === AppointmentStatus.COMPLETED
    );
    const avgDuration = completedAppointments.length > 0 
      ? Math.round(completedAppointments.reduce((sum, apt) => sum + apt.duration, 0) / completedAppointments.length)
      : 0;

    // Calculate completion rate (completed vs total scheduled)
    const totalScheduled = appointments.filter(apt => 
      apt.status === AppointmentStatus.SCHEDULED || apt.status === AppointmentStatus.COMPLETED
    ).length;
    const completionRate = totalScheduled > 0 
      ? Math.round((completedAppointments.length / totalScheduled) * 100)
      : 0;

    return {
      totalPatients: activePatients,
      sessionsThisWeek: thisWeekAppointments.length,
      avgSessionDuration: avgDuration,
      completionRate: completionRate,
      totalNotes: 0, // TODO: Implement notes counting when notes feature is added
      todaysAppointments: todaysAppointments.length,
      nextAppointment: upcomingAppointments[0] ? {
        patient: upcomingAppointments[0].patient ? `${upcomingAppointments[0].patient.firstName} ${upcomingAppointments[0].patient.lastName}` : 'Nieznany pacjent',
        time: new Date(upcomingAppointments[0].date).toLocaleString('pl-PL', { 
          month: 'short', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      } : null
    };
  }, [patients, appointments, getTodaysAppointments, getUpcomingAppointments]);

  return (
    <Container size={DESIGN_SYSTEM.layout.containerSize} px={{ base: 'md', sm: 'xl' }}>
      <Stack gap={DESIGN_SYSTEM.spacing.xl} py={DESIGN_SYSTEM.spacing.xl}>
        {/* Header */}
        <Group justify="space-between" align="flex-start">
          <Stack gap={DESIGN_SYSTEM.spacing.xs}>
            <Title 
              order={1}
              style={{
                fontSize: '2rem',
                fontWeight: 700,
                color: 'var(--color-text)',
                letterSpacing: '-0.02em',
                lineHeight: '2.5rem'
              }}
            >
              Dashboard
            </Title>
            <Text 
              size={DESIGN_SYSTEM.text.lg}
              style={{ lineHeight: '1.6', color: 'var(--color-text)', opacity: 0.7 }}
            >
              Witaj ponownie! Oto przegląd Twojej praktyki terapeutycznej.
            </Text>
          </Stack>
          
          <Group gap="sm">
            <BulkSMSReminders 
              size="sm" 
              onRemindersSent={(count) => {
                // Refresh appointments after sending reminders
                fetchAppointments();
              }}
            />
            <div onClick={() => navigate('/calendar')} style={{ cursor: 'pointer' }}>
              <Button 
                variant="primary"
              >
                <IconPlus size={getIconSize('md')} style={{ marginRight: '8px' }} />
                Nowa sesja
              </Button>
            </div>
          </Group>
        </Group>

        {/* Stats Cards */}
        <DashboardStats 
          stats={stats} 
        />

        {/* Quick Actions - tylko najważniejsze */}
        <Stack gap={DESIGN_SYSTEM.spacing.lg}>
          <Title 
            order={3}
            style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: 'var(--color-text)',
              letterSpacing: '-0.01em'
            }}
          >
            Szybkie akcje
          </Title>
          
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing={DESIGN_SYSTEM.spacing.xl}>
            <Card
              {...PRESETS.card}
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-primary)',
                cursor: 'pointer',
                transition: 'all 200ms ease-out',
                color: 'var(--color-text)'
              }}
              onClick={() => navigate('/calendar')}
            >
              <Stack gap={DESIGN_SYSTEM.spacing.md}>
                <Title order={4} style={{ color: 'var(--color-text)' }}>
                  Kalendarz sesji
                </Title>
                <Text size={DESIGN_SYSTEM.text.sm} style={{ color: 'var(--color-text)', opacity: 0.7 }}>
                  Zarządzaj terminami i planuj spotkania
                </Text>
                <Button variant="secondary" style={{ alignSelf: 'flex-start' }}>
                  Otwórz kalendarz
                </Button>
              </Stack>
            </Card>

            <Card
              {...PRESETS.card}
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-primary)',
                cursor: 'pointer',
                transition: 'all 200ms ease-out',
                color: 'var(--color-text)'
              }}
              onClick={() => navigate('/patients')}
            >
              <Stack gap={DESIGN_SYSTEM.spacing.md}>
                <Title order={4} style={{ color: 'var(--color-text)' }}>
                  Lista pacjentów
                </Title>
                <Text size={DESIGN_SYSTEM.text.sm} style={{ color: 'var(--color-text)', opacity: 0.7 }}>
                  Przeglądaj profile i historie terapii
                </Text>
                <Button variant="secondary" style={{ alignSelf: 'flex-start' }}>
                  Zobacz pacjentów
                </Button>
              </Stack>
            </Card>

            <Card
              {...PRESETS.card}
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-primary)',
                cursor: 'pointer',
                transition: 'all 200ms ease-out',
                color: 'var(--color-text)'
              }}
              onClick={() => navigate('/settings')}
            >
              <Stack gap={DESIGN_SYSTEM.spacing.md}>
                <Title order={4} style={{ color: 'var(--color-text)' }}>
                  Ustawienia
                </Title>
                <Text size={DESIGN_SYSTEM.text.sm} style={{ color: 'var(--color-text)', opacity: 0.7 }}>
                  Konfiguruj aplikację i eksportuj dane
                </Text>
                <Button variant="secondary" style={{ alignSelf: 'flex-start' }}>
                  Otwórz ustawienia
                </Button>
              </Stack>
            </Card>
          </SimpleGrid>
        </Stack>

        {/* Today's Appointments */}
        {stats.todaysAppointments > 0 && (
          <Stack gap={DESIGN_SYSTEM.spacing.lg}>
            <Title 
              order={3}
              style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'var(--color-text)',
                letterSpacing: '-0.01em'
              }}
            >
              Dzisiejsze wizyty
            </Title>
            
            <Card
              {...PRESETS.card}
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-primary)',
                color: 'var(--color-text)'
              }}
            >
              <Stack gap={DESIGN_SYSTEM.spacing.md}>
                <Text size={DESIGN_SYSTEM.text.lg} fw={600} style={{ color: 'var(--color-text)' }}>
                  {stats.todaysAppointments} {stats.todaysAppointments === 1 ? 'wizyta' : 'wizyt'} na dziś
                </Text>
                <div onClick={() => navigate('/calendar')} style={{ cursor: 'pointer' }}>
                  <Button 
                    variant="secondary" 
                    style={{ alignSelf: 'flex-start' }}
                  >
                    <IconCalendar size={getIconSize('sm')} style={{ marginRight: '8px' }} />
                    Zobacz szczegóły
                  </Button>
                </div>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* Floating Action Button - tylko na mobile */}
        <GlassFAB
          icon={IconPlus}
          label="Dodaj nową sesję"
          onClick={() => navigate('/calendar')}
          variant="primary"
          position="bottom-right"
        />
      </Stack>
    </Container>
  );
}

export default Dashboard; 