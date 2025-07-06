import {
  Container,
  Stack,
  Group,
  Title,
  Text,
  Card,
  Divider,
  Button,
  ThemeIcon,
  Badge,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
  IconSettings,
  IconPalette,
  IconDatabase,
  IconTestPipe,
  IconDownload,
  IconShield,
  IconInfoCircle,
} from '@tabler/icons-react';
import { ThemeSelector } from '../components/ThemeSelector';
import { useAppointmentStore } from '../stores/useAppointmentStore';
import { usePatientStore } from '../stores/usePatientStore';
import { insertSampleData, clearAllData } from '../utils/sampleData';

function Settings() {
    const { fetchPatients } = usePatientStore();
    const { fetchAppointments } = useAppointmentStore();

    const handleAddDemoData = async () => {
        try {
            const success = await insertSampleData();
            if (success) {
                notifications.show({
                    title: 'Sukces!',
                    message: 'Dodano przykładowych pacjentów i wizyty',
                    color: 'green'
                            });
            // Odśwież listę pacjentów i wizyt
            fetchPatients();
            fetchAppointments();
            } else {
                notifications.show({
                    title: 'Informacja',
                    message: 'Dane już istnieją w bazie',
                    color: 'yellow'
                });
            }
        } catch {
            notifications.show({
                title: 'Błąd',
                message: 'Wystąpił błąd podczas dodawania danych',
                color: 'red'
            });
        }
    };

    const handleClearAllData = async () => {
        try {
            await clearAllData();
            notifications.show({
                title: 'Sukces!',
                message: 'Wszystkie dane zostały usunięte',
                color: 'green'
                            });
                // Odśwież listę pacjentów i wizyt
                fetchPatients();
                fetchAppointments();
        } catch {
            notifications.show({
                title: 'Błąd',
                message: 'Wystąpił błąd podczas usuwania danych',
                color: 'red'
            });
        }
    };

    return (
        <Container size="md">
            <Stack gap="xl">
                {/* Header Section */}
                <Group align="center" gap="md">
                    <ThemeIcon size="xl" variant="light" color="indigo">
                        <IconSettings size={24} />
                    </ThemeIcon>
                    <Title order={1}>Ustawienia</Title>
                </Group>

                {/* Settings Sections */}
                <Stack gap="lg">
                    {/* Wygląd i interfejs */}
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Stack gap="md">
                            <Group align="center" gap="sm">
                                <IconPalette size={20} color="var(--mantine-color-indigo-6)" />
                                <Text fw={600} size="lg">Wygląd i interfejs</Text>
                            </Group>
                            
                            <Divider />

                            <ThemeSelector />
                        </Stack>
                    </Card>

                    {/* Aplikacja i dane */}
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Stack gap="md">
                            <Group align="center" gap="sm">
                                <IconDatabase size={20} color="var(--mantine-color-blue-6)" />
                                <Text fw={600} size="lg">Aplikacja i dane</Text>
                            </Group>
                            
                            <Divider />

                            {/* Demo Data Section */}
                            <Group justify="space-between" align="flex-start">
                                <Stack gap="xs" style={{ flex: 1 }}>
                                    <Text fw={500}>Dodaj dane demonstracyjne</Text>
                                    <Text size="sm" c="dimmed">
                                        Dodaj przykładowych pacjentów do testowania aplikacji
                                    </Text>
                                </Stack>
                                <Button
                                    leftSection={<IconTestPipe size={16} />}
                                    variant="light"
                                    color="blue"
                                    size="sm"
                                    onClick={handleAddDemoData}
                                >
                                    Dodaj demo
                                </Button>
                            </Group>

                            <Divider variant="dashed" />

                            {/* Export Data Section */}
                            <Group justify="space-between" align="flex-start">
                                <Stack gap="xs" style={{ flex: 1 }}>
                                    <Text fw={500}>Eksport danych</Text>
                                    <Text size="sm" c="dimmed">
                                        Pobierz kopię zapasową wszystkich danych
                                    </Text>
                                </Stack>
                                <Button
                                    leftSection={<IconDownload size={16} />}
                                    variant="light"
                                    color="green"
                                    size="sm"
                                    onClick={() => {
                                        // TODO: Implementacja eksportu danych
                                        console.log('Eksport danych...');
                                    }}
                                >
                                    Eksportuj
                                </Button>
                            </Group>

                            <Divider variant="dashed" />

                            {/* Clear Data Section */}
                            <Group justify="space-between" align="flex-start">
                                <Stack gap="xs" style={{ flex: 1 }}>
                                    <Text fw={500} c="red">Usuń wszystkie dane</Text>
                                    <Text size="sm" c="dimmed">
                                        Trwale usuń wszystkich pacjentów i wizyty
                                    </Text>
                                </Stack>
                                <Button
                                    leftSection={<IconDatabase size={16} />}
                                    variant="light"
                                    color="red"
                                    size="sm"
                                    onClick={handleClearAllData}
                                >
                                    Wyczyść dane
                                </Button>
                            </Group>
                        </Stack>
                    </Card>

                    {/* Prywatność i bezpieczeństwo */}
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Stack gap="md">
                            <Group align="center" gap="sm">
                                <IconShield size={20} color="var(--mantine-color-green-6)" />
                                <Text fw={600} size="lg">Prywatność i bezpieczeństwo</Text>
                            </Group>
                            
                            <Divider />

                            <Stack gap="sm">
                                <Group align="flex-start" gap="sm">
                                    <Text fw={500} size="sm">Lokalny storage:</Text>
                                    <Text size="sm" c="dimmed" style={{ flex: 1 }}>
                                        Wszystkie dane są przechowywane lokalnie na twoim urządzeniu.
                                    </Text>
                                </Group>
                                
                                <Group align="flex-start" gap="sm">
                                    <Text fw={500} size="sm">Offline-first:</Text>
                                    <Text size="sm" c="dimmed" style={{ flex: 1 }}>
                                        Aplikacja działa bez połączenia z internetem.
                                    </Text>
                                </Group>
                                
                                <Group align="flex-start" gap="sm">
                                    <Text fw={500} size="sm">HIPAA-compliant:</Text>
                                    <Text size="sm" c="dimmed" style={{ flex: 1 }}>
                                        Zbudowana z myślą o ochronie danych medycznych.
                                    </Text>
                                </Group>
                            </Stack>
                        </Stack>
                    </Card>

                    {/* Informacje o aplikacji */}
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Stack gap="md">
                            <Group align="center" gap="sm">
                                <IconInfoCircle size={20} color="var(--mantine-color-gray-6)" />
                                <Text fw={600} size="lg">O aplikacji</Text>
                            </Group>
                            
                            <Divider />
                            
                            <Stack gap="sm">
                                <Group justify="space-between" align="center">
                                    <Text fw={500} size="sm">Wersja aplikacji</Text>
                                    <Badge variant="light" color="indigo">1.0.0-BETA</Badge>
                                </Group>
                                
                                <Group justify="space-between" align="center">
                                    <Text fw={500} size="sm">Ostatnia aktualizacja</Text>
                                    <Text size="sm" c="dimmed">Dziś</Text>
                                </Group>
                            </Stack>
                            
                            <Divider variant="dashed" />
                            
                            <Text size="xs" c="dimmed" ta="center">
                                PsychFlow - Progressive Web App dla psychologów
                                <br />
                                Zbudowane z ❤️ dla społeczności terapeutycznej
                            </Text>
                        </Stack>
                    </Card>
                </Stack>
            </Stack>
        </Container>
    );
}

export default Settings; 