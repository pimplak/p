import {
  Alert,
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
  PasswordInput,
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
  IconLanguage,
  IconUser,
} from '@tabler/icons-react';
import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { AppointmentTypesManager } from '../components/AppointmentTypesManager';
import { SMSTemplateManager } from '../components/SMSTemplateManager';
import { ThemeSelector } from '../components/ThemeSelector';
import { useTheme } from '../hooks/useTheme';
import { useAppointmentStore } from '../stores/useAppointmentStore';
import { useAuthStore } from '../stores/useAuthStore';
import { usePatientStore } from '../stores/usePatientStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import { insertSampleData, clearAllData } from '../utils/sampleData';

function CollapsibleSection({ icon, title, children, defaultOpen = true }: { icon: ReactNode; title: string; children: ReactNode; defaultOpen?: boolean }) {
  const [opened, { toggle }] = useDisclosure(defaultOpen);
  const { currentPalette } = useTheme();

  return (
    <Card shadow='sm' padding='lg' radius='md' withBorder>
      <Stack gap='md'>
        <Group
          align='center'
          gap='sm'
          onClick={toggle}
          style={{ cursor: 'pointer', userSelect: 'none' }}
        >
          {icon}
          <Text fw={600} size='lg' style={{ flex: 1 }}>
            {title}
          </Text>
          {opened ? (
            <IconChevronDown size={18} style={{ color: `${currentPalette.text}50` }} />
          ) : (
            <IconChevronRight size={18} style={{ color: `${currentPalette.text}50` }} />
          )}
        </Group>

        <Collapse in={opened}>
          <Stack gap='md'>
            <Divider />
            {children}
          </Stack>
        </Collapse>
      </Stack>
    </Card>
  );
}

