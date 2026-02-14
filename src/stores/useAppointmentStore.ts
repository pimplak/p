import { create } from 'zustand';
import { db } from '../utils/db';
import { needsReminder } from '../utils/sms';
import { APPOINTMENT_STATUS } from '../constants/status';
import type { Appointment, AppointmentWithPatient } from '../types/Appointment';

interface AppointmentStore {
  appointments: AppointmentWithPatient[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchAppointments: () => Promise<void>;
  addAppointment: (
    appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<void>;
  updateAppointment: (
    id: number,
    appointment: Partial<Appointment>
  ) => Promise<void>;
  deleteAppointment: (id: number) => Promise<void>;
  getAppointment: (id: number) => Promise<Appointment | undefined>;
  getAppointmentsByPatient: (patientId: number) => Promise<Appointment[]>;
  getAppointmentsByDateRange: (
    startDate: Date,
    endDate: Date
  ) => AppointmentWithPatient[];
  getTodaysAppointments: () => AppointmentWithPatient[];
  getUpcomingAppointments: () => AppointmentWithPatient[];

  // SMS reminder methods
  getAppointmentsNeedingReminders: () => AppointmentWithPatient[];
  markReminderSent: (appointmentId: number) => Promise<void>;
  markReminderDelivered: (appointmentId: number) => Promise<void>;
  markPatientResponded: (
    appointmentId: number,
    response?: string
  ) => Promise<void>;
}

export const useAppointmentStore = create<AppointmentStore>((set, get) => ({
  appointments: [],
  loading: false,
  error: null,

  fetchAppointments: async () => {
    set({ loading: true, error: null });
    try {
      let appointments = await db.appointments.orderBy('date').toArray();

      // Automatyczna aktualizacja statusów dla zakończonych wizyt
      const now = new Date();
      const updates: Appointment[] = [];
      let hasUpdates = false;

      appointments = appointments.map(appt => {
        if (appt.status === APPOINTMENT_STATUS.SCHEDULED) {
          const apptDate = new Date(appt.date);
          const durationMs = (appt.duration || 50) * 60 * 1000;
          const endTime = new Date(apptDate.getTime() + durationMs);

          if (endTime < now) {
            hasUpdates = true;
            const updated = { ...appt, status: APPOINTMENT_STATUS.COMPLETED };
            updates.push(updated);
            return updated;
          }
        }
        return appt;
      });

      if (hasUpdates) {
        await db.appointments.bulkPut(updates);
      }

      // Ferro Fix: Bulk fetch patients to avoid N+1 queries
      const patientIds = [...new Set(appointments.map(apt => apt.patientId))];
      const patients = await db.patients.where('id').anyOf(patientIds).toArray();
      const patientMap = new Map(patients.map(p => [p.id, p]));

      const appointmentsWithPatients: AppointmentWithPatient[] = appointments.map(appointment => ({
        ...appointment,
        patient: patientMap.get(appointment.patientId) || undefined,
      }));

      set({ appointments: appointmentsWithPatients, loading: false });
    } catch (error) {
      console.error('Błąd podczas pobierania wizyt:', error);
      set({ error: 'Błąd podczas pobierania wizyt', loading: false });
    }
  },

  addAppointment: async appointmentData => {
    set({ loading: true, error: null });
    try {
      await db.appointments.add(appointmentData as Appointment);
      await get().fetchAppointments();
    } catch (error) {
      console.error('Błąd podczas dodawania wizyty:', error);
      set({ error: 'Błąd podczas dodawania wizyty', loading: false });
    }
  },

  updateAppointment: async (id, appointmentData) => {
    set({ loading: true, error: null });
    try {
      await db.appointments.update(id, appointmentData);
      await get().fetchAppointments();
    } catch (error) {
      console.error('Błąd podczas aktualizacji wizyty:', error);
      set({ error: 'Błąd podczas aktualizacji wizyty', loading: false });
    }
  },

  deleteAppointment: async id => {
    set({ loading: true, error: null });
    try {
      await db.appointments.delete(id);
      await get().fetchAppointments();
    } catch (error) {
      console.error('Błąd podczas usuwania wizyty:', error);
      set({ error: 'Błąd podczas usuwania wizyty', loading: false });
    }
  },

  getAppointment: async id => {
    try {
      return await db.appointments.get(id);
    } catch (error) {
      console.error('Błąd podczas pobierania wizyty:', error);
      set({ error: 'Błąd podczas pobierania wizyty' });
      return undefined;
    }
  },

  getAppointmentsByPatient: async patientId => {
    try {
      const appointments = await db.appointments
        .where('patientId')
        .equals(patientId)
        .toArray();

      return appointments.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    } catch (error) {
      console.error('Błąd podczas pobierania wizyt pacjenta:', error);
      return [];
    }
  },

  getAppointmentsByDateRange: (startDate, endDate) => {
    const { appointments } = get();
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate >= startDate && appointmentDate <= endDate;
    });
  },

  getTodaysAppointments: () => {
    const { appointments } = get();
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59
    );

    return appointments
      .filter(appointment => {
        const appointmentDate = new Date(appointment.date);
        return appointmentDate >= startOfDay && appointmentDate <= endOfDay;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  },

  getUpcomingAppointments: () => {
    const { appointments } = get();
    const now = new Date();

    return appointments
      .filter(appointment => new Date(appointment.date) > now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 10); // Next 10 appointments
  },

  // SMS reminder methods
  getAppointmentsNeedingReminders: () => {
    const { appointments } = get();
    return appointments.filter(appointment => needsReminder(appointment));
  },

  markReminderSent: async appointmentId => {
    try {
      await db.appointments.update(appointmentId, {
        reminderSent: true,
        reminderSentAt: new Date().toISOString(),
      });
      await get().fetchAppointments();
    } catch (error) {
      console.error('Error marking reminder as sent:', error);
    }
  },

  markReminderDelivered: async appointmentId => {
    try {
      await db.appointments.update(appointmentId, {
        reminderSent: true,
        reminderSentAt: new Date().toISOString(),
      });
      await get().fetchAppointments();
    } catch (error) {
      console.error('Error marking reminder as delivered:', error);
    }
  },

  markPatientResponded: async appointmentId => {
    try {
      await db.appointments.update(appointmentId, {
        reminderSent: true,
        reminderSentAt: new Date().toISOString(),
        // Note: We could add response tracking to the Appointment type in the future
      });
      await get().fetchAppointments();
    } catch (error) {
      console.error('Error marking patient response:', error);
    }
  },
}));
