import { SimpleGrid, Stack, Title } from '@mantine/core';
import { IconUsers, IconCalendar } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { StatsCard } from '../ui/StatsCard';

interface DashboardStatsProps {
  stats?: {
    totalPatients: number;
    sessionsThisWeek: number;
    avgSessionDuration: number;
    completionRate: number;
    totalNotes: number;
    todaysAppointments: number;
    nextAppointment: {
      patient: string;
      time: string;
    } | null;
  };
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  stats = {
    totalPatients: 0,
    sessionsThisWeek: 0,
    avgSessionDuration: 0,
    completionRate: 0,
    totalNotes: 0,
    todaysAppointments: 0,
    nextAppointment: null,
  },
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Stack gap='xl'>
      <Title
        order={2}
        style={{
          fontSize: '1.5rem',
          fontWeight: 600,
          color: 'var(--gray-900)',
          letterSpacing: '-0.02em',
          marginBottom: '0.5rem',
        }}
      >
        {t('dashboard.practiceOverview')}
      </Title>

      <SimpleGrid
        cols={{ base: 1, sm: 2 }}
        spacing='xl'
        style={{ marginBottom: '2rem' }}
      >
        <StatsCard
          title={t('dashboard.stats.activePatients')}
          value={stats.totalPatients}
          description={t('dashboard.stats.totalInSystem')}
          icon={<IconUsers size={20} />}
          onClick={() => navigate('/patients')}
        />

        <StatsCard
          title={t('dashboard.stats.sessionsThisWeek')}
          value={stats.sessionsThisWeek}
          description={t('dashboard.stats.scheduledMeetings')}
          icon={<IconCalendar size={20} />}
          onClick={() => navigate('/calendar')}
        />
      </SimpleGrid>

      {/* Secondary stats row */}
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing='xl'>
        <StatsCard
          title={t('dashboard.stats.todaysAppointments')}
          value={stats.todaysAppointments}
          description={t('dashboard.stats.scheduledForToday')}
          icon={<IconCalendar size={20} />}
        />

        <StatsCard
          title={t('dashboard.stats.nextSession')}
          value={stats.nextAppointment ? stats.nextAppointment.time : t('dashboard.stats.noScheduledAppointments')}
          description={
            stats.nextAppointment
              ? stats.nextAppointment.patient
              : t('dashboard.stats.noScheduledAppointments')
          }
          icon={<IconCalendar size={20} />}
        />
      </SimpleGrid>
    </Stack>
  );
};
