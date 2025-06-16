import { z } from 'zod';

// Patient Schema - jedno źródło prawdy
export const PatientSchema = z.object({
    id: z.number().optional(),
    firstName: z.string().min(1, 'Imię jest wymagane').max(50, 'Imię może mieć maksymalnie 50 znaków'),
    lastName: z.string().min(1, 'Nazwisko jest wymagane').max(50, 'Nazwisko może mieć maksymalnie 50 znaków'),
    email: z.string().email('Nieprawidłowy format email').optional().or(z.literal('')),
    phone: z.string().optional(),
    birthDate: z.union([z.date(), z.string()]).optional(),
    address: z.string().optional(),
    emergencyContact: z.string().optional(),
    emergencyPhone: z.string().optional(),
    notes: z.string().optional(),
    createdAt: z.union([z.date(), z.string()]),
    updatedAt: z.union([z.date(), z.string()]),
});

// Formularz Patient - bez id i timestampów
export const PatientFormSchema = PatientSchema.omit({
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
    status: z.enum(['scheduled', 'completed', 'cancelled', 'no_show', 'rescheduled']),
    type: z.enum(['initial', 'follow_up', 'therapy', 'consultation', 'assessment']).optional(),
    notes: z.string().optional(),
    reminderSent: z.boolean().optional(),
    reminderSentAt: z.union([z.date(), z.string()]).optional(),
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
export type AppointmentZod = z.infer<typeof AppointmentSchema>;
export type AppointmentFormData = z.infer<typeof AppointmentFormSchema>;
export type PatientWithAppointmentsZod = z.infer<typeof PatientWithAppointmentsSchema>;

// Validation helpers
export function validatePatient(data: unknown): PatientZod {
    return PatientSchema.parse(data);
}

export function validatePatientForm(data: unknown): PatientFormData {
    return PatientFormSchema.parse(data);
}

export function validateAppointment(data: unknown): AppointmentZod {
    return AppointmentSchema.parse(data);
}

export function validateAppointmentForm(data: unknown): AppointmentFormData {
    return AppointmentFormSchema.parse(data);
} 