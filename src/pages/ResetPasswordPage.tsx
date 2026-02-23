import { Alert, Anchor, Button, Center, Loader, Paper, PasswordInput, Stack, Text, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconAlertCircle } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const { session, loading, actionLoading, updatePassword } = useAuthStore();
  const navigate = useNavigate();

  const form = useForm({
    initialValues: { password: '', confirm: '' },
    validate: {
      password: (v) => (v.length >= 6 ? null : t('auth.resetPassword.errorGeneric')),
      confirm: (v, values) => (v === values.password ? null : t('auth.resetPassword.errorPasswordMismatch')),
    },
  });

  const handleSubmit = async (values: { password: string }) => {
    try {
      await updatePassword(values.password);
      notifications.show({
        color: 'green',
        title: t('common.success'),
        message: t('auth.resetPassword.successMessage'),
      });
      navigate('/', { replace: true });
    } catch {
      notifications.show({
        color: 'red',
        title: t('common.error'),
        message: t('auth.resetPassword.errorGeneric'),
      });
    }
  };

  if (loading) {
    return (
      <Center style={{ minHeight: '100vh' }}>
        <Loader />
      </Center>
    );
  }

  if (!session) {
    return (
      <Center style={{ minHeight: '100vh', padding: '16px' }}>
        <Paper w={400} p='xl' radius='md' withBorder>
          <Stack gap='md'>
            <Alert icon={<IconAlertCircle size={16} />} color='red' title={t('auth.resetPassword.invalidLink')}>
              {t('auth.resetPassword.invalidLink')}
            </Alert>
            <Text size='sm' ta='center' c='dimmed'>
              <Anchor component={Link} to='/forgot-password' size='sm'>
                {t('auth.resetPassword.backToForgot')}
              </Anchor>
            </Text>
          </Stack>
        </Paper>
      </Center>
    );
  }

  return (
    <Center style={{ minHeight: '100vh', padding: '16px' }}>
      <Paper w={400} p='xl' radius='md' withBorder>
        <Stack gap='md'>
          <Stack gap={4}>
            <Title order={2}>{t('auth.resetPassword.title')}</Title>
            <Text c='dimmed' size='sm'>
              {t('auth.resetPassword.subtitle')}
            </Text>
          </Stack>

          <form onSubmit={form.onSubmit((v) => void handleSubmit(v))}>
            <Stack gap='sm'>
              <PasswordInput
                label={t('auth.resetPassword.passwordLabel')}
                autoComplete='new-password'
                {...form.getInputProps('password')}
              />
              <PasswordInput
                label={t('auth.resetPassword.confirmPasswordLabel')}
                autoComplete='new-password'
                {...form.getInputProps('confirm')}
              />
              <Button type='submit' fullWidth loading={actionLoading} mt='xs'>
                {t('auth.resetPassword.submit')}
              </Button>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Center>
  );
}
