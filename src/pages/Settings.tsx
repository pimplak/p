import {
    Title,
    Card,
    Stack,
    Group,
    Text,
    Divider,
    Badge,
    ActionIcon,
    Container,
    ThemeIcon,
    Button,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
    IconSettings,
    IconPalette,
    IconDevices,
    IconShield,
    IconDownload,
    IconDatabase,
    IconTestPipe,
} from '@tabler/icons-react';
import { ThemeSelector, ThemePreview } from '../components/ThemeSelector';
import { usePatientStore } from '../stores/usePatientStore';
import { addDemoPatients, clearAllData } from '../utils/demo-data';

function Settings() {
    const { fetchPatients } = usePatientStore();

    const handleAddDemoData = async () => {
        try {
            const success = await addDemoPatients();
            if (success) {
                notifications.show({
                    title: 'Sukces!',
                    message: 'Dodano przykładowych pacjentów',
                    color: 'green'
                });
                // Odśwież listę pacjentów
                fetchPatients();
            } else {
                notifications.show({
                    title: 'Błąd',
                    message: 'Nie udało się dodać danych demonstracyjnych',
                    color: 'red'
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
            const success = await clearAllData();
            if (success) {
                notifications.show({
                    title: 'Sukces!',
                    message: 'Wszystkie dane zostały usunięte',
                    color: 'green'
                });
                // Odśwież listę pacjentów
                fetchPatients();
            } else {
                notifications.show({
                    title: 'Błąd',
                    message: 'Nie udało się wyczyścić danych',
                    color: 'red'
                });
            }
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
            <Stack>
                <Group align="center" gap="md">
                    <ThemeIcon size="xl" variant="light">
                        <IconSettings size={24} />
                    </ThemeIcon>
                    <Title order={1}>Ustawienia</Title>
                </Group>

                <Stack gap="lg">
                    {/* Wygląd i interfejs */}
                    <Card>
                        <Stack>
                            <Group align="center" gap="sm">
                                <IconPalette size={20} />
                                <Text fw={600} size="lg">Wygląd i interfejs</Text>
                            </Group>
                            
                            <Divider />

                            {/* Ferro's Advanced Theme System */}
                            <Stack gap="lg">
                                <ThemeSelector />
                                <ThemePreview />
                            </Stack>
                        </Stack>
                    </Card>

                    {/* Aplikacja i dane */}
                    <Card>
                        <Stack>
                            <Group align="center" gap="sm">
                                <IconDevices size={20} />
                                <Text fw={600} size="lg">Aplikacja i dane</Text>
                            </Group>
                            
                            <Divider />

                            <Group justify="space-between" align="center">
                                <Stack gap="xs">
                                    <Text fw={500}>Dodaj dane demonstracyjne</Text>
                                    <Text size="sm" c="dimmed">
                                        Dodaj przykładowych pacjentów do testowania aplikacji
                                    </Text>
                                </Stack>
                                <Button
                                    leftSection={<IconTestPipe size={18} />}
                                    variant="light"
                                    color="blue"
                                    onClick={handleAddDemoData}
                                >
                                    Dodaj demo
                                </Button>
                            </Group>

                            <Divider variant="dashed" />

                            <Group justify="space-between" align="center">
                                <Stack gap="xs">
                                    <Text fw={500}>Eksport danych</Text>
                                    <Text size="sm" c="dimmed">
                                        Pobierz kopię zapasową wszystkich danych
                                    </Text>
                                </Stack>
                                <ActionIcon
                                    variant="light"
                                    size="lg"
                                    onClick={() => {
                                        // TODO: Implementacja eksportu danych
                                        console.log('Eksport danych...');
                                    }}
                                >
                                    <IconDownload size={18} />
                                </ActionIcon>
                            </Group>

                            <Divider variant="dashed" />

                            <Group justify="space-between" align="center">
                                <Stack gap="xs">
                                    <Text fw={500} c="red">Usuń wszystkie dane</Text>
                                    <Text size="sm" c="dimmed">
                                        Trwale usuń wszystkich pacjentów i wizyty
                                    </Text>
                                </Stack>
                                <Button
                                    leftSection={<IconDatabase size={18} />}
                                    variant="light"
                                    color="red"
                                    onClick={handleClearAllData}
                                >
                                    Wyczyść dane
                                </Button>
                            </Group>
                        </Stack>
                    </Card>

                    {/* Prywatność i bezpieczeństwo */}
                    <Card>
                        <Stack>
                            <Group align="center" gap="sm">
                                <IconShield size={20} />
                                <Text fw={600} size="lg">Prywatność i bezpieczeństwo</Text>
                            </Group>
                            
                            <Divider />

                            <Text size="sm" c="dimmed">
                                <strong>Lokalny storage:</strong> Wszystkie dane są przechowywane lokalnie na twoim urządzeniu.
                                <br /><br />
                                <strong>Offline-first:</strong> Aplikacja działa bez połączenia z internetem.
                                <br /><br />
                                <strong>HIPAA-compliant:</strong> Zbudowana z myślą o ochronie danych medycznych.
                            </Text>
                        </Stack>
                    </Card>

                    {/* Informacje o aplikacji */}
                    <Card>
                        <Stack>
                            <Text fw={600} size="lg">O aplikacji</Text>
                            <Divider />
                            
                            <Group justify="space-between">
                                <Text size="sm">Wersja aplikacji</Text>
                                <Badge variant="light">1.0.0-beta</Badge>
                            </Group>
                            
                            <Group justify="space-between">
                                <Text size="sm">Ostatnia aktualizacja</Text>
                                <Text size="sm" c="dimmed">Dziś</Text>
                            </Group>
                            
                            <Text size="xs" c="dimmed" ta="center" mt="md">
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