import {
  Alert,
  Anchor,
  Button,
  Center,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Tabs,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconInfoCircle } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';

export default function LoginPage() {
  const { t } = useTranslation();
  const { session, loading, actionLoading, signIn, sendMagicLink, clearError } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: Location })?.from?.pathname ?? '/';

  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const passwordForm = useForm({
    initialValues: { email: '', password: '' },
    validate: {
      email: (v) => (/^\S+@\S+\.\S+$/.test(v) ? null : t('auth.login.emailLabel')),
      password: (v) => (v.length > 0 ? null : t('errors.required')),
    },
  });

  const magicForm = useForm({
    initialValues: { email: '' },
    validate: {
      email: (v) => (/^\S+@\S+\.\S+$/.test(v) ? null : t('auth.login.emailLabel')),
    },
  });

  useEffect(() => {
    clearError();
  }, [clearError]);

  if (!loading && session) {
    return <Navigate to={from} replace />;
  }

  const handlePasswordSubmit = async (values: { email: string; password: string }) => {
    try {
      await signIn(values.email, values.password);
      navigate(from, { replace: true });
    } catch {
      notifications.show({
        color: 'red',
        title: t('common.error'),
        message: t('auth.login.errorGeneric'),
      });
    }
  };

  const handleMagicLinkSubmit = async (values: { email: string }) => {
    try {
      await sendMagicLink(values.email);
      setMagicLinkSent(true);
    } catch {
      notifications.show({
        color: 'red',
        title: t('common.error'),
        message: t('auth.login.errorGeneric'),
      });
    }
  };

  return (
    <Center style={{ minHeight: '100vh', padding: '16px' }}>
      <Paper w={400} p='xl' radius='md' withBorder>
        <Stack gap='md'>
          <Stack gap={4}>
            <Title order={2}>{t('auth.login.title')}</Title>
            <Text c='dimmed' size='sm'>
              {t('auth.login.subtitle')}
            </Text>
          </Stack>

          <Tabs defaultValue='password'>
            <Tabs.List>
              <Tabs.Tab value='password'>{t('auth.login.tabPassword')}</Tabs.Tab>
              <Tabs.Tab value='magic'>{t('auth.login.tabMagicLink')}</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value='password' pt='md'>
              <form onSubmit={passwordForm.onSubmit((v) => void handlePasswordSubmit(v))}>
                <Stack gap='sm'>
                  <TextInput
                    label={t('auth.login.emailLabel')}
                    type='email'
                    autoComplete='email'
                    {...passwordForm.getInputProps('email')}
                  />
                  <PasswordInput
                    label={t('auth.login.passwordLabel')}
                    autoComplete='current-password'
                    {...passwordForm.getInputProps('password')}
                  />
                  <Group justify='flex-end'>
                    <Anchor component={Link} to='/forgot-password' size='xs'>
                      {t('auth.login.forgotPassword')}
                    </Anchor>
                  </Group>
                  <Button type='submit' fullWidth loading={actionLoading} mt='xs'>
                    {t('auth.login.submitPassword')}
                  </Button>
                </Stack>
              </form>
            </Tabs.Panel>

            <Tabs.Panel value='magic' pt='md'>
              {magicLinkSent ? (
                <Alert icon={<IconInfoCircle size={16} />} color='blue' title={t('auth.login.magicLinkSent')}>
                  {t('auth.login.magicLinkDescription')}
                </Alert>
              ) : (
                <form onSubmit={magicForm.onSubmit((v) => void handleMagicLinkSubmit(v))}>
                  <Stack gap='sm'>
                    <TextInput
                      label={t('auth.login.emailLabel')}
                      type='email'
                      autoComplete='email'
                      {...magicForm.getInputProps('email')}
                    />
                    <Button type='submit' fullWidth loading={actionLoading} mt='xs'>
                      {t('auth.login.submitMagicLink')}
                    </Button>
                  </Stack>
                </form>
              )}
            </Tabs.Panel>
          </Tabs>

          <Text size='sm' ta='center' c='dimmed'>
            {t('auth.login.orRegister')}{' '}
            <Anchor component={Link} to='/register' size='sm'>
              {t('auth.login.registerLink')}
            </Anchor>
          </Text>
        </Stack>
      </Paper>
    </Center>
  );
}
