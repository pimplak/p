import { Center, Loader, Stack, Text } from '@mantine/core';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';

export default function AuthCallbackPage() {
  const { t } = useTranslation();
  const { session, loading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      navigate(session ? '/' : '/login', { replace: true });
    }
  }, [loading, session, navigate]);

  return (
    <Center style={{ minHeight: '100vh' }}>
      <Stack align='center' gap='md'>
        <Loader size='lg' />
        <Text c='dimmed'>{t('auth.callback.verifying')}</Text>
      </Stack>
    </Center>
  );
}
