import { LoadingOverlay, Container } from '@mantine/core';
import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './Layout';

// Lazy load all page components for code splitting
const Dashboard = lazy(() => import('../pages/Dashboard').then(m => ({ default: m.Dashboard })));
const PatientsPage = lazy(() => import('../pages/PatientsPage').then(m => ({ default: m.PatientsPage })));
const PatientProfile = lazy(() => import('./PatientProfile').then(m => ({ default: m.PatientProfile })));
const Calendar = lazy(() => import('../pages/Calendar').then(m => ({ default: m.Calendar })));
const Settings = lazy(() => import('../pages/Settings').then(m => ({ default: m.Settings })));

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
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/patients" element={<PatientsPage />} />
          <Route path="/patients/:id" element={<PatientProfile />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Suspense>
    </Layout>
  );
} 