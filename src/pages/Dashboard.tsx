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
import { PRESETS, DESIGN_SYSTEM, getIconSize } from '../theme/designSystem';

function Dashboard() {
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
          
          <Group gap={DESIGN_SYSTEM.spacing.md}>
            <Button variant="ghost">
              <IconBell size={getIconSize('md')} />
            </Button>
            <Button variant="ghost">
              <IconSearch size={getIconSize('md')} />
            </Button>
            <Button variant="primary">
              <IconPlus size={getIconSize('md')} style={{ marginRight: '8px' }} />
              Nowa sesja
            </Button>
          </Group>
        </Group>

        {/* Stats Cards */}
        <DashboardStats />

        {/* Quick Actions */}
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
            >
              <Stack gap={DESIGN_SYSTEM.spacing.md}>
                <Title order={4} style={{ color: 'var(--color-text)' }}>
                  Kalendarz sesji
                </Title>
                <Text size={DESIGN_SYSTEM.text.sm} style={{ color: 'var(--color-text)', opacity: 0.7 }}>
                  Zarządzaj terminami i planuj spotkania z pacjentami
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
            >
              <Stack gap={DESIGN_SYSTEM.spacing.md}>
                <Title order={4} style={{ color: 'var(--color-text)' }}>
                  Notatki z sesji
                </Title>
                <Text size={DESIGN_SYSTEM.text.sm} style={{ color: 'var(--color-text)', opacity: 0.7 }}>
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
            Ostatnia aktywność
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
              <Text size={DESIGN_SYSTEM.text.sm} style={{ color: 'var(--color-text)', opacity: 0.7 }}>
                Brak ostatniej aktywności do wyświetlenia
              </Text>
              <Button variant="ghost" style={{ alignSelf: 'flex-start' }}>
                <IconNotes size={getIconSize('sm')} style={{ marginRight: '8px' }} />
                Dodaj pierwszą notatkę
              </Button>
            </Stack>
          </Card>
        </Stack>

        {/* Floating Action Button - tylko na mobile */}
        <GlassFAB
          icon={IconPlus}
          label="Dodaj nową sesję"
          onClick={() => console.log('Add session')}
          variant="primary"
          position="bottom-right"
        />
      </Stack>
    </Container>
  );
}

export default Dashboard; 