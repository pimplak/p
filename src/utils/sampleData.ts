import { PATIENT_STATUS } from '../constants/status';
import { AppointmentStatus, AppointmentType } from '../types/Appointment';
import { db } from './db';
import type { Appointment } from '../types/Appointment';
import type { Patient } from '../types/Patient';

const samplePatients: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
        firstName: 'Anna',
        lastName: 'Kowalska',
        email: 'anna.kowalska@email.com',
        phone: '+48 123 456 789',
        birthDate: new Date('1985-03-15'),
        address: 'ul. Kwiatowa 12, 00-001 Warszawa',
        emergencyContact: 'Jan Kowalski',
        emergencyPhone: '+48 987 654 321',
        notes: 'Pacjentka z zaburzeniami lękowymi. Regularne sesje terapii poznawczo-behawioralnej.',
        status: PATIENT_STATUS.ACTIVE
    },
    {
        firstName: 'Michał',
        lastName: 'Nowak',
        email: 'michal.nowak@gmail.com',
        phone: '+48 234 567 890',
        birthDate: new Date('1978-11-22'),
        address: 'ul. Słoneczna 8/15, 02-123 Warszawa',
        emergencyContact: 'Maria Nowak',
        emergencyPhone: '+48 876 543 210',
        notes: 'Terapia par. Problemy komunikacyjne w związku.',
        status: PATIENT_STATUS.ACTIVE
    },
    {
        firstName: 'Katarzyna',
        lastName: 'Wiśniewska',
        email: 'k.wisniewska@outlook.com',
        phone: '+48 345 678 901',
        birthDate: new Date('1992-07-08'),
        address: 'ul. Różana 25, 03-456 Warszawa',
        emergencyContact: 'Tomasz Wiśniewski',
        emergencyPhone: '+48 765 432 109',
        notes: 'Depresja sezonowa. Sesje w okresie jesienno-zimowym.',
        status: PATIENT_STATUS.ACTIVE
    },
    {
        firstName: 'Piotr',
        lastName: 'Zieliński',
        email: 'piotr.zielinski@work.pl',
        phone: '+48 456 789 012',
        birthDate: new Date('1989-01-30'),
        address: 'ul. Leśna 7, 04-789 Warszawa',
        emergencyContact: 'Agnieszka Zielińska',
        emergencyPhone: '+48 654 321 098',
        notes: 'Wypalenie zawodowe. Manager w korporacji. Techniki radzenia sobie ze stresem.',
        status: PATIENT_STATUS.ACTIVE
    },
    {
        firstName: 'Magdalena',
        lastName: 'Dąbrowska',
        email: 'magda.dabrowska@uni.edu.pl',
        phone: '+48 567 890 123',
        birthDate: new Date('1995-12-14'),
        address: 'ul. Akademicka 33, 05-012 Warszawa',
        emergencyContact: 'Robert Dąbrowski',
        emergencyPhone: '+48 543 210 987',
        notes: 'Studentka doktorancka. Problemy z prokrastynacją i motywacją do nauki.',
        status: PATIENT_STATUS.ACTIVE
    },
    {
        firstName: 'Tomasz',
        lastName: 'Kaminski',
        email: 'tomek.kaminski@free.com',
        phone: '+48 678 901 234',
        birthDate: new Date('1982-05-26'),
        address: 'ul. Sportowa 19, 06-345 Warszawa',
        emergencyContact: 'Ewa Kamińska',
        emergencyPhone: '+48 432 109 876',
        notes: 'Uzależnienie behawioralne od gier. Terapia grupowa i indywidualna.',
        status: PATIENT_STATUS.ACTIVE
    },
    {
        firstName: 'Aleksandra',
        lastName: 'Jankowska',
        email: 'aleksandra.jankowska@corp.com',
        phone: '+48 789 012 345',
        birthDate: new Date('1990-08-12'),
        address: 'ul. Biznesowa 44, 07-678 Warszawa',
        emergencyContact: 'Marcin Jankowski',
        emergencyPhone: '+48 321 098 765',
        notes: 'Syndrom impostera. Dyrektorka w start-upie. Praca nad pewnością siebie.',
        status: PATIENT_STATUS.ACTIVE
    },
    {
        firstName: 'Rafał',
        lastName: 'Kowalczyk',
        email: 'rafal.kowalczyk@techno.pl',
        phone: '+48 890 123 456',
        birthDate: new Date('1987-04-18'),
        address: 'ul. Programistów 15, 08-901 Warszawa',
        emergencyContact: 'Joanna Kowalczyk',
        emergencyPhone: '+48 210 987 654',
        notes: 'Problemy ze snem i uzależnienie od pracy. Developer w trybie crunch.',
        status: PATIENT_STATUS.ACTIVE
    },
    {
        firstName: 'Natalia',
        lastName: 'Lewandowska',
        email: 'natalia.lewandowska@med.pl',
        phone: '+48 901 234 567',
        birthDate: new Date('1983-12-03'),
        address: 'ul. Medyczna 28, 09-234 Warszawa',
        emergencyContact: 'Adam Lewandowski',
        emergencyPhone: '+48 109 876 543',
        notes: 'Lekarka z wypaleniem zawodowym. Trauma wtórna po pracy w COVID.',
        status: PATIENT_STATUS.ACTIVE
    },
    {
        firstName: 'Jakub',
        lastName: 'Wójcik',
        email: 'jakub.wojcik@student.edu.pl',
        phone: '+48 012 345 678',
        birthDate: new Date('1999-06-25'),
        address: 'ul. Studencka 67, 10-567 Warszawa',
        emergencyContact: 'Barbara Wójcik',
        emergencyPhone: '+48 098 765 432',
        notes: 'Student medycyny. Ataki paniki przed egzaminami. Perfekcjonizm.',
        status: PATIENT_STATUS.ACTIVE
    },
    {
        firstName: 'Karolina',
        lastName: 'Mazur',
        email: 'karolina.mazur@creative.com',
        phone: '+48 123 456 789',
        birthDate: new Date('1991-09-14'),
        address: 'ul. Artystyczna 52, 11-890 Warszawa',
        emergencyContact: 'Piotr Mazur',
        emergencyPhone: '+48 987 654 321',
        notes: 'Graficzka freelancer. Problemy z organizacją czasu i niepewnością.',
        status: PATIENT_STATUS.ACTIVE
    },
    {
        firstName: 'Bartłomiej',
        lastName: 'Szymański',
        email: 'bartlomiej.szymanski@law.pl',
        phone: '+48 234 567 890',
        birthDate: new Date('1979-02-28'),
        address: 'ul. Prawnicza 89, 12-123 Warszawa',
        emergencyContact: 'Monika Szymańska',
        emergencyPhone: '+48 876 543 210',
        notes: 'Adwokat z problemami alkoholowymi. Terapia uzależnień i motywacyjna.',
        status: PATIENT_STATUS.ACTIVE
    }
];

