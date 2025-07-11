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
  IconNotes,
  IconClock,
} from '@tabler/icons-react';
import { useTheme } from '../hooks/useTheme';

function Notes() {
  const { currentPalette } = useTheme();

  return (
    <Container size="md">
      <Stack gap="xl">
        {/* Header Section */}
        <Group align="center" gap="md">
          <ThemeIcon size="xl" variant="light" color={currentPalette.primary}>
            <IconNotes size={24} />
          </ThemeIcon>
          <div>
            <Title order={1}>Notatki</Title>
            <Text size="sm" c="dimmed">
              System notatek terapeutycznych
            </Text>
          </div>
        </Group>

        {/* Coming Soon Card */}
        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <Stack gap="lg" align="center" ta="center">
            <ThemeIcon size={80} variant="light" color={currentPalette.accent}>
              <IconClock size={40} />
            </ThemeIcon>
            
            <Stack gap="sm" align="center">
              <Title order={2} size="h3">
                Feature będzie dostępny soon
              </Title>
              <Text size="lg" c="dimmed" maw={500}>
                Pracujemy nad zaawansowanym systemem notatek terapeutycznych z podporą dla metod SOAP, CBT i innych standardów dokumentacji.
              </Text>
            </Stack>

            <Badge size="lg" variant="light" color={currentPalette.primary}>
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
              <Text size="sm">📝 Notatki w formacie SOAP (Subjective, Objective, Assessment, Plan)</Text>
              <Text size="sm">🎯 Śledzenie celów terapeutycznych</Text>
              <Text size="sm">📊 Historia postępów pacjenta</Text>
              <Text size="sm">🔍 Wyszukiwanie w notatkach</Text>
              <Text size="sm">📋 Szablony notatek</Text>
              <Text size="sm">🔐 Pełne szyfrowanie i bezpieczeństwo</Text>
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}

export default Notes; 