function Settings() {
  const { t, i18n } = useTranslation();
  const { user, actionLoading, updateEmail, updatePassword } = useAuthStore();
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
    language,
    setLanguage,
  } = useSettingsStore();
  const { currentPalette, utilityColors } = useTheme();
  const [templatesOpened, { toggle: toggleTemplates }] = useDisclosure(false);

  // Account state
  const [newEmail, setNewEmail] = useState('');
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleChangeEmail = async () => {
    if (!newEmail) return;
    try {
      await updateEmail(newEmail);
      setEmailSuccess(true);
      setNewEmail('');
    } catch {
      notifications.show({
        color: 'red',
        title: t('common.error'),
        message: t('auth.account.errorGeneric'),
      });
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordError(t('auth.account.errorPasswordMismatch'));
      return;
    }
    setPasswordError(null);
    try {
      await updatePassword(newPassword);
      setNewPassword('');
      setConfirmPassword('');
      notifications.show({
        color: 'green',
        title: t('common.success'),
        message: t('auth.account.changePasswordSuccess'),
      });
    } catch {
      notifications.show({
        color: 'red',
        title: t('common.error'),
        message: t('auth.account.errorGeneric'),
      });
    }
  };

  const handleLanguageChange = (newLanguage: string | null) => {
    if (newLanguage && (newLanguage === 'pl' || newLanguage === 'en')) {
      setLanguage(newLanguage);
      i18n.changeLanguage(newLanguage);
    }
  };

  const handleAddDemoData = async () => {
    try {
      const success = await insertSampleData();
      if (success) {
        notifications.show({
          title: t('common.success'),
          message: t('settings.data.demo.success'),
          color: 'green',
        });
        fetchPatients();
        fetchAppointments();
      } else {
        notifications.show({
          title: t('common.info'),
          message: t('settings.data.demo.exists'),
          color: 'yellow',
        });
      }
    } catch {
      notifications.show({
        title: t('common.error'),
        message: t('settings.data.demo.error'),
        color: 'red',
      });
    }
  };

  const handleClearAllData = async () => {
    try {
      await clearAllData();
      notifications.show({
        title: t('common.success'),
        message: t('settings.data.clear.success'),
        color: 'green',
      });
      fetchPatients();
      fetchAppointments();
    } catch {
      notifications.show({
        title: t('common.error'),
        message: t('settings.data.clear.error'),
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
            <Title order={1}>{t('settings.title')}</Title>
            <Text size='lg' c='dimmed'>
              {t('settings.subtitle')}
            </Text>
          </Stack>
        </Group>

        {/* Settings Sections */}
        <Stack gap='lg'>
          {/* Account */}
          <CollapsibleSection
            icon={<IconUser size={20} color={currentPalette.primary} />}
            title={t('auth.account.title')}
          >
              {/* Account info */}
              <Stack gap={4}>
                <Text size='sm' c='dimmed'>
                  {t('auth.account.emailLabel')}
                </Text>
                <Text fw={600}>{user?.email}</Text>
              </Stack>

              <Divider variant='dashed' />

              {/* Change email */}
              <Stack gap='sm'>
                <Text fw={500}>{t('auth.account.changeEmailTitle')}</Text>
                {emailSuccess && (
                  <Alert color='blue'>
                    {t('auth.account.changeEmailSuccess', { email: newEmail || user?.email })}
                  </Alert>
                )}
                <Group align='flex-end' gap='sm'>
                  <TextInput
                    style={{ flex: 1 }}
                    label={t('auth.account.newEmailLabel')}
                    type='email'
                    value={newEmail}
                    onChange={(e) => { setNewEmail(e.target.value); setEmailSuccess(false); }}
                  />
                  <Button loading={actionLoading} onClick={() => void handleChangeEmail()}>
                    {t('auth.account.changeEmailSubmit')}
                  </Button>
                </Group>
              </Stack>

              <Divider variant='dashed' />

              {/* Change password */}
              <Stack gap='sm'>
                <Text fw={500}>{t('auth.account.changePasswordTitle')}</Text>
                <PasswordInput
                  label={t('auth.account.newPasswordLabel')}
                  autoComplete='new-password'
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setPasswordError(null); }}
                  styles={{
                    input: { color: 'var(--mantine-color-text)' },
                  }}
                />
                <PasswordInput
                  label={t('auth.account.confirmPasswordLabel')}
                  autoComplete='new-password'
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setPasswordError(null); }}
                  error={passwordError}
                  styles={{
                    input: { color: 'var(--mantine-color-text)' },
                  }}
                />
                <Button
                  style={{ alignSelf: 'flex-start' }}
                  loading={actionLoading}
                  onClick={() => void handleChangePassword()}
                >
                  {t('auth.account.changePasswordSubmit')}
                </Button>
              </Stack>
          </CollapsibleSection>

          {/* Wygląd i interfejs */}
          <CollapsibleSection
            icon={<IconPalette size={20} color={currentPalette.primary} />}
            title={t('settings.appearance.title')}
          >
              <ThemeSelector />

              <Divider variant='dashed' />

              {/* Language Selector */}
              <Stack gap='xs'>
                <Group align='center' gap='sm'>
                  <IconLanguage size={20} color={currentPalette.accent} />
                  <Text fw={600} size='md'>
                    {t('settings.language.title')}
                  </Text>
                </Group>
                <Select
                  label={t('settings.language.label')}
                  description={t('settings.language.description')}
                  value={language}
                  onChange={handleLanguageChange}
                  data={[
                    { value: 'pl', label: t('settings.language.polish') },
                    { value: 'en', label: t('settings.language.english') },
                  ]}
                />
              </Stack>
          </CollapsibleSection>

          {/* SMS Settings */}
          <CollapsibleSection
            icon={<IconMessage size={20} color={currentPalette.accent} />}
            title={t('settings.sms.title')}
          >
              <Stack gap='md'>
                <TextInput
                  label={t('settings.sms.practiceName.label')}
                  placeholder={t('settings.sms.practiceName.placeholder')}
                  value={practitionerName}
                  onChange={e => setPractitionerName(e.target.value)}
                  description={t('settings.sms.practiceName.description')}
                />

                <Select
                  label={t('settings.sms.practitionerTitle.label')}
                  placeholder={t('settings.sms.practitionerTitle.placeholder')}
                  value={practitionerTitle}
                  onChange={value => setPractitionerTitle(value || 'NONE')}
                  data={[
                    { value: 'NONE', label: t('settings.sms.practitionerTitle.none') },
                    { value: 'mgr', label: 'mgr' },
                    { value: 'dr', label: 'dr' },
                    { value: 'dr hab.', label: 'dr hab.' },
                    { value: 'prof.', label: 'prof.' },
                  ]}
                  description={t('settings.sms.practitionerTitle.description')}
                />

                <Divider variant='dashed' />

                {/* Collapsible Templates Section */}
                <Stack gap='xs'>
                  <Button
                    variant='subtle'
                    leftSection={templatesOpened ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
                    onClick={toggleTemplates}
                    style={{ alignSelf: 'flex-start' }}
                    color={currentPalette.primary}
                    px='sm'
                  >
                    <Text size='sm' fw={500}>
                      {t('settings.sms.templates.title')}
                    </Text>
                  </Button>

                  <Collapse in={templatesOpened}>
                    <SMSTemplateManager />
                  </Collapse>
                </Stack>
              </Stack>
          </CollapsibleSection>

          {/* Ustawienia wizyt */}
          <CollapsibleSection
            icon={<IconClock size={20} color={currentPalette.primary} />}
            title={t('settings.appointments.title')}
          >
              <Stack gap='md'>
                <NumberInput
                  label={t('settings.appointments.duration.label')}
                  placeholder={t('settings.appointments.duration.placeholder')}
                  value={defaultAppointmentDuration}
                  onChange={value => setDefaultAppointmentDuration(Number(value) || 60)}
                  min={15}
                  max={300}
                  step={5}
                  description={t('settings.appointments.duration.description')}
                />

                <TagsInput
                  label={t('settings.appointments.hours.label')}
                  placeholder={t('settings.appointments.hours.placeholder')}
                  value={appointmentHours}
                  onChange={setAppointmentHours}
                  description={t('settings.appointments.hours.description')}
                  clearable
                />
                <Text size='xs' c='dimmed'>
                  {t('settings.appointments.hours.hint')}
                </Text>
              </Stack>

              <Divider variant='dashed' />

              <AppointmentTypesManager />
          </CollapsibleSection>

          {/* Aplikacja i dane */}
          <CollapsibleSection
            icon={<IconDatabase size={20} color={currentPalette.primary} />}
            title={t('settings.data.title')}
            defaultOpen={false}
          >
              {/* Demo Data Section */}
              <Group justify='space-between' align='flex-start'>
                <Stack gap='xs' style={{ flex: 1 }}>
                  <Text fw={500}>{t('settings.data.demo.title')}</Text>
                  <Text size='sm' c='dimmed'>
                    {t('settings.data.demo.description')}
                  </Text>
                </Stack>
                <Button
                  leftSection={<IconTestPipe size={16} />}
                  variant='light'
                  color={currentPalette.primary}
                  size='sm'
                  onClick={handleAddDemoData}
                >
                  {t('settings.data.demo.button')}
                </Button>
              </Group>

              <Divider variant='dashed' />

              {/* Export Data Section */}
              <Group justify='space-between' align='flex-start'>
                <Stack gap='xs' style={{ flex: 1 }}>
                  <Text fw={500}>{t('settings.data.export.title')}</Text>
                  <Text size='sm' c='dimmed'>
                    {t('settings.data.export.description')}
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
                  {t('settings.data.export.button')}
                </Button>
              </Group>

              <Divider variant='dashed' />

              {/* Clear Data Section */}
              <Group justify='space-between' align='flex-start'>
                <Stack gap='xs' style={{ flex: 1 }}>
                  <Text fw={500} c='red'>
                    {t('settings.data.clear.title')}
                  </Text>
                  <Text size='sm' c='dimmed'>
                    {t('settings.data.clear.description')}
                  </Text>
                </Stack>
                <Button
                  leftSection={<IconDatabase size={16} />}
                  variant='light'
                  color={utilityColors.error}
                  size='sm'
                  onClick={handleClearAllData}
                >
                  {t('settings.data.clear.button')}
                </Button>
              </Group>
          </CollapsibleSection>

          {/* Prywatność i bezpieczeństwo */}
          <CollapsibleSection
            icon={<IconShield size={20} color={currentPalette.accent} />}
            title={t('settings.privacy.title')}
            defaultOpen={false}
          >
              <Stack gap='sm'>
                <Group align='flex-start' gap='sm'>
                  <Text fw={500} size='sm'>
                    {t('settings.privacy.localStorage.title')}
                  </Text>
                  <Text size='sm' c='dimmed' style={{ flex: 1 }}>
                    {t('settings.privacy.localStorage.description')}
                  </Text>
                </Group>

                <Group align='flex-start' gap='sm'>
                  <Text fw={500} size='sm'>
                    {t('settings.privacy.offline.title')}
                  </Text>
                  <Text size='sm' c='dimmed' style={{ flex: 1 }}>
                    {t('settings.privacy.offline.description')}
                  </Text>
                </Group>

                <Group align='flex-start' gap='sm'>
                  <Text fw={500} size='sm'>
                    {t('settings.privacy.hipaa.title')}
                  </Text>
                  <Text size='sm' c='dimmed' style={{ flex: 1 }}>
                    {t('settings.privacy.hipaa.description')}
                  </Text>
                </Group>
              </Stack>
          </CollapsibleSection>

          {/* Informacje o aplikacji */}
          <CollapsibleSection
            icon={<IconInfoCircle size={20} color={currentPalette.text} />}
            title={t('settings.about.title')}
            defaultOpen={false}
          >
              <Stack gap='sm'>
                <Group justify='space-between' align='center'>
                  <Text fw={500} size='sm'>
                    {t('settings.about.version')}
                  </Text>
                  <Badge variant='light' color={currentPalette.primary}>
                    1.0.0-BETA
                  </Badge>
                </Group>

                <Group justify='space-between' align='center'>
                  <Text fw={500} size='sm'>
                    {t('settings.about.lastUpdate')}
                  </Text>
                  <Text size='sm' c='dimmed'>
                    11.03.2026 03:51:59 AM
                  </Text>
                </Group>
              </Stack>

              <Divider variant='dashed' />

              <Text size='xs' c='dimmed' ta='center'>
                {t('settings.about.description')}
                <br />
                {t('settings.about.tagline')}
              </Text>
          </CollapsibleSection>
        </Stack>
      </Stack>
    </Container>
  );
}

export default Settings;
