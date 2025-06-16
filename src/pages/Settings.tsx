import {
    Title,
    Card,
    Stack,
    Group,
    Text,
    Switch,
    Divider,
    Badge,
    ActionIcon,
    Container,
    Paper,
    Box,
    ThemeIcon,
    Button,
} from '@mantine/core';
import {
    IconSettings,
    IconPalette,
    IconMoon,
    IconSun,
    IconDevices,
    IconShield,
    IconDownload,
    IconDatabase,
    IconTestPipe,
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useSettingsStore, type ColorPalette } from '../stores/useSettingsStore';
import { addDemoPatients, clearAllData } from '../utils/demo-data';
import { usePatientStore } from '../stores/usePatientStore';

export function Settings() {
    const { colorPalette, darkMode, setColorPalette, toggleDarkMode } = useSettingsStore();
    const { fetchPatients } = usePatientStore();

    const paletteOptions = [
        {
            value: 'naturalne' as ColorPalette,
            label: 'Naturalne',
            description: 'Zieleń i ciepłe brązy',
            colors: ['#85cb33', '#efffc8', '#a5cbc3', '#3b341f']
        },
        {
            value: 'magenta-rose' as ColorPalette,
            label: 'Magenta Rose',
            description: 'Eleganckie fiolety i róże',
            colors: ['#861388', '#e15a97', '#eeabc4', '#4b2840']
        }
    ] as const;

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

                            {/* Paleta kolorów */}
                            <Stack gap="sm">
                                <Text fw={500}>Paleta kolorów</Text>
                                <Text size="sm" c="dimmed">
                                    Wybierz schemat kolorystyczny dla aplikacji
                                </Text>
                                
                                <Box>
                                    {paletteOptions.map((option) => (
                                        <Paper
                                            key={option.value}
                                            p="md"
                                            mb="sm"
                                            withBorder
                                            style={{
                                                cursor: 'pointer',
                                                backgroundColor: colorPalette === option.value 
                                                    ? 'var(--mantine-color-blue-light)' 
                                                    : undefined,
                                                borderColor: colorPalette === option.value 
                                                    ? 'var(--mantine-color-blue-filled)' 
                                                    : undefined,
                                            }}
                                            onClick={() => setColorPalette(option.value)}
                                        >
                                            <Group justify="space-between" align="center">
                                                <Stack gap="xs">
                                                    <Group align="center" gap="sm">
                                                        <Text fw={500}>{option.label}</Text>
                                                        {colorPalette === option.value && (
                                                            <Badge size="sm" variant="filled">
                                                                Aktywne
                                                            </Badge>
                                                        )}
                                                    </Group>
                                                    <Text size="sm" c="dimmed">
                                                        {option.description}
                                                    </Text>
                                                </Stack>
                                                
                                                <Group gap="xs">
                                                    {option.colors.map((color, index) => (
                                                        <Box
                                                            key={index}
                                                            w={20}
                                                            h={20}
                                                            style={{
                                                                backgroundColor: color,
                                                                borderRadius: '50%',
                                                                border: '1px solid rgba(255,255,255,0.2)'
                                                            }}
                                                        />
                                                    ))}
                                                </Group>
                                            </Group>
                                        </Paper>
                                    ))}
                                </Box>
                            </Stack>

                            <Divider variant="dashed" />

                            {/* Tryb ciemny/jasny */}
                            <Group justify="space-between" align="center">
                                <Stack gap="xs">
                                    <Group align="center" gap="sm">
                                        {darkMode ? <IconMoon size={18} /> : <IconSun size={18} />}
                                        <Text fw={500}>Tryb ciemny</Text>
                                    </Group>
                                    <Text size="sm" c="dimmed">
                                        Przełącz między jasnym a ciemnym interfejsem
                                    </Text>
                                </Stack>
                                <Switch
                                    checked={darkMode}
                                    onChange={toggleDarkMode}
                                    size="md"
                                />
                            </Group>
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