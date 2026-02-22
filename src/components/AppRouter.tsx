import { LoadingOverlay, Container } from '@mantine/core';
import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { AppLayout } from './layout/AppLayout';

// Lazy load all page components for code splitting
const Dashboard = lazy(() => import('../pages/Dashboard'));
const PatientsPage = lazy(() => import('../pages/PatientsPage'));
const PatientProfile = lazy(() => import('./PatientProfile'));
const Calendar = lazy(() => import('../pages/Calendar'));
const Settings = lazy(() => import('../pages/Settings'));
const Notes = lazy(() => import('../pages/Notes'));
const Analytics = lazy(() => import('../pages/Analytics'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));
const AuthCallbackPage = lazy(() => import('../pages/AuthCallbackPage'));

// Loading fallback component
function PageLoader() {
  return (
    <Container fluid style={{ position: 'relative', minHeight: '200px' }}>
      <LoadingOverlay visible={true} />
    </Container>
  );
}

function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path='/' element={<Dashboard />} />
            <Route path='/patients' element={<PatientsPage />} />
            <Route path='/patients/:id' element={<PatientProfile />} />
            <Route path='/calendar' element={<Calendar />} />
            <Route path='/notes' element={<Notes />} />
            <Route path='/analytics' element={<Analytics />} />
            <Route path='/settings' element={<Settings />} />
          </Routes>
        </Suspense>
      </AppLayout>
    </ProtectedRoute>
  );
}

export function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/auth/callback' element={<AuthCallbackPage />} />
        <Route path='/*' element={<ProtectedLayout />} />
      </Routes>
    </Suspense>
  );
}
