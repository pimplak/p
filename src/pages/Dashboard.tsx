import { Container, Stack, Title, Text, ActionIcon, Tooltip } from '@mantine/core';
import { IconPlus, IconDownload, IconNote, IconBell } from '@tabler/icons-react';
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { NextAppointmentCard } from '../components/dashboard/NextAppointmentCard';
import { OverviewStats } from '../components/dashboard/OverviewStats';
import { QuickActionsGrid } from '../components/dashboard/QuickActionsGrid';
import { TodaysTimeline } from '../components/dashboard/TodaysTimeline';
import { ExportModal } from '../components/ExportModal';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { useExport } from '../hooks/useExport';
import { useHeader } from '../hooks/useHeader';
import { useTheme } from '../hooks/useTheme';
import { useAppointmentStore } from '../stores/useAppointmentStore';
import { usePatientStore } from '../stores/usePatientStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import { AppointmentStatus } from '../types/Appointment';
import type { AppointmentWithPatient } from '../types/Appointment';

const WEEKDAY_NAMES = [
  'NIEDZIELA',
  'PONIEDZIAŁEK',
  'WTOREK',
  'ŚRODA',
  'CZWARTEK',
  'PIĄTEK',
  'SOBOTA',
];
const MONTH_NAMES = [
  'STY', 'LUT', 'MAR', 'KWI', 'MAJ', 'CZE',
  'LIP', 'SIE', 'WRZ', 'PAŹ', 'LIS', 'GRU',
];

function Dashboard() {
  const navigate = useNavigate();
  const { patients, fetchPatients } = usePatientStore();
  const {
    appointments,
    fetchAppointments,
    getTodaysAppointments,
    getUpcomingAppointments,
  } = useAppointmentStore();
  const { practitionerName, practitionerTitle } = useSettingsStore();
  const { currentPalette, mantineTheme } = useTheme();
  const { exportOpened, handleExport, handleExportData, closeExport } = useExport(
    patients,
    appointments
  );

  const now = useMemo(() => new Date(), []);
  const dateLabel = `${WEEKDAY_NAMES[now.getDay()]}, ${now.getDate()} ${MONTH_NAMES[now.getMonth()]}`;
  const greeting = `Dzień dobry, ${practitionerTitle} ${practitionerName}`;

  useHeader({
    title: (
      <Stack gap={0} style={{ alignItems: 'center' }}>
        <Text size="xs" style={{ color: `${currentPalette.text}B3`, textTransform: 'uppercase' }}>
          {dateLabel}
        </Text>
        <Text size="md" fw={600} style={{ color: currentPalette.text }}>
          {greeting}
        </Text>
      </Stack>
    ),
    rightSlot: (
      <Tooltip label="Powiadomienia">
        <ActionIcon
          size="lg"
          variant="subtle"
          style={{ color: currentPalette.text }}
          onClick={() => {}}
        >
          <IconBell size={20} />
          {/* TODO: notification dot when there are unread */}
        </ActionIcon>
      </Tooltip>
    ),
  });

  useEffect(() => {
    fetchPatients();
    fetchAppointments();
  }, [fetchPatients, fetchAppointments]);

  const { nextAppointment, todaysList, stats, currentAppointmentId } = useMemo(() => {
    const activePatients = patients.filter(p => p.status === 'active').length;
    const todaysAppointments = getTodaysAppointments();
    const upcoming = getUpcomingAppointments();

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

    const weeklyRevenue = thisWeekAppointments.reduce(
      (sum, apt) => sum + (apt.price ?? 0),
      0
    );

    const pendingAppointments = appointments.filter(
      apt => apt.status === AppointmentStatus.SCHEDULED
    );
    const pendingHours = Math.round(
      pendingAppointments.reduce((sum, apt) => sum + (apt.duration ?? 0), 0) / 60
    );

    const nextAppointment = upcoming[0] ?? null;

    const currentId = (() => {
      const sorted = [...todaysAppointments].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      for (const apt of sorted) {
        const start = new Date(apt.date).getTime();
        const end = start + (apt.duration ?? 60) * 60 * 1000;
        if (apt.status === AppointmentStatus.SCHEDULED && now.getTime() >= start && now.getTime() <= end) {
          return apt.id;
        }
      }
      return undefined;
    })();

    return {
      nextAppointment,
      todaysList: todaysAppointments.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      ),
      stats: {
        totalPatients: activePatients,
        weeklyRevenue,
        pendingHours,
      },
      currentAppointmentId: currentId,
    };
  }, [patients, appointments, getTodaysAppointments, getUpcomingAppointments, now]);

  return (
    <Container
      size={mantineTheme.other?.layout?.containerSize ?? 'xl'}
      px={{ base: 'md', sm: 'xl' }}
    >
      <Stack gap={mantineTheme.spacing?.xl ?? 'xl'} py={mantineTheme.spacing?.xl ?? 'xl'}>
        {/* Next Up */}
        {nextAppointment && (
          <Stack gap="sm">
            <Title
              order={3}
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: `${currentPalette.text}B3`,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              Następna wizyta
            </Title>
            <NextAppointmentCard
              appointment={nextAppointment as AppointmentWithPatient}
              isNow={
                nextAppointment.id === currentAppointmentId
              }
            />
          </Stack>
        )}

        {/* Quick Actions */}
        <Stack gap="sm">
          <Title
            order={3}
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: `${currentPalette.text}B3`,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            Szybkie akcje
          </Title>
          <QuickActionsGrid />
        </Stack>

        {/* Overview */}
        <Stack gap="sm">
          <Title
            order={3}
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: `${currentPalette.text}B3`,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            Przegląd
          </Title>
          <OverviewStats
            totalPatients={stats.totalPatients}
            weeklyRevenue={stats.weeklyRevenue}
            pendingHours={stats.pendingHours}
          />
        </Stack>

        {/* Today's Timeline */}
        <TodaysTimeline
          appointments={todaysList as AppointmentWithPatient[]}
          currentAppointmentId={currentAppointmentId}
          onSeeAll={() => navigate('/calendar')}
        />

        <FloatingActionButton
          actions={[
            {
              id: 'new-session',
              icon: <IconPlus size="1.5rem" />,
              label: 'Dodaj sesję',
              onClick: () => navigate('/calendar'),
            },
            {
              id: 'export-excel',
              icon: <IconDownload size="1.5rem" />,
              label: 'Eksport',
              onClick: handleExport,
            },
            {
              id: 'add-note',
              icon: <IconNote size="1.5rem" />,
              label: 'Dodaj notatkę',
              onClick: () => navigate('/notes'),
              disabled: false,
            },
          ]}
        />

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
