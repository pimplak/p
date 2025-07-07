import {
  Container,
  Stack,
  Group,
  Title,
  Text,
  Card,
  ThemeIcon,
  Badge,
} from '@mantine/core';
import {
  IconChartLine,
  IconClock,
} from '@tabler/icons-react';

function Analytics() {
  return (
    <Container size="md">
      <Stack gap="xl">
        {/* Header Section */}
        <Group align="center" gap="md">
          <ThemeIcon size="xl" variant="light" color="teal">
            <IconChartLine size={24} />
          </ThemeIcon>
          <div>
            <Title order={1}>Statystyki</Title>
            <Text size="sm" c="dimmed">
              Analiza i raporty praktyki terapeutycznej
            </Text>
          </div>
        </Group>

        {/* Coming Soon Card */}
        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <Stack gap="lg" align="center" ta="center">
            <ThemeIcon size={80} variant="light" color="yellow">
              <IconClock size={40} />
            </ThemeIcon>
            
            <Stack gap="sm" align="center">
              <Title order={2} size="h3">
                Feature będzie dostępny soon
              </Title>
              <Text size="lg" c="dimmed" maw={500}>
                Przygotowujemy zaawansowane narzędzia analityczne do śledzenia postępów praktyki i efektywności terapii.
              </Text>
            </Stack>

            <Badge size="lg" variant="light" color="teal">
              W przygotowaniu
            </Badge>
          </Stack>
        </Card>

        {/* Features Preview */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <Title order={3} size="h4">
              Planowane funkcje:
            </Title>
            
            <Stack gap="xs">
              <Text size="sm">📈 Wykresy postępów pacjentów</Text>
              <Text size="sm">💰 Analiza przychodów i płatności</Text>
              <Text size="sm">📅 Raport wykorzystania czasu</Text>
              <Text size="sm">📊 Statystyki skuteczności terapii</Text>
              <Text size="sm">📱 Analiza przypomnień SMS (dostępna w Ustawieniach)</Text>
              <Text size="sm">📋 Raporty compliance i frekwencji</Text>
              <Text size="sm">📄 Eksport raportów do PDF/Excel</Text>
            </Stack>
          </Stack>
        </Card>

        {/* Current Analytics Available */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <Title order={3} size="h4">
              Dostępne już teraz:
            </Title>
            
            <Text size="sm">
              🔹 Podstawowe statystyki praktyki znajdziesz na <strong>Dashboard</strong>
              <br />
              🔹 Analiza SMS dostępna w sekcji <strong>Ustawienia</strong>
            </Text>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}

export default Analytics; 