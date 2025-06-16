import { Routes, Route } from 'react-router-dom';
import { Layout } from './Layout';
import { Dashboard } from '../pages/Dashboard';
import { PatientsPage } from '../pages/PatientsPage';
import { PatientProfile } from './PatientProfile';
import { Calendar } from '../pages/Calendar';
import { Settings } from '../pages/Settings';

export function AppRouter() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/patients" element={<PatientsPage />} />
        <Route path="/patients/:id" element={<PatientProfile />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  );
} 