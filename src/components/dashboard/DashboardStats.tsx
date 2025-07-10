import { SimpleGrid, Stack, Title } from '@mantine/core';
import { 
  IconUsers, 
  IconCalendar
} from '@tabler/icons-react';
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
    nextAppointment: null
  }
}) => {
  const navigate = useNavigate();

  return (
    <Stack gap="xl">
      <Title 
        order={2}
        style={{
          fontSize: '1.5rem',
          fontWeight: 600,
          color: 'var(--gray-900)',
          letterSpacing: '-0.02em',
          marginBottom: '0.5rem'
        }}
      >
        Przegląd praktyki
      </Title>
      
      <SimpleGrid
        cols={{ base: 1, sm: 2 }}
        spacing="xl"
        style={{ marginBottom: '2rem' }}
      >
        <StatsCard
          title="Aktywni pacjenci"
          value={stats.totalPatients}
          description="Łącznie w systemie"
          icon={<IconUsers size={20} />}
          onClick={() => navigate('/patients')}
        />
        
        <StatsCard
          title="Sesje w tym tygodniu"
          value={stats.sessionsThisWeek}
          description="Zaplanowane spotkania"
          icon={<IconCalendar size={20} />}
          onClick={() => navigate('/calendar')}
        />
      </SimpleGrid>
      
      {/* Secondary stats row */}
      <SimpleGrid
        cols={{ base: 1, sm: 2 }}
        spacing="xl"
      >
        <StatsCard
          title="Dzisiejsze wizyty"
          value={stats.todaysAppointments}
          description="Zaplanowane na dziś"
          icon={<IconCalendar size={20} />}
        />
        
        <StatsCard
          title="Najbliższa sesja"
          value={stats.nextAppointment ? stats.nextAppointment.time : 'Brak'}
          description={stats.nextAppointment ? stats.nextAppointment.patient : 'Brak zaplanowanych wizyt'}
          icon={<IconCalendar size={20} />}
        />
      </SimpleGrid>
    </Stack>
  );
}; 