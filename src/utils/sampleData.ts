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

        // Stwórz przykładowe wizyty
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const sampleAppointments: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>[] = [
            // Dzisiejsze wizyty (więcej wizyt w ciągu dnia)
            {
                patientId: patientIds[0],
                date: new Date(today.getTime() + 8 * 60 * 60 * 1000), // 8:00
                duration: 50,
                status: AppointmentStatus.SCHEDULED,
                type: AppointmentType.THERAPY,
                notes: 'Sesja terapii CBT - praca z technikami relaksacyjnymi',
                reminderSent: true,
                reminderSentAt: new Date(today.getTime() - 24 * 60 * 60 * 1000)
            },
            {
                patientId: patientIds[1],
                date: new Date(today.getTime() + 10 * 60 * 60 * 1000), // 10:00
                duration: 60,
                status: AppointmentStatus.SCHEDULED,
                type: AppointmentType.THERAPY,
                notes: 'Terapia par - ćwiczenia komunikacyjne',
                reminderSent: true,
                reminderSentAt: new Date(today.getTime() - 24 * 60 * 60 * 1000)
            },
            {
                patientId: patientIds[6], // Aleksandra
                date: new Date(today.getTime() + 12 * 60 * 60 * 1000), // 12:00
                duration: 50,
                status: AppointmentStatus.SCHEDULED,
                type: AppointmentType.THERAPY,
                notes: 'Praca z syndromem impostera - techniki cognitive restructuring',
                reminderSent: true,
                reminderSentAt: new Date(today.getTime() - 24 * 60 * 60 * 1000)
            },
            {
                patientId: patientIds[2],
                date: new Date(today.getTime() + 14 * 60 * 60 * 1000), // 14:00
                duration: 50,
                status: AppointmentStatus.SCHEDULED,
                type: AppointmentType.FOLLOW_UP,
                notes: 'Kontrola postępów w terapii depresji',
                reminderSent: false
            },
            {
                patientId: patientIds[9], // Jakub
                date: new Date(today.getTime() + 16 * 60 * 60 * 1000), // 16:00
                duration: 50,
                status: AppointmentStatus.SCHEDULED,
                type: AppointmentType.THERAPY,
                notes: 'Techniki radzenia sobie z atakami paniki przed egzaminami',
                reminderSent: false
            },

            // Wczorajsze wizyty (zakończone i problematyczne)
            {
                patientId: patientIds[3],
                date: new Date(today.getTime() - 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000), // wczoraj 9:00
                duration: 50,
                status: AppointmentStatus.COMPLETED,
                type: AppointmentType.THERAPY,
                notes: 'Praca z technikami mindfulness. Pacjent pokazuje postępy.'
            },
            {
                patientId: patientIds[4],
                date: new Date(today.getTime() - 24 * 60 * 60 * 1000 + 11 * 60 * 60 * 1000), // wczoraj 11:00
                duration: 50,
                status: AppointmentStatus.NO_SHOW,
                type: AppointmentType.THERAPY,
                notes: 'Pacjentka nie stawiła się na sesję. Skontaktować się telefonicznie.'
            },
            {
                patientId: patientIds[7], // Rafał
                date: new Date(today.getTime() - 24 * 60 * 60 * 1000 + 15 * 60 * 60 * 1000), // wczoraj 15:00
                duration: 50,
                status: AppointmentStatus.COMPLETED,
                type: AppointmentType.THERAPY,
                notes: 'Hygiena snu i work-life balance. Ustalenie granic czasowych.'
            },
            {
                patientId: patientIds[11], // Bartłomiej
                date: new Date(today.getTime() - 24 * 60 * 60 * 1000 + 17 * 60 * 60 * 1000), // wczoraj 17:00
                duration: 50,
                status: AppointmentStatus.CANCELLED,
                type: AppointmentType.THERAPY,
                notes: 'Pacjent odwołał - konflikt w pracy. Przełożenie na jutro.'
            },

            // Jutrzejsze wizyty
            {
                patientId: patientIds[5],
                date: new Date(today.getTime() + 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000), // jutro 9:00
                duration: 50,
                status: AppointmentStatus.SCHEDULED,
                type: AppointmentType.THERAPY,
                notes: 'Kontynuacja terapii uzależnienia behawioralnego',
                reminderSent: false
            },
            {
                patientId: patientIds[8], // Natalia
                date: new Date(today.getTime() + 24 * 60 * 60 * 1000 + 11 * 60 * 60 * 1000), // jutro 11:00
                duration: 50,
                status: AppointmentStatus.SCHEDULED,
                type: AppointmentType.THERAPY,
                notes: 'EMDR - praca z traumą wtórną',
                reminderSent: false
            },
            {
                patientId: patientIds[0],
                date: new Date(today.getTime() + 24 * 60 * 60 * 1000 + 13 * 60 * 60 * 1000), // jutro 13:00
                duration: 50,
                status: AppointmentStatus.SCHEDULED,
                type: AppointmentType.THERAPY,
                notes: 'Praca z hierarchią lęków',
                reminderSent: false
            },
            {
                patientId: patientIds[10], // Karolina
                date: new Date(today.getTime() + 24 * 60 * 60 * 1000 + 15 * 60 * 60 * 1000), // jutro 15:00
                duration: 50,
                status: AppointmentStatus.SCHEDULED,
                type: AppointmentType.ASSESSMENT,
                notes: 'Ocena postępów - time management i asertywność',
                reminderSent: false
            },
            {
                patientId: patientIds[11], // Bartłomiej - przełożona wizyta
                date: new Date(today.getTime() + 24 * 60 * 60 * 1000 + 17 * 60 * 60 * 1000), // jutro 17:00
                duration: 50,
                status: AppointmentStatus.SCHEDULED,
                type: AppointmentType.THERAPY,
                notes: 'Przełożona wizyta. Praca z motywacją do abstynencji.',
                reminderSent: false
            },

            // Ten tydzień - reszta wizyt
            {
                patientId: patientIds[1],
                date: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000), // pojutrze
                duration: 60,
                status: AppointmentStatus.SCHEDULED,
                type: AppointmentType.THERAPY,
                notes: 'Terapia par - techniki rozwiązywania konfliktów'
            },
            {
                patientId: patientIds[6], // Aleksandra
                date: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000),
                duration: 50,
                status: AppointmentStatus.SCHEDULED,
                type: AppointmentType.THERAPY,
                notes: 'Networking i autoprezentacja - przełamanie barier'
            },
            {
                patientId: patientIds[9], // Jakub
                date: new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000),
                duration: 50,
                status: AppointmentStatus.SCHEDULED,
                type: AppointmentType.THERAPY,
                notes: 'Techniki egzaminacyjne i zarządzanie stresem'
            },

            // Przyszły tydzień
            {
                patientId: patientIds[1],
                date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000), // za tydzień
                duration: 60,
                status: AppointmentStatus.SCHEDULED,
                type: AppointmentType.THERAPY,
                notes: 'Terapia par - planowane ćwiczenia z asertywności'
            },
            {
                patientId: patientIds[2],
                date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000), // za tydzień
                duration: 50,
                status: AppointmentStatus.SCHEDULED,
                type: AppointmentType.ASSESSMENT,
                notes: 'Ocena postępów w terapii - możliwa zmiana częstotliwości sesji'
            },
            {
                patientId: patientIds[7], // Rafał
                date: new Date(today.getTime() + 8 * 24 * 60 * 60 * 1000 + 16 * 60 * 60 * 1000),
                duration: 50,
                status: AppointmentStatus.SCHEDULED,
                type: AppointmentType.THERAPY,
                notes: 'Boundary setting z szefem i zespołem'
            },
            {
                patientId: patientIds[8], // Natalia
                date: new Date(today.getTime() + 9 * 24 * 60 * 60 * 1000 + 11 * 60 * 60 * 1000),
                duration: 50,
                status: AppointmentStatus.SCHEDULED,
                type: AppointmentType.THERAPY,
                notes: 'Self-care strategies i zapobieganie wypaleniu'
            },

            // Historyczne wizyty - pierwsze kontakty
            {
                patientId: patientIds[0],
                date: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000), // tydzień temu
                duration: 50,
                status: AppointmentStatus.COMPLETED,
                type: AppointmentType.INITIAL,
                notes: 'Pierwsza wizyta. Wywiad i ustalenie celów terapii.'
            },
            {
                patientId: patientIds[3],
                date: new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000), // 2 tygodnie temu
                duration: 50,
                status: AppointmentStatus.COMPLETED,
                type: AppointmentType.INITIAL,
                notes: 'Pierwszy kontakt. Ocena wypalenia zawodowego.'
            },
            {
                patientId: patientIds[6], // Aleksandra
                date: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000),
                duration: 60,
                status: AppointmentStatus.COMPLETED,
                type: AppointmentType.INITIAL,
                notes: 'Intake - syndrom impostera w środowisku biznesowym'
            },
            {
                patientId: patientIds[7], // Rafał
                date: new Date(today.getTime() - 21 * 24 * 60 * 60 * 1000 + 15 * 60 * 60 * 1000), // 3 tygodnie temu
                duration: 50,
                status: AppointmentStatus.COMPLETED,
                type: AppointmentType.INITIAL,
                notes: 'Ocena problemów ze snem i pracoholizmu'
            },
            {
                patientId: patientIds[9], // Jakub
                date: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000 + 16 * 60 * 60 * 1000),
                duration: 50,
                status: AppointmentStatus.COMPLETED,
                type: AppointmentType.INITIAL,
                notes: 'Student medycyny - ataki paniki i perfekcjonizm'
            },

            // Więcej historycznych sesji terapeutycznych
            {
                patientId: patientIds[0],
                date: new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000),
                duration: 50,
                status: AppointmentStatus.COMPLETED,
                type: AppointmentType.THERAPY,
                notes: 'CBT - identyfikacja myśli automatycznych'
            },
            {
                patientId: patientIds[1],
                date: new Date(today.getTime() - 8 * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000),
                duration: 60,
                status: AppointmentStatus.COMPLETED,
                type: AppointmentType.THERAPY,
                notes: 'Terapia par - ćwiczenia active listening'
            },
            {
                patientId: patientIds[3],
                date: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000),
                duration: 50,
                status: AppointmentStatus.COMPLETED,
                type: AppointmentType.THERAPY,
                notes: 'Techniki relaksacyjne i meditation mindfulness'
            },
            {
                patientId: patientIds[6], // Aleksandra
                date: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000),
                duration: 50,
                status: AppointmentStatus.COMPLETED,
                type: AppointmentType.THERAPY,
                notes: 'Power posing i confidence building exercises'
            },
            {
                patientId: patientIds[7], // Rafał
                date: new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000 + 15 * 60 * 60 * 1000),
                duration: 50,
                status: AppointmentStatus.COMPLETED,
                type: AppointmentType.THERAPY,
                notes: 'Sleep hygiene i digital detox strategies'
            },
            {
                patientId: patientIds[8], // Natalia
                date: new Date(today.getTime() - 12 * 24 * 60 * 60 * 1000 + 11 * 60 * 60 * 1000),
                duration: 50,
                status: AppointmentStatus.COMPLETED,
                type: AppointmentType.INITIAL,
                notes: 'Ocena trauma wtórnej i resilience w medycynie'
            },
            {
                patientId: patientIds[10], // Karolina
                date: new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000 + 15 * 60 * 60 * 1000),
                duration: 50,
                status: AppointmentStatus.COMPLETED,
                type: AppointmentType.INITIAL,
                notes: 'Freelancer struggles - niepewność finansowa i izolacja'
            },
            {
                patientId: patientIds[11], // Bartłomiej
                date: new Date(today.getTime() - 28 * 24 * 60 * 60 * 1000 + 17 * 60 * 60 * 1000), // miesiąc temu
                duration: 50,
                status: AppointmentStatus.COMPLETED,
                type: AppointmentType.INITIAL,
                notes: 'Intake - problemy z alkoholem i stres zawodowy'
            }
        ];

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