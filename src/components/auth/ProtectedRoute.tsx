import { Center, Loader } from '@mantine/core';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { session, loading } = useAuthStore();
  const location = useLocation();

  if (loading) {
    return (
      <Center style={{ height: '100vh' }}>
        <Loader size='lg' />
      </Center>
    );
  }

  if (!session) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
