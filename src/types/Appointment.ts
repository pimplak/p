export interface Appointment {
    id?: number;
    patientId: number;
    date: Date | string;
    duration: number; // in minutes
    status: AppointmentStatus;
    type?: AppointmentType;
    notes?: string;
    reminderSent?: boolean;
    reminderSentAt?: Date | string;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export const AppointmentStatus = {
    SCHEDULED: 'scheduled',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    NO_SHOW: 'no_show',
    RESCHEDULED: 'rescheduled'
} as const;

export type AppointmentStatus = typeof AppointmentStatus[keyof typeof AppointmentStatus];

export const AppointmentType = {
    INITIAL: 'initial',
    FOLLOW_UP: 'follow_up',
    THERAPY: 'therapy',
    CONSULTATION: 'consultation',
    ASSESSMENT: 'assessment'
} as const;

export type AppointmentType = typeof AppointmentType[keyof typeof AppointmentType];

export interface AppointmentWithPatient extends Appointment {
    patient?: {
        firstName: string;
        lastName: string;
        phone?: string;
    };
} 