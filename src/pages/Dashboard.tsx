import { 
  Container, 
  Stack, 
  Title, 
  Text, 
  Group,
  Card,
  SimpleGrid
} from '@mantine/core';
import { IconPlus, IconBell, IconSearch, IconNotes } from '@tabler/icons-react';
import { DashboardStats } from '../components/dashboard/DashboardStats';
import { Button } from '../components/ui/Button';
import { GlassFAB } from '../components/ui/GlassFAB';

function Dashboard() {
  return (
    <Container size="xl" px={{ base: 'md', sm: 'xl' }}>
      <Stack gap="xl" py="xl">
        {/* Header */}
        <Group justify="space-between" align="flex-start">
          <Stack gap="xs">
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
              size="lg" 
              style={{ lineHeight: '1.6', color: 'var(--color-text)', opacity: 0.7 }}
            >
              Witaj ponownie! Oto przegląd Twojej praktyki terapeutycznej.
            </Text>
          </Stack>
          
          <Group gap="md">
            <Button variant="ghost">
              <IconBell size={20} />
            </Button>
            <Button variant="ghost">
              <IconSearch size={20} />
            </Button>
            <Button variant="primary">
              <IconPlus size={20} style={{ marginRight: '8px' }} />
              Nowa sesja
            </Button>
          </Group>
        </Group>

        {/* Stats Cards */}
        <DashboardStats />

        {/* Quick Actions */}
        <Stack gap="lg">
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
          
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl">
            <Card
              shadow="sm"
              padding="xl"
              radius="md"
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-primary)',
                cursor: 'pointer',
                transition: 'all 200ms ease-out',
                color: 'var(--color-text)'
              }}
            >
              <Stack gap="md">
                <Title order={4} style={{ color: 'var(--color-text)' }}>
                  Kalendarz sesji
                </Title>
                <Text size="sm" style={{ color: 'var(--color-text)', opacity: 0.7 }}>
                  Zarządzaj terminami i planuj spotkania z pacjentami
                </Text>
                <Button variant="secondary" style={{ alignSelf: 'flex-start' }}>
                  Otwórz kalendarz
                </Button>
              </Stack>
            </Card>

            <Card
              shadow="sm"
              padding="xl"
              radius="md"
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-primary)',
                cursor: 'pointer',
                transition: 'all 200ms ease-out',
                color: 'var(--color-text)'
              }}
            >
              <Stack gap="md">
                <Title order={4} style={{ color: 'var(--color-text)' }}>
                  Lista pacjentów
                </Title>
                <Text size="sm" style={{ color: 'var(--color-text)', opacity: 0.7 }}>
                  Przeglądaj profile i historie terapii
                </Text>
                <Button variant="secondary" style={{ alignSelf: 'flex-start' }}>
                  Zobacz pacjentów
                </Button>
              </Stack>
            </Card>

            <Card
              shadow="sm"
              padding="xl"
              radius="md"
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-primary)',
                cursor: 'pointer',
                transition: 'all 200ms ease-out',
                color: 'var(--color-text)'
              }}
            >
              <Stack gap="md">
                <Title order={4} style={{ color: 'var(--color-text)' }}>
                  Notatki z sesji
                </Title>
                <Text size="sm" style={{ color: 'var(--color-text)', opacity: 0.7 }}>
                  Dodaj obserwacje i śledź postępy
                </Text>
                <Button variant="secondary" style={{ alignSelf: 'flex-start' }}>
                  Nowa notatka
                </Button>
              </Stack>
            </Card>
          </SimpleGrid>
        </Stack>

        {/* Recent Activity */}
        <Stack gap="lg">
          <Title 
            order={3}
            style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: 'var(--color-text)',
              letterSpacing: '-0.01em'
            }}
          >
            Ostatnia aktywność
          </Title>
          
          <Card
            shadow="sm"
            padding="xl"
            radius="md"
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-primary)',
              color: 'var(--color-text)'
            }}
          >
            <Stack gap="md">
              <Text size="sm" style={{ color: 'var(--color-text)', opacity: 0.7 }}>
                Dzisiaj, 14:30
              </Text>
              <Text fw={500} style={{ color: 'var(--color-text)' }}>
                Zakończono sesję z Anną Kowalską
              </Text>
              <Text size="sm" style={{ color: 'var(--color-text)', opacity: 0.7 }}>
                Długość: 50 min • Notatka: Znaczący postęp w radzeniu sobie ze stresem
              </Text>
            </Stack>
          </Card>
        </Stack>

        {/* Glass FAB for quick actions */}
        <GlassFAB
          icon={IconNotes}
          label="Szybka notatka"
          onClick={() => console.log('Quick note modal')}
          variant="primary"
          position="bottom-right"
          animate
        />
      </Stack>
    </Container>
  );
}

export default Dashboard; 