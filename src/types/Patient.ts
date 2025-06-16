export interface Patient {
    id?: number;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    birthDate?: Date | string;
    address?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
    notes?: string;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export interface PatientWithAppointments extends Patient {
    appointmentCount: number;
    lastAppointment?: Date | string;
    nextAppointment?: Date | string;
} 