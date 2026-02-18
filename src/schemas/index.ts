import { z } from 'zod';
import {
  PATIENT_STATUS,
  GOAL_STATUS,
  APPOINTMENT_STATUS,
} from '../constants/status';

// Patient Schema - jedno źródło prawdy
export const PatientSchema = z.object({
  id: z.number().optional(),
  firstName: z
    .string()
    .min(1, 'Imię jest wymagane')
    .max(50, 'Imię może mieć maksymalnie 50 znaków'),
  lastName: z
    .string()
    .min(1, 'Nazwisko jest wymagane')
    .max(50, 'Nazwisko może mieć maksymalnie 50 znaków'),
  nazwa: z
    .string()
    .max(100, 'Nazwa może mieć maksymalnie 100 znaków')
    .optional(),
  email: z
    .string()
    .email('Nieprawidłowy format email')
    .optional()
    .or(z.literal('')),
  phone: z.string().optional(),
  birthDate: z.union([z.date(), z.string()]).optional(),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  status: z
    .enum([PATIENT_STATUS.ACTIVE, PATIENT_STATUS.ARCHIVED])
    .default(PATIENT_STATUS.ACTIVE),
  tags: z.array(z.string()).optional().default([]),
  createdAt: z.union([z.date(), z.string()]),
  updatedAt: z.union([z.date(), z.string()]),
});

// Formularz Patient - bez id i timestampów
export const PatientFormSchema = PatientSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Note Schema
export const NoteSchema = z.object({
  id: z.number().optional(),
  patientId: z.number().optional(),
  sessionId: z.number().optional(),
  type: z.enum(['soap', 'general', 'assessment']),
  title: z.string().max(100, 'Tytuł może mieć maksymalnie 100 znaków').optional(),
  pinned: z.boolean().default(false),
  subjective: z.string().optional(),
  objective: z.string().optional(),
  assessment: z.string().optional(),
  plan: z.string().optional(),
  content: z.string().optional(), // For general notes
  createdAt: z.union([z.date(), z.string()]),
  updatedAt: z.union([z.date(), z.string()]),
});

// Formularz Note
export const NoteFormSchema = NoteSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Goal Schema
export const GoalSchema = z.object({
  id: z.number().optional(),
  patientId: z.number().min(1, 'ID pacjenta jest wymagane'),
  description: z.string().min(1, 'Opis celu jest wymagany'),
  status: z
    .enum([
      GOAL_STATUS.ACTIVE,
      GOAL_STATUS.COMPLETED,
      GOAL_STATUS.PAUSED,
      GOAL_STATUS.CANCELLED,
    ])
    .default(GOAL_STATUS.ACTIVE),
  targetDate: z.union([z.date(), z.string()]).optional(),
  progress: z.number().min(0).max(100).default(0),
  notes: z.string().optional(),
  createdAt: z.union([z.date(), z.string()]),
  updatedAt: z.union([z.date(), z.string()]),
});

// Formularz Goal
export const GoalFormSchema = GoalSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Appointment Schema
export const AppointmentSchema = z.object({
  id: z.number().optional(),
  patientId: z.number().min(1, 'ID pacjenta jest wymagane'),
  date: z.union([z.date(), z.string()]),
  duration: z.number().min(1, 'Czas trwania musi być większy od 0'),
  status: z.enum([
    APPOINTMENT_STATUS.SCHEDULED,
    APPOINTMENT_STATUS.COMPLETED,
    APPOINTMENT_STATUS.CANCELLED,
    APPOINTMENT_STATUS.NO_SHOW,
    APPOINTMENT_STATUS.RESCHEDULED,
  ]),
  type: z.string().optional(),
  notes: z.string().optional(),
  price: z.number().min(0, 'Cena nie może być ujemna').optional(),
  paymentInfo: z
    .object({
      isPaid: z.boolean().default(false),
      paidAt: z.union([z.date(), z.string()]).optional(),
      paymentMethod: z.enum(['cash', 'card', 'transfer', 'other']).optional(),
      notes: z.string().optional(),
    })
    .optional(),
  reminderSent: z.boolean().optional(),
  rescheduledFromId: z.number().optional(),
  rescheduledToId: z.number().optional(),
  cancelledAt: z.union([z.date(), z.string()]).optional(),
  cancellationReason: z.string().optional(),
  requiresPayment: z.boolean().optional(),
  createdAt: z.union([z.date(), z.string()]),
  updatedAt: z.union([z.date(), z.string()]),
});

// Formularz Appointment - bez id i timestampów
export const AppointmentFormSchema = AppointmentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// PatientWithAppointments Schema - dodaj właściwości do podstawowego Patient
export const PatientWithAppointmentsSchema = PatientSchema.extend({
  appointmentCount: z.number(),
  lastAppointment: z.union([z.date(), z.string()]).optional(),
  nextAppointment: z.union([z.date(), z.string()]).optional(),
});

// Export types inferred from schemas
export type PatientZod = z.infer<typeof PatientSchema>;
export type PatientFormData = z.infer<typeof PatientFormSchema>;
export type NoteZod = z.infer<typeof NoteSchema>;
export type NoteFormData = z.infer<typeof NoteFormSchema>;
export type GoalZod = z.infer<typeof GoalSchema>;
export type GoalFormData = z.infer<typeof GoalFormSchema>;
export type AppointmentZod = z.infer<typeof AppointmentSchema>;
export type AppointmentFormData = z.infer<typeof AppointmentFormSchema>;
export type PatientWithAppointmentsZod = z.infer<
  typeof PatientWithAppointmentsSchema
>;

// Validation helpers
export function validatePatient(data: unknown): PatientZod {
  return PatientSchema.parse(data);
}

export function validatePatientForm(data: unknown): PatientFormData {
  return PatientFormSchema.parse(data);
}

export function validateNote(data: unknown): NoteZod {
  return NoteSchema.parse(data);
}

export function validateNoteForm(data: unknown): NoteFormData {
  return NoteFormSchema.parse(data);
}

export function validateGoal(data: unknown): GoalZod {
  return GoalSchema.parse(data);
}

export function validateGoalForm(data: unknown): GoalFormData {
  return GoalFormSchema.parse(data);
}

export function validateAppointment(data: unknown): AppointmentZod {
  return AppointmentSchema.parse(data);
}

export function validateAppointmentForm(data: unknown): AppointmentFormData {
  return AppointmentFormSchema.parse(data);
}
