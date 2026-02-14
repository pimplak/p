export interface Appointment {
  id?: number;
  patientId: number;
  date: Date | string;
  duration: number; // in minutes
  status: AppointmentStatus;
  type?: AppointmentType;
  notes?: string;
  price?: number; // Cena w złotych
  paymentInfo?: PaymentInfo; // Informacje o płatności
  reminderSent?: boolean;
  reminderSentAt?: Date | string;
  rescheduledFromId?: number;
  rescheduledToId?: number;
  cancelledAt?: Date | string;
  cancellationReason?: string;
  requiresPayment?: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface PaymentInfo {
  isPaid: boolean;
  paidAt?: Date | string;
  paymentMethod?: PaymentMethod;
  notes?: string;
}

export const PaymentMethod = {
  CASH: 'cash',
  CARD: 'card',
  TRANSFER: 'transfer',
  OTHER: 'other',
} as const;

export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

export const AppointmentStatus = {
  SCHEDULED: 'scheduled',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show',
  RESCHEDULED: 'rescheduled',
} as const;

export type AppointmentStatus =
  (typeof AppointmentStatus)[keyof typeof AppointmentStatus];

export type AppointmentType = string;

export interface AppointmentTypeConfig {
  id: string;
  label: string;
  isDefault?: boolean;
}

import type { Patient } from './Patient';

export interface AppointmentWithPatient extends Appointment {
  patient?: Patient;
}
