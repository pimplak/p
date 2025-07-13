import { produce } from 'immer';
import { create } from 'zustand';
import { PatientDataService } from '../services/patientDataService';
import type { Patient, PatientWithAppointments } from '../types/Patient';

interface PatientStore {
  // UI STATE ONLY
  patients: PatientWithAppointments[];
  loading: boolean;
  error: string | null;
  showArchived: boolean;

  // UI ACTIONS
  fetchPatients: () => Promise<void>;
  addPatient: (
    patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<void>;
  updatePatient: (id: number, patient: Partial<Patient>) => Promise<void>;
  deletePatient: (id: number) => Promise<void>;
  archivePatient: (id: number) => Promise<void>;
  restorePatient: (id: number) => Promise<void>;
  getPatient: (id: number) => Promise<Patient | undefined>;
  searchPatients: (query: string) => PatientWithAppointments[];
  toggleShowArchived: () => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const usePatientStore = create<PatientStore>((set, get) => ({
  // INITIAL STATE
  patients: [],
  loading: false,
  error: null,
  showArchived: false,

  // FETCH - deleguj do service, zarządzaj tylko UI state
  fetchPatients: async () => {
    set({ loading: true, error: null });
    try {
      const { showArchived } = get();
      const patients = await PatientDataService.fetchPatients({ showArchived });
      set({ patients, loading: false });
    } catch (error) {
      console.error('Błąd podczas pobierania pacjentów:', error);
      set({
        error: 'Błąd podczas pobierania pacjentów',
        loading: false,
        patients: [], // Clear patients on error
      });
    }
  },

  // ADD - optimistic update + service call
  addPatient: async patientData => {
    set({ loading: true, error: null });
    try {
      const id = await PatientDataService.createPatient(patientData);

      // Optimistic update - dodaj pacjenta do store
      set(
        produce((state: PatientStore) => {
          const newPatient: PatientWithAppointments = {
            ...(patientData as Patient),
            id,
            appointmentCount: 0,
            lastAppointment: undefined,
            nextAppointment: undefined,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          state.patients.push(newPatient);
          // Sortuj po lastName
          state.patients.sort((a, b) => a.lastName.localeCompare(b.lastName));
          state.loading = false;
        })
      );
    } catch (error) {
      console.error('Błąd podczas dodawania pacjenta:', error);
      set({ error: 'Błąd podczas dodawania pacjenta', loading: false });
    }
  },

  // UPDATE - optimistic update + service call
  updatePatient: async (id, patientData) => {
    set({ loading: true, error: null });
    try {
      await PatientDataService.updatePatient(id, patientData);

      // Optimistic update - zaktualizuj pacjenta w store
      set(
        produce((state: PatientStore) => {
          const index = state.patients.findIndex(p => p.id === id);
          if (index !== -1) {
            Object.assign(state.patients[index], patientData, {
              updatedAt: new Date().toISOString(),
            });
            // Re-sortuj jeśli zmieniono nazwisko
            if (patientData.lastName) {
              state.patients.sort((a, b) =>
                a.lastName.localeCompare(b.lastName)
              );
            }
          }
          state.loading = false;
        })
      );
    } catch (error) {
      console.error('Błąd podczas aktualizacji pacjenta:', error);
      set({ error: 'Błąd podczas aktualizacji pacjenta', loading: false });
    }
  },

  // DELETE - optimistic update + service call
  deletePatient: async id => {
    set({ loading: true, error: null });
    try {
      await PatientDataService.deletePatient(id);

      // Optimistic update - usuń pacjenta ze store
      set(
        produce((state: PatientStore) => {
          state.patients = state.patients.filter(p => p.id !== id);
          state.loading = false;
        })
      );
    } catch (error) {
      console.error('Błąd podczas usuwania pacjenta:', error);
      set({ error: 'Błąd podczas usuwania pacjenta', loading: false });
    }
  },

  // ARCHIVE - optimistic update + service call
  archivePatient: async id => {
    set({ loading: true, error: null });
    try {
      await PatientDataService.archivePatient(id);

      // Optimistic update - zaktualizuj status lub usuń z listy
      set(
        produce((state: PatientStore) => {
          const index = state.patients.findIndex(p => p.id === id);
          if (index !== -1) {
            if (state.showArchived) {
              state.patients[index].status = 'archived';
            } else {
              state.patients.splice(index, 1);
            }
          }
          state.loading = false;
        })
      );
    } catch (error) {
      console.error('Błąd podczas archiwizacji pacjenta:', error);
      set({ error: 'Błąd podczas archiwizacji pacjenta', loading: false });
    }
  },

  // RESTORE - optimistic update + service call
  restorePatient: async id => {
    set({ loading: true, error: null });
    try {
      await PatientDataService.restorePatient(id);

      // Optimistic update
      set(
        produce((state: PatientStore) => {
          const index = state.patients.findIndex(p => p.id === id);
          if (index !== -1) {
            state.patients[index].status = 'active';
          }
          state.loading = false;
        })
      );
    } catch (error) {
      console.error('Błąd podczas przywracania pacjenta:', error);
      set({ error: 'Błąd podczas przywracania pacjenta', loading: false });
    }
  },

  // GET BY ID - direct service call
  getPatient: async id => {
    try {
      return await PatientDataService.getPatientById(id);
    } catch (error) {
      console.error('Błąd podczas pobierania pacjenta:', error);
      set({ error: 'Błąd podczas pobierania pacjenta' });
      return undefined;
    }
  },

  // SEARCH - pure UI function using service
  searchPatients: query => {
    const { patients } = get();
    return PatientDataService.searchPatients(patients, query);
  },

  // TOGGLE ARCHIVED - UI state + refetch
  toggleShowArchived: () => {
    set(
      produce((state: PatientStore) => {
        state.showArchived = !state.showArchived;
      })
    );
    // Po zmianie flagi, od razu pobierz pacjentów
    get().fetchPatients();
  },

  // ERROR MANAGEMENT
  setError: error => set({ error }),
  clearError: () => set({ error: null }),
}));
