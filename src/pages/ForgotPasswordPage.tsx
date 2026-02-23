import { Alert, Anchor, Button, Center, Paper, Stack, Text, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconInfoCircle } from '@tabler/icons-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const { actionLoading, sendPasswordReset } = useAuthStore();
  const [success, setSuccess] = useState(false);

  const form = useForm({
    initialValues: { email: '' },
    validate: {
      email: (v) => (/^\S+@\S+\.\S+$/.test(v) ? null : t('errors.invalidEmail')),
    },
  });

  const handleSubmit = async (values: { email: string }) => {
    try {
      await sendPasswordReset(values.email);
      setSuccess(true);
    } catch {
      form.setErrors({ email: t('auth.forgotPassword.errorGeneric') });
    }
  };

  return (
    <Center style={{ minHeight: '100vh', padding: '16px' }}>
      <Paper w={400} p='xl' radius='md' withBorder>
        <Stack gap='md'>
          <Stack gap={4}>
            <Title order={2}>{t('auth.forgotPassword.title')}</Title>
            <Text c='dimmed' size='sm'>
              {t('auth.forgotPassword.subtitle')}
            </Text>
          </Stack>

          {success ? (
            <Alert icon={<IconInfoCircle size={16} />} color='blue' title={t('auth.forgotPassword.successTitle')}>
              {t('auth.forgotPassword.successMessage')}
            </Alert>
          ) : (
            <form onSubmit={form.onSubmit((v) => void handleSubmit(v))}>
              <Stack gap='sm'>
                <TextInput
                  label={t('auth.forgotPassword.emailLabel')}
                  type='email'
                  autoComplete='email'
                  {...form.getInputProps('email')}
                />
                <Button type='submit' fullWidth loading={actionLoading} mt='xs'>
                  {t('auth.forgotPassword.submit')}
                </Button>
              </Stack>
            </form>
          )}

          <Text size='sm' ta='center' c='dimmed'>
            <Anchor component={Link} to='/login' size='sm'>
              {t('auth.forgotPassword.backToLogin')}
            </Anchor>
          </Text>
        </Stack>
      </Paper>
    </Center>
  );
}
