export interface Patient {
    id?: number;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    birthDate?: Date;
    address?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface PatientWithAppointments extends Patient {
    appointmentCount: number;
    lastAppointment?: Date;
    nextAppointment?: Date;
} 