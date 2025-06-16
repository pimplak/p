import { Routes, Route } from 'react-router-dom';
import { Layout } from './Layout';
import { Dashboard } from '../pages/Dashboard';
import { Patients } from '../pages/Patients';
import { Calendar } from '../pages/Calendar';

export function AppRouter() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/calendar" element={<Calendar />} />
      </Routes>
    </Layout>
  );
} 