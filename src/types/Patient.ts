import type { PatientStatus } from '../constants/status';

export interface Patient {
  id?: number;
  firstName: string;
  lastName: string;
  nazwa?: string; // Alternatywna nazwa wyświetlana zamiast imienia i nazwiska
  email?: string;
  phone?: string;
  birthDate?: Date | string;
  address?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  status: PatientStatus;
  tags?: string[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface PatientWithAppointments extends Patient {
  appointmentCount: number;
  lastAppointment?: Date | string;
  nextAppointment?: Date | string;
}

export interface Note {
  id?: number;
  patientId?: number;
  sessionId?: number;
  type: 'soap' | 'general' | 'assessment';
  title?: string;
  pinned?: boolean;
  subjective?: string;
  objective?: string;
  assessment?: string;
  plan?: string;
  content?: string; // For general notes
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Goal {
  id?: number;
  patientId: number;
  description: string;
  status: import('../constants/status').GoalStatus;
  targetDate?: Date | string;
  progress: number; // 0-100%
  notes?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}
