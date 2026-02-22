import {
  Alert,
  Anchor,
  Button,
  Center,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';

export default function RegisterPage() {
  const { t } = useTranslation();
  const { actionLoading, signUp, clearError } = useAuthStore();
  const [registered, setRegistered] = useState(false);

  const form = useForm({
    initialValues: { email: '', password: '', confirmPassword: '' },
    validate: {
      email: (v) => (/^\S+@\S+\.\S+$/.test(v) ? null : t('errors.invalidEmail')),
      password: (v) => (v.length >= 6 ? null : t('errors.required')),
      confirmPassword: (v, values) =>
        v === values.password ? null : t('auth.register.errorPasswordMismatch'),
    },
  });

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      await signUp(values.email, values.password);
      setRegistered(true);
    } catch {
      notifications.show({
        color: 'red',
        title: t('common.error'),
        message: t('auth.register.errorGeneric'),
      });
    }
  };

  return (
    <Center style={{ minHeight: '100vh', padding: '16px' }}>
      <Paper w={400} p='xl' radius='md' withBorder>
        <Stack gap='md'>
          <Title order={2}>{t('auth.register.title')}</Title>

          {registered ? (
            <Alert icon={<IconCheck size={16} />} color='green' title={t('auth.register.successTitle')}>
              {t('auth.register.successMessage')}
            </Alert>
          ) : (
            <form onSubmit={form.onSubmit((v) => void handleSubmit(v))}>
              <Stack gap='sm'>
                <TextInput
                  label={t('auth.register.emailLabel')}
                  type='email'
                  autoComplete='email'
                  {...form.getInputProps('email')}
                />
                <PasswordInput
                  label={t('auth.register.passwordLabel')}
                  autoComplete='new-password'
                  {...form.getInputProps('password')}
                />
                <PasswordInput
                  label={t('auth.register.confirmPasswordLabel')}
                  autoComplete='new-password'
                  {...form.getInputProps('confirmPassword')}
                />
                <Button type='submit' fullWidth loading={actionLoading} mt='xs'>
                  {t('auth.register.submit')}
                </Button>
              </Stack>
            </form>
          )}

          <Text size='sm' ta='center' c='dimmed'>
            <Anchor component={Link} to='/login' size='sm'>
              {t('auth.register.loginLink')}
            </Anchor>
          </Text>
        </Stack>
      </Paper>
    </Center>
  );
}
