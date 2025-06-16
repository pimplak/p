import Dexie, { type Table } from 'dexie';
import type { Patient } from '../types/Patient';
import type { Appointment } from '../types/Appointment';

export class PsychFlowDB extends Dexie {
    patients!: Table<Patient>;
    appointments!: Table<Appointment>;

    constructor() {
        super('PsychFlowDB');

        this.version(1).stores({
            patients: '++id, firstName, lastName, email, phone, createdAt, updatedAt',
            appointments: '++id, patientId, date, status, createdAt, updatedAt'
        });

        // Add hooks for automatic timestamps
        this.patients.hook('creating', function (_, obj) {
            obj.createdAt = new Date();
            obj.updatedAt = new Date();
        });

        this.patients.hook('updating', function (modifications: any) {
            modifications.updatedAt = new Date();
        });

        this.appointments.hook('creating', function (_, obj) {
            obj.createdAt = new Date();
            obj.updatedAt = new Date();
        });

        this.appointments.hook('updating', function (modifications: any) {
            modifications.updatedAt = new Date();
        });
    }
}

export const db = new PsychFlowDB(); 