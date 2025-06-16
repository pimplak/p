import { db } from './db';
import type { Patient } from '../types/Patient';

export async function addDemoPatients() {
    const demoPatients: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>[] = [
        {
            firstName: 'Anna',
            lastName: 'Kowalska',
            email: 'anna.kowalska@email.com',
            phone: '+48 123 456 789',
            birthDate: '1985-03-15',
            address: 'ul. Floriańska 12, 31-021 Kraków',
            emergencyContact: 'Jan Kowalski',
            emergencyPhone: '+48 987 654 321',
            notes: 'Pacjentka zgłosiła się z problemami lękowymi. Pierwsze spotkanie przebiegło bardzo dobrze.',
            status: 'active',
            tags: ['terapia CBT', 'lęki', 'pierwsza wizyta']
        },
        {
            firstName: 'Piotr',
            lastName: 'Nowak',
            email: 'piotr.nowak@email.com',
            phone: '+48 456 789 123',
            birthDate: '1978-11-22',
            address: 'ul. Grodzka 45, 31-001 Kraków',
            emergencyContact: 'Maria Nowak',
            emergencyPhone: '+48 654 321 987',
            notes: 'Terapia par. Praca z partnerką nad komunikacją w związku.',
            status: 'active',
            tags: ['terapia par', 'komunikacja', 'stały pacjent']
        },
        {
            firstName: 'Magdalena',
            lastName: 'Wiśniewska',
            email: 'magda.wisniewska@email.com',
            phone: '+48 789 123 456',
            birthDate: '1992-07-08',
            address: 'ul. Kazimierza Wielkiego 23, 30-074 Kraków',
            emergencyContact: 'Tomasz Wiśniewski',
            emergencyPhone: '+48 321 987 654',
            notes: 'Młoda mama borykająca się z depresją poporodową. Bardzo motywowana do pracy.',
            status: 'active',
            tags: ['depresja poporodowa', 'młoda mama', 'terapia długoterminowa']
        },
        {
            firstName: 'Tomasz',
            lastName: 'Kaczmarek',
            email: 'tomasz.kaczmarek@email.com',
            phone: '+48 147 258 369',
            birthDate: '1975-12-03',
            address: 'ul. Długa 67, 31-147 Kraków',
            emergencyContact: 'Anna Kaczmarek',
            emergencyPhone: '+48 963 852 741',
            notes: 'Zakończył terapię w zeszłym miesiącu. Bardzo zadowalające postępy w zarządzaniu stresem.',
            status: 'archived',
            tags: ['stress management', 'zakończone', 'sukces terapeutyczny']
        }
    ];

    try {
        for (const patient of demoPatients) {
            await db.patients.add(patient as Patient);
        }
        console.log('Demo patients added successfully!');
        return true;
    } catch (error) {
        console.error('Error adding demo patients:', error);
        return false;
    }
}

export async function clearAllData() {
    try {
        await db.patients.clear();
        await db.appointments.clear();
        await db.notes.clear();
        await db.goals.clear();
        console.log('All data cleared successfully!');
        return true;
    } catch (error) {
        console.error('Error clearing data:', error);
        return false;
    }
} 