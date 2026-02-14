import {
  Container,
  Stack,
  Group,
  Title,
  Text,
  Card,
  Divider,
  Button,
  Badge,
  TextInput,
  Select,
  Collapse,
  TagsInput,
  NumberInput,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  IconPalette,
  IconDatabase,
  IconTestPipe,
  IconDownload,
  IconShield,
  IconInfoCircle,
  IconMessage,
  IconChevronDown,
  IconChevronRight,
  IconClock,
} from '@tabler/icons-react';
import { AppointmentTypesManager } from '../components/AppointmentTypesManager';
import { SMSTemplateManager } from '../components/SMSTemplateManager';
import { ThemeSelector } from '../components/ThemeSelector';
import { useTheme } from '../hooks/useTheme';
import { useAppointmentStore } from '../stores/useAppointmentStore';
import { usePatientStore } from '../stores/usePatientStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import { insertSampleData, clearAllData } from '../utils/sampleData';

function Settings() {
  const { fetchPatients } = usePatientStore();
  const { fetchAppointments } = useAppointmentStore();
  const {
    practitionerName,
    practitionerTitle,
    setPractitionerName,
    setPractitionerTitle,
    appointmentHours,
    setAppointmentHours,
    defaultAppointmentDuration,
    setDefaultAppointmentDuration,
  } = useSettingsStore();
  const { currentPalette, utilityColors } = useTheme();
  const [templatesOpened, { toggle: toggleTemplates }] = useDisclosure(false);

  const handleAddDemoData = async () => {
    try {
      const success = await insertSampleData();
      if (success) {
        notifications.show({
          title: 'Sukces!',
          message: 'Dodano przykładowych pacjentów i wizyty',
          color: 'green',
        });
        // Odśwież listę pacjentów i wizyt
        fetchPatients();
        fetchAppointments();
      } else {
        notifications.show({
          title: 'Informacja',
          message: 'Dane już istnieją w bazie',
          color: 'yellow',
        });
      }
    } catch {
      notifications.show({
        title: 'Błąd',
        message: 'Wystąpił błąd podczas dodawania danych',
        color: 'red',
      });
    }
  };

  const handleClearAllData = async () => {
    try {
      await clearAllData();
      notifications.show({
        title: 'Sukces!',
        message: 'Wszystkie dane zostały usunięte',
        color: 'green',
      });
      // Odśwież listę pacjentów i wizyt
      fetchPatients();
      fetchAppointments();
    } catch {
      notifications.show({
        title: 'Błąd',
        message: 'Wystąpił błąd podczas usuwania danych',
        color: 'red',
      });
    }
  };

  return (
    <Container size='md' px={{ base: 'md', sm: 'xl' }}>
      <Stack gap='xl' py='xl'>
        {/* Header */}
        <Group justify='space-between' align='flex-start'>
          <Stack gap='xs'>
            <Title order={1}>Ustawienia</Title>
            <Text size='lg' c='dimmed'>
              Konfiguruj aplikację według swoich potrzeb
            </Text>
          </Stack>
        </Group>

        {/* Settings Sections */}
        <Stack gap='lg'>
          {/* Wygląd i interfejs */}
          <Card shadow='sm' padding='lg' radius='md' withBorder>
            <Stack gap='md'>
              <Group align='center' gap='sm'>
                <IconPalette size={20} color={currentPalette.primary} />
                <Text fw={600} size='lg'>
                  Wygląd i interfejs
                </Text>
              </Group>

              <Divider />

              <ThemeSelector />
            </Stack>
          </Card>

          {/* SMS Settings */}
          <Card shadow='sm' padding='lg' radius='md' withBorder>
            <Stack gap='md'>
              <Group align='center' gap='sm'>
                <IconMessage size={20} color={currentPalette.accent} />
                <Text fw={600} size='lg'>
                  Przypomnienia SMS
                </Text>
              </Group>

              <Divider />

              <Stack gap='md'>
                <TextInput
                  label='Nazwa gabinetu'
                  placeholder='Gabinet Psychologiczny'
                  value={practitionerName}
                  onChange={e => setPractitionerName(e.target.value)}
                  description='Nazwa wyświetlana w wiadomościach SMS'
                />

                <Select
                  label='Tytuł zawodowy'
                  placeholder='Wybierz tytuł'
                  value={practitionerTitle}
                  onChange={value => setPractitionerTitle(value || 'mgr')}
                  data={[
                    { value: 'mgr', label: 'mgr' },
                    { value: 'dr', label: 'dr' },
                    { value: 'dr hab.', label: 'dr hab.' },
                    { value: 'prof.', label: 'prof.' },
                  ]}
                  description='Tytuł używany w wiadomościach SMS'
                />

                <Divider variant='dashed' />

                {/* Collapsible Templates Section */}
                <Stack gap='xs'>
                  <Button
                    variant='subtle'
                    leftSection={templatesOpened ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
                    onClick={toggleTemplates}
                    style={{ alignSelf: 'flex-start', padding: 0 }}
                    color={currentPalette.primary}
                  >
                    <Text size='sm' fw={500}>
                      Szablony wiadomości SMS
                    </Text>
                  </Button>
                  
                  <Collapse in={templatesOpened}>
                    <SMSTemplateManager />
                  </Collapse>
                </Stack>
              </Stack>
            </Stack>
          </Card>
          
          {/* Ustawienia wizyt */}
          <Card shadow='sm' padding='lg' radius='md' withBorder>
            <Stack gap='md'>
              <Group align='center' gap='sm'>
                <IconClock size={20} color={currentPalette.primary} />
                <Text fw={600} size='lg'>
                  Ustawienia wizyt
                </Text>
              </Group>

              <Divider />

              <Stack gap='md'>
                <NumberInput
                  label='Domyślny czas trwania wizyty (minuty)'
                  placeholder='60'
                  value={defaultAppointmentDuration}
                  onChange={value => setDefaultAppointmentDuration(Number(value) || 60)}
                  min={15}
                  max={300}
                  step={5}
                  description='Domyślny czas trwania nowej wizyty'
                />

                <TagsInput
                  label='Predefiniowane godziny wizyt'
                  placeholder='Dodaj godzinę (np. 14:15)'
                  value={appointmentHours}
                  onChange={setAppointmentHours}
                  description='Te godziny będą dostępne w dropdownie podczas dodawania nowej wizyty'
                  clearable
                />
                <Text size='xs' c='dimmed'>
                  Wpisz godzinę w formacie HH:mm i naciśnij Enter, aby dodać.
                </Text>
              </Stack>

              <Divider variant='dashed' />

              <AppointmentTypesManager />
            </Stack>
          </Card>

          {/* Aplikacja i dane */}
          <Card shadow='sm' padding='lg' radius='md' withBorder>
            <Stack gap='md'>
              <Group align='center' gap='sm'>
                <IconDatabase size={20} color={currentPalette.primary} />
                <Text fw={600} size='lg'>
                  Aplikacja i dane
                </Text>
              </Group>

              <Divider />

              {/* Demo Data Section */}
              <Group justify='space-between' align='flex-start'>
                <Stack gap='xs' style={{ flex: 1 }}>
                  <Text fw={500}>Dodaj dane demonstracyjne</Text>
                  <Text size='sm' c='dimmed'>
                    Dodaj przykładowych pacjentów do testowania aplikacji
                  </Text>
                </Stack>
                <Button
                  leftSection={<IconTestPipe size={16} />}
                  variant='light'
                  color={currentPalette.primary}
                  size='sm'
                  onClick={handleAddDemoData}
                >
                  Dodaj demo
                </Button>
              </Group>

              <Divider variant='dashed' />

              {/* Export Data Section */}
              <Group justify='space-between' align='flex-start'>
                <Stack gap='xs' style={{ flex: 1 }}>
                  <Text fw={500}>Eksport danych</Text>
                  <Text size='sm' c='dimmed'>
                    Pobierz kopię zapasową wszystkich danych
                  </Text>
                </Stack>
                <Button
                  leftSection={<IconDownload size={16} />}
                  variant='light'
                  color={utilityColors.success}
                  size='sm'
                  onClick={() => {
                    // TODO: Implementacja eksportu danych
                    console.log('Eksport danych...');
                  }}
                >
                  Eksportuj
                </Button>
              </Group>

              <Divider variant='dashed' />

              {/* Clear Data Section */}
              <Group justify='space-between' align='flex-start'>
                <Stack gap='xs' style={{ flex: 1 }}>
                  <Text fw={500} c='red'>
                    Usuń wszystkie dane
                  </Text>
                  <Text size='sm' c='dimmed'>
                    Trwale usuń wszystkich pacjentów i wizyty
                  </Text>
                </Stack>
                <Button
                  leftSection={<IconDatabase size={16} />}
                  variant='light'
                  color={utilityColors.error}
                  size='sm'
                  onClick={handleClearAllData}
                >
                  Wyczyść dane
                </Button>
              </Group>
            </Stack>
          </Card>

          {/* Prywatność i bezpieczeństwo */}
          <Card shadow='sm' padding='lg' radius='md' withBorder>
            <Stack gap='md'>
              <Group align='center' gap='sm'>
                <IconShield size={20} color={currentPalette.accent} />
                <Text fw={600} size='lg'>
                  Prywatność i bezpieczeństwo
                </Text>
              </Group>

              <Divider />

              <Stack gap='sm'>
                <Group align='flex-start' gap='sm'>
                  <Text fw={500} size='sm'>
                    Lokalny storage:
                  </Text>
                  <Text size='sm' c='dimmed' style={{ flex: 1 }}>
                    Wszystkie dane są przechowywane lokalnie na twoim
                    urządzeniu.
                  </Text>
                </Group>

                <Group align='flex-start' gap='sm'>
                  <Text fw={500} size='sm'>
                    Offline-first:
                  </Text>
                  <Text size='sm' c='dimmed' style={{ flex: 1 }}>
                    Aplikacja działa bez połączenia z internetem.
                  </Text>
                </Group>

                <Group align='flex-start' gap='sm'>
                  <Text fw={500} size='sm'>
                    HIPAA-compliant:
                  </Text>
                  <Text size='sm' c='dimmed' style={{ flex: 1 }}>
                    Zbudowana z myślą o ochronie danych medycznych.
                  </Text>
                </Group>
              </Stack>
            </Stack>
          </Card>

          {/* Informacje o aplikacji */}
          <Card shadow='sm' padding='lg' radius='md' withBorder>
            <Stack gap='md'>
              <Group align='center' gap='sm'>
                <IconInfoCircle size={20} color={currentPalette.text} />
                <Text fw={600} size='lg'>
                  O aplikacji
                </Text>
              </Group>

              <Divider />

              <Stack gap='sm'>
                <Group justify='space-between' align='center'>
                  <Text fw={500} size='sm'>
                    Wersja aplikacji
                  </Text>
                  <Badge variant='light' color={currentPalette.primary}>
                    1.0.0-BETA
                  </Badge>
                </Group>

                <Group justify='space-between' align='center'>
                  <Text fw={500} size='sm'>
                    Ostatnia aktualizacja
                  </Text>
                  <Text size='sm' c='dimmed'>
                    17.07.2025 01:51:59 AM
                  </Text>
                </Group>
              </Stack>

              <Divider variant='dashed' />

              <Text size='xs' c='dimmed' ta='center'>
                P - Progressive Web App dla psychologów
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
