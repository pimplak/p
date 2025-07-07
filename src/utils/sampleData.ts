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
        nazwa: 'Michał od Marii',
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
        nazwa: 'Kasia od Tomka',
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
        nazwa: 'Magda od Roberta',
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
        nazwa: 'Tomek od Ewy',
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
        nazwa: 'Ola od Marcina',
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
        nazwa: 'Natka od Adama',
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
        nazwa: 'Kuba od Basi',
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
        nazwa: 'Karo od Piotra',
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
        nazwa: 'Bartek od Moniki',
        email: 'bartlomiej.szymanski@law.pl',
        phone: '+48 234 567 890',
        birthDate: new Date('1979-02-28'),
        address: 'ul. Prawnicza 89, 12-123 Warszawa',
        emergencyContact: 'Monika Szymańska',
        emergencyPhone: '+48 876 543 210',
        notes: 'Adwokat z problemami alkoholowymi. Terapia uzależnień i motywacyjna.',
        status: PATIENT_STATUS.ACTIVE
    },
    // === NOWI PACJENCI ===
    {
        firstName: 'Paweł',
        lastName: 'Kowalski',
        nazwa: 'Paweł od Anny',
        email: 'pawel.kowalski@email.com',
        phone: '+48 111 222 333',
        birthDate: new Date('1983-07-12'),
        address: 'ul. Kwiatowa 12, 00-001 Warszawa',
        emergencyContact: 'Anna Kowalska',
        emergencyPhone: '+48 123 456 789',
        notes: 'Mąż Anny Kowalskiej. Terapia par - problemy komunikacyjne w małżeństwie.',
        status: PATIENT_STATUS.ACTIVE
    },
    {
        firstName: 'Maria',
        lastName: 'Nowak',
        nazwa: 'Maria od Michała',
        email: 'maria.nowak@gmail.com',
        phone: '+48 444 555 666',
        birthDate: new Date('1980-04-18'),
        address: 'ul. Słoneczna 8/15, 02-123 Warszawa',
        emergencyContact: 'Michał Nowak',
        emergencyPhone: '+48 234 567 890',
        notes: 'Żona Michała Nowaka. Terapia par - trudności w komunikacji.',
        status: PATIENT_STATUS.ACTIVE
    },
    {
        firstName: 'Agnieszka',
        lastName: 'Zielińska',
        nazwa: 'Aga od Piotra',
        email: 'agnieszka.zielinska@work.pl',
        phone: '+48 777 888 999',
        birthDate: new Date('1991-11-05'),
        address: 'ul. Leśna 7, 04-789 Warszawa',
        emergencyContact: 'Piotr Zieliński',
        emergencyPhone: '+48 456 789 012',
        notes: 'Żona Piotra Zielińskiego. Terapia indywidualna - problemy z pewnością siebie.',
        status: PATIENT_STATUS.ACTIVE
    },
    {
        firstName: 'Dominik',
        lastName: 'Krawczyk',
        nazwa: 'Dominik od Pauliny',
        email: 'dominik.krawczyk@tech.pl',
        phone: '+48 555 666 777',
        birthDate: new Date('1988-09-30'),
        address: 'ul. Technologiczna 45, 13-456 Warszawa',
        emergencyContact: 'Paulina Krawczyk',
        emergencyPhone: '+48 666 777 888',
        notes: 'Programista z zespołem Aspergera. Terapia wspomagająca funkcjonowanie społeczne.',
        status: PATIENT_STATUS.ACTIVE
    },
    {
        firstName: 'Paulina',
        lastName: 'Krawczyk',
        nazwa: 'Paula od Dominika',
        email: 'paulina.krawczyk@design.pl',
        phone: '+48 666 777 888',
        birthDate: new Date('1990-02-14'),
        address: 'ul. Technologiczna 45, 13-456 Warszawa',
        emergencyContact: 'Dominik Krawczyk',
        emergencyPhone: '+48 555 666 777',
        notes: 'Żona Dominika. UX designerka. Terapia wspomagająca - partnerka osoby z Aspergerem.',
        status: PATIENT_STATUS.ACTIVE
    },
    {
        firstName: 'Sebastian',
        lastName: 'Górski',
        nazwa: 'Sebastian od Martyny',
        email: 'sebastian.gorski@finance.pl',
        phone: '+48 333 444 555',
        birthDate: new Date('1985-12-08'),
        address: 'ul. Finansowa 78, 14-789 Warszawa',
        emergencyContact: 'Martyna Górska',
        emergencyPhone: '+48 444 555 666',
        notes: 'Analityk finansowy. Zaburzenia obsesyjno-kompulsywne związane z pracą.',
        status: PATIENT_STATUS.ACTIVE
    },
    {
        firstName: 'Martyna',
        lastName: 'Górska',
        nazwa: 'Martyna od Sebastiana',
        email: 'martyna.gorska@marketing.pl',
        phone: '+48 444 555 666',
        birthDate: new Date('1987-06-22'),
        address: 'ul. Finansowa 78, 14-789 Warszawa',
        emergencyContact: 'Sebastian Górski',
        emergencyPhone: '+48 333 444 555',
        notes: 'Żona Sebastiana. Marketingowiec. Terapia wspomagająca - partner osoby z OCD.',
        status: PATIENT_STATUS.ACTIVE
    },
    {
        firstName: 'Łukasz',
        lastName: 'Wiśniewski',
        nazwa: 'Łukasz od Joanny',
        email: 'lukasz.wisniewski@startup.pl',
        phone: '+48 888 999 000',
        birthDate: new Date('1992-03-17'),
        address: 'ul. Startupowa 23, 15-012 Warszawa',
        emergencyContact: 'Joanna Wiśniewska',
        emergencyPhone: '+48 999 000 111',
        notes: 'Founder startupu. Zespół ADHD. Terapia wspomagająca koncentrację i organizację.',
        status: PATIENT_STATUS.ACTIVE
    },
    {
        firstName: 'Joanna',
        lastName: 'Wiśniewska',
        nazwa: 'Asia od Łukasza',
        email: 'joanna.wisniewska@hr.pl',
        phone: '+48 999 000 111',
        birthDate: new Date('1993-08-29'),
        address: 'ul. Startupowa 23, 15-012 Warszawa',
        emergencyContact: 'Łukasz Wiśniewski',
        emergencyPhone: '+48 888 999 000',
        notes: 'Żona Łukasza. HR Business Partner. Terapia - wypalenie zawodowe.',
        status: PATIENT_STATUS.ACTIVE
    },
    {
        firstName: 'Krzysztof',
        lastName: 'Adamski',
        nazwa: 'Krzysiek od Beaty',
        email: 'krzysztof.adamski@consulting.pl',
        phone: '+48 222 333 444',
        birthDate: new Date('1981-10-11'),
        address: 'ul. Konsultingowa 56, 16-345 Warszawa',
        emergencyContact: 'Beata Adamska',
        emergencyPhone: '+48 333 444 555',
        notes: 'Konsultant biznesowy. Uzależnienie od pracy. Problemy z work-life balance.',
        status: PATIENT_STATUS.ACTIVE
    },
    {
        firstName: 'Beata',
        lastName: 'Adamska',
        nazwa: 'Beata od Krzysztofa',
        email: 'beata.adamska@wellness.pl',
        phone: '+48 333 444 555',
        birthDate: new Date('1984-01-25'),
        address: 'ul. Konsultingowa 56, 16-345 Warszawa',
        emergencyContact: 'Krzysztof Adamski',
        emergencyPhone: '+48 222 333 444',
        notes: 'Żona Krzysztofa. Trenerka wellness. Terapia wspomagająca - partner workaholika.',
        status: PATIENT_STATUS.ACTIVE
    },
    {
        firstName: 'Marcin',
        lastName: 'Stępień',
        nazwa: 'Marcin od Kasi',
        email: 'marcin.stepien@media.pl',
        phone: '+48 555 777 999',
        birthDate: new Date('1986-05-03'),
        address: 'ul. Medialna 89, 17-678 Warszawa',
        emergencyContact: 'Katarzyna Stępień',
        emergencyPhone: '+48 666 888 000',
        notes: 'Dziennikarz. Zespół lękowy uogólniony. Ataki paniki.',
        status: PATIENT_STATUS.ACTIVE
    },
    {
        firstName: 'Katarzyna',
        lastName: 'Stępień',
        nazwa: 'Kasia od Marcina',
        email: 'katarzyna.stepien@education.pl',
        phone: '+48 666 888 000',
        birthDate: new Date('1988-12-19'),
        address: 'ul. Medialna 89, 17-678 Warszawa',
        emergencyContact: 'Marcin Stępień',
        emergencyPhone: '+48 555 777 999',
        notes: 'Żona Marcina. Nauczycielka. Depresja poporodowa po drugim dziecku.',
        status: PATIENT_STATUS.ACTIVE
    },
    {
        firstName: 'Adrian',
        lastName: 'Kowalczyk',
        nazwa: 'Adrian od Werki',
        email: 'adrian.kowalczyk@sports.pl',
        phone: '+48 777 999 111',
        birthDate: new Date('1994-07-28'),
        address: 'ul. Sportowa 34, 18-901 Warszawa',
        emergencyContact: 'Weronika Kowalczyk',
        emergencyPhone: '+48 888 000 222',
        notes: 'Trener personalny. Dysmorfofobia. Obsesja na punkcie wyglądu.',
        status: PATIENT_STATUS.ACTIVE
    },
    {
        firstName: 'Weronika',
        lastName: 'Kowalczyk',
        nazwa: 'Wera od Adriana',
        email: 'weronika.kowalczyk@nutrition.pl',
        phone: '+48 888 000 222',
        birthDate: new Date('1996-04-15'),
        address: 'ul. Sportowa 34, 18-901 Warszawa',
        emergencyContact: 'Adrian Kowalczyk',
        emergencyPhone: '+48 777 999 111',
        notes: 'Żona Adriana. Dietetyczka. Zaburzenia odżywiania w przeszłości.',
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

        // === NOWA LOGIKA WIZYT ===
        // 1.5 miesiąca = 45 dni
        // 4-5 wizyt dziennie = około 200 wizyt total
        // Rozłożone równomiernie między pacjentów

        const daysRange = 45;
        const appointmentsPerDay = 4.5; // średnio 4-5 wizyt dziennie
        const totalAppointments = Math.floor(daysRange * appointmentsPerDay);
        const appointmentsPerPatient = Math.floor(totalAppointments / patientIds.length);

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const sampleAppointments: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>[] = [];

        const types = [AppointmentType.THERAPY, AppointmentType.FOLLOW_UP, AppointmentType.INITIAL, AppointmentType.ASSESSMENT, AppointmentType.CONSULTATION];
        const statuses = [
            AppointmentStatus.SCHEDULED,
            AppointmentStatus.COMPLETED,
            AppointmentStatus.NO_SHOW,
            AppointmentStatus.CANCELLED
        ];

        // Godziny pracy: 8:00-20:00, sloty co 30 minut
        const workingHours: number[] = [];
        for (let hour = 8; hour <= 19; hour++) {
            workingHours.push(hour * 60); // 8:00 = 480 minut
            workingHours.push(hour * 60 + 30); // 8:30 = 510 minut
        }

        // Zbiór zajętych slotów czasowych (klucz: "YYYY-MM-DD-HHmm")
        const occupiedSlots = new Set<string>();

        // Funkcja do generowania unikalnego slotu czasowego
        const generateUniqueTimeSlot = (baseDate: Date, maxAttempts: 50): Date | null => {
            for (let attempt = 0; attempt < maxAttempts; attempt++) {
                // Losowy dzień w zakresie ±3 dni od baseDate
                const dayOffset = Math.floor(Math.random() * 7) - 3;
                const date = new Date(baseDate.getTime() + dayOffset * 24 * 60 * 60 * 1000);

                // Losowa godzina z dostępnych slotów
                const randomMinutes = workingHours[Math.floor(Math.random() * workingHours.length)];
                const hour = Math.floor(randomMinutes / 60);
                const minutes = randomMinutes % 60;

                date.setHours(hour, minutes, 0, 0);

                // Sprawdź czy slot jest wolny
                const slotKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}-${String(hour).padStart(2, '0')}${String(minutes).padStart(2, '0')}`;

                if (!occupiedSlots.has(slotKey)) {
                    occupiedSlots.add(slotKey);
                    return date;
                }
            }
            return null; // Nie udało się znaleźć wolnego slotu
        };

        // Generuj wizyty dla każdego pacjenta
        for (let i = 0; i < patientIds.length; i++) {
            for (let j = 0; j < appointmentsPerPatient; j++) {
                // Rozkładamy wizyty równomiernie na 1.5 miesiąca wokół dzisiaj
                const daysOffset = Math.floor((j / (appointmentsPerPatient - 1)) * (daysRange * 2)) - daysRange;
                const baseDate = new Date(today.getTime() + daysOffset * 24 * 60 * 60 * 1000);

                // Generuj unikalny slot czasowy
                const date = generateUniqueTimeSlot(baseDate, 50);
                if (!date) {
                    console.warn(`Nie udało się wygenerować unikalnego slotu dla pacjenta ${i}, wizyty ${j}`);
                    continue;
                }

                const type = types[j % types.length];

                // Status: przeszłość = głównie COMPLETED, przyszłość = głównie SCHEDULED
                let status: AppointmentStatus;
                if (date < today) {
                    const rand = Math.random();
                    if (rand < 0.75) status = AppointmentStatus.COMPLETED;
                    else if (rand < 0.85) status = AppointmentStatus.NO_SHOW;
                    else status = AppointmentStatus.CANCELLED;
                } else if (date > today) {
                    const rand = Math.random();
                    if (rand < 0.85) status = AppointmentStatus.SCHEDULED;
                    else if (rand < 0.92) status = AppointmentStatus.CANCELLED;
                    else status = AppointmentStatus.RESCHEDULED;
                } else {
                    status = AppointmentStatus.SCHEDULED;
                }

                // Różne długości sesji
                const duration = [50, 60, 90][j % 3];

                sampleAppointments.push({
                    patientId: patientIds[i],
                    date,
                    duration,
                    status,
                    type,
                    notes: `Sesja ${type} - ${status === AppointmentStatus.COMPLETED ? 'zakończona' : 'zaplanowana'}`,
                    reminderSent: status === AppointmentStatus.SCHEDULED && date > today ? false : undefined,
                    reminderSentAt: undefined
                });
            }
        }

        // Dodaj dodatkowe losowe wizyty żeby osiągnąć 4-5 wizyt dziennie
        const additionalAppointments = totalAppointments - sampleAppointments.length;
        for (let i = 0; i < additionalAppointments; i++) {
            const randomPatientId = patientIds[Math.floor(Math.random() * patientIds.length)];

            // Losowy dzień w całym zakresie
            const randomDay = Math.floor(Math.random() * daysRange * 2) - daysRange;
            const baseDate = new Date(today.getTime() + randomDay * 24 * 60 * 60 * 1000);

            // Generuj unikalny slot czasowy
            const date = generateUniqueTimeSlot(baseDate, 50);
            if (!date) {
                console.warn(`Nie udało się wygenerować unikalnego slotu dla dodatkowej wizyty ${i}`);
                continue;
            }

            const type = types[Math.floor(Math.random() * types.length)];
            let status: AppointmentStatus;

            if (date < today) {
                status = Math.random() < 0.8 ? AppointmentStatus.COMPLETED : statuses[2 + Math.floor(Math.random() * 2)];
            } else {
                status = Math.random() < 0.85 ? AppointmentStatus.SCHEDULED : statuses[2 + Math.floor(Math.random() * 2)];
            }

            sampleAppointments.push({
                patientId: randomPatientId,
                date,
                duration: [50, 60, 90][Math.floor(Math.random() * 3)],
                status,
                type,
                notes: `Dodatkowa sesja ${type}`,
                reminderSent: status === AppointmentStatus.SCHEDULED && date > today ? false : undefined,
                reminderSentAt: undefined
            });
        }

        // Sortuj wizyty chronologicznie
        sampleAppointments.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // Dodaj wizyty do bazy
        for (const appointmentData of sampleAppointments) {
            await db.appointments.add(appointmentData as Appointment);
        }

        console.log(`Dodano ${patientIds.length} pacjentów i ${sampleAppointments.length} wizyt`);
        console.log(`Średnio ${(sampleAppointments.length / daysRange).toFixed(1)} wizyt dziennie przez ${daysRange} dni`);
        console.log(`Używano ${occupiedSlots.size} unikalnych slotów czasowych`);
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
        await db.notes.clear();
        await db.goals.clear();
        console.log('Wszystkie dane zostały usunięte');
    } catch (error) {
        console.error('Błąd podczas usuwania danych:', error);
    }
} 