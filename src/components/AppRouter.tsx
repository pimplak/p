import { LoadingOverlay, Container } from '@mantine/core';
import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppLayout } from './layout/AppLayout';

// Lazy load all page components for code splitting
const Dashboard = lazy(() => import('../pages/Dashboard'));
const PatientsPage = lazy(() => import('../pages/PatientsPage'));
const PatientProfile = lazy(() => import('./PatientProfile'));
const Calendar = lazy(() => import('../pages/Calendar'));
const Settings = lazy(() => import('../pages/Settings'));
const Notes = lazy(() => import('../pages/Notes'));
const Analytics = lazy(() => import('../pages/Analytics'));

// Loading fallback component
function PageLoader() {
  return (
    <Container fluid style={{ position: 'relative', minHeight: '200px' }}>
      <LoadingOverlay visible={true} />
    </Container>
  );
}

export function AppRouter() {
  return (
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
  );
}