export async function insertSampleData(): Promise<boolean> {
    try {
        // Sprawdź czy już są jakieś dane
        const existingPatients = await db.patients.count();
        if (existingPatients > 0) {
            console.log('Dane już istnieją, pomijam wstawianie przykładowych danych');
            return false;
        }

        console.log('Wstawiam przykładowe dane...');

        // Dodaj pacjentów
        const patientIds: number[] = [];
        for (const patientData of samplePatients) {
            const id = await db.patients.add(patientData as Patient);
            patientIds.push(id as number);
        }

        // Stwórz przykładowe wizyty na przestrzeni 2.5 miesiąca (75 dni)
        const daysRange = 75;
        const appointmentsPerPatient = 8; // ile wizyt na pacjenta (rozłożone w czasie)
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const sampleAppointments: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>[] = [];
        const types = [AppointmentType.THERAPY, AppointmentType.FOLLOW_UP, AppointmentType.INITIAL, AppointmentType.ASSESSMENT];
        const statuses = [
            AppointmentStatus.SCHEDULED,
            AppointmentStatus.COMPLETED,
            AppointmentStatus.NO_SHOW,
            AppointmentStatus.CANCELLED
        ];
        for (let i = 0; i < patientIds.length; i++) {
            for (let j = 0; j < appointmentsPerPatient; j++) {
                // Rozkładamy wizyty równomiernie na 2.5 miesiąca wokół dzisiaj
                const daysOffset = Math.floor((j / (appointmentsPerPatient - 1)) * (daysRange * 2)) - daysRange;
                const hour = 9 + (j % 6) * 2; // 9:00, 11:00, 13:00, 15:00, 17:00, 19:00
                const date = new Date(today.getTime() + daysOffset * 24 * 60 * 60 * 1000 + hour * 60 * 60 * 1000);
                const type = types[j % types.length];
                // Status: przeszłość = COMPLETED, przyszłość = SCHEDULED, losowo NO_SHOW/CANCELLED
                let status: AppointmentStatus;
                if (date < today) {
                    status = Math.random() < 0.8 ? AppointmentStatus.COMPLETED : statuses[2 + Math.floor(Math.random() * 2)];
                } else if (date > today) {
                    status = Math.random() < 0.85 ? AppointmentStatus.SCHEDULED : statuses[2 + Math.floor(Math.random() * 2)];
                } else {
                    status = AppointmentStatus.SCHEDULED;
                }
                sampleAppointments.push({
                    patientId: patientIds[i],
                    date,
                    duration: 50 + (j % 2) * 10, // 50 lub 60 min
                    status,
                    type,
                    notes: `Wizyta testowa (${type}, status: ${status})`,
                    reminderSent: status === AppointmentStatus.SCHEDULED && date > today ? false : undefined,
                    reminderSentAt: undefined
                });
            }
        }
        // Dodaj wizyty
        for (const appointmentData of sampleAppointments) {
            await db.appointments.add(appointmentData as Appointment);
        }

        console.log(`Dodano ${patientIds.length} pacjentów i ${sampleAppointments.length} wizyt`);
        return true;
    } catch (error) {
        console.error('Błąd podczas wstawiania przykładowych danych:', error);
        return false;
    }
}

export async function clearAllData(): Promise<void> {
    try {
        await db.appointments.clear();
        await db.patients.clear();
        console.log('Wszystkie dane zostały usunięte');
    } catch (error) {
        console.error('Błąd podczas usuwania danych:', error);
    }
} 