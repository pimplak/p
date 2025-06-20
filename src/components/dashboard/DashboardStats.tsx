import { SimpleGrid, Stack, Title } from '@mantine/core';
import { 
  IconUsers, 
  IconCalendar, 
  IconClock, 
  IconTrendingUp,
  IconNotes
} from '@tabler/icons-react';
import { StatsCard } from '../ui/StatsCard';

interface DashboardStatsProps {
  stats?: {
    totalPatients: number;
    sessionsThisWeek: number;
    avgSessionDuration: number;
    completionRate: number;
    totalNotes: number;
  };
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ 
  stats = {
    totalPatients: 42,
    sessionsThisWeek: 18,
    avgSessionDuration: 55,
    completionRate: 94,
    totalNotes: 267
  }
}) => {
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
        cols={{ base: 1, sm: 2, lg: 4 }}
        spacing="xl"
        style={{ marginBottom: '2rem' }}
      >
        <StatsCard
          title="Aktywni pacjenci"
          value={stats.totalPatients}
          description="Łącznie w systemie"
          icon={IconUsers}
          color="indigo"
          trend={{
            value: 8,
            period: "w tym miesiącu"
          }}
        />
        
        <StatsCard
          title="Sesje w tym tygodniu"
          value={stats.sessionsThisWeek}
          description="Zaplanowane spotkania"
          icon={IconCalendar}
          color="green"
          trend={{
            value: 12,
            period: "vs poprzedni tydzień"
          }}
        />
        
        <StatsCard
          title="Średni czas sesji"
          value={`${stats.avgSessionDuration} min`}
          description="Przeciętna długość"
          icon={IconClock}
          color="yellow"
          trend={{
            value: -3,
            period: "w tym miesiącu"
          }}
        />
        
        <StatsCard
          title="Skuteczność terapii"
          value={`${stats.completionRate}%`}
          description="Ukończone cele"
          icon={IconTrendingUp}
          color="green"
          trend={{
            value: 5,
            period: "wzrost postępów"
          }}
        />
      </SimpleGrid>
      
      {/* Secondary stats row */}
      <SimpleGrid
        cols={{ base: 1, sm: 2 }}
        spacing="xl"
      >
        <StatsCard
          title="Notatki z sesji"
          value={stats.totalNotes}
          description="Zapisane obserwacje"
          icon={IconNotes}
          color="indigo"
        />
        
        <StatsCard
          title="Najbliższa sesja"
          value="Za 2 godz."
          description="Anna Kowalska - kontrola postępów"
          icon={IconCalendar}
          color="yellow"
        />
      </SimpleGrid>
    </Stack>
  );
}; 