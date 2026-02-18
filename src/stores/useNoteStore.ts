import { create } from 'zustand';
import { db } from '../utils/db';
import type { Note } from '../types/Patient';

interface NoteStore {
  notes: Note[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchNotesByPatient: (patientId: number) => Promise<void>;
  fetchPersonalNotes: () => Promise<void>;
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateNote: (id: number, data: Partial<Note>) => Promise<void>;
  deleteNote: (id: number) => Promise<void>;
  togglePin: (id: number) => Promise<void>;
  clearNotes: () => void;

  // Derived getters
  getPinnedNotes: (patientId: number) => Note[];
  getNotesBySession: (sessionId: number) => Note[];
}

function sortNotes(notes: Note[]): Note[] {
  return notes.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export const useNoteStore = create<NoteStore>((set, get) => ({
  notes: [],
  loading: false,
  error: null,

  fetchNotesByPatient: async (patientId: number) => {
    set({ loading: true, error: null });
    try {
      const notes = await db.notes
        .where('patientId')
        .equals(patientId)
        .toArray();

      set({ notes: sortNotes(notes), loading: false });
    } catch (error) {
      console.error('Błąd podczas pobierania notatek:', error);
      set({ error: 'Błąd podczas pobierania notatek', loading: false });
    }
  },

  fetchPersonalNotes: async () => {
    set({ loading: true, error: null });
    try {
      const notes = await db.notes
        .filter(n => n.patientId === undefined || n.patientId === null)
        .toArray();

      set({ notes: sortNotes(notes), loading: false });
    } catch (error) {
      console.error('Błąd podczas pobierania notatek osobistych:', error);
      set({ error: 'Błąd podczas pobierania notatek osobistych', loading: false });
    }
  },

  addNote: async (noteData) => {
    set({ loading: true, error: null });
    try {
      await db.notes.add(noteData as Note);
      if (noteData.patientId) {
        await get().fetchNotesByPatient(noteData.patientId);
      } else {
        await get().fetchPersonalNotes();
      }
    } catch (error) {
      console.error('Błąd podczas dodawania notatki:', error);
      set({ error: 'Błąd podczas dodawania notatki', loading: false });
    }
  },

  updateNote: async (id, data) => {
    set({ loading: true, error: null });
    try {
      await db.notes.update(id, data);
      const note = get().notes.find(n => n.id === id);
      if (note?.patientId) {
        await get().fetchNotesByPatient(note.patientId);
      } else {
        await get().fetchPersonalNotes();
      }
    } catch (error) {
      console.error('Błąd podczas aktualizacji notatki:', error);
      set({ error: 'Błąd podczas aktualizacji notatki', loading: false });
    }
  },

  deleteNote: async (id) => {
    set({ loading: true, error: null });
    try {
      const note = get().notes.find(n => n.id === id);
      await db.notes.delete(id);
      if (note?.patientId) {
        await get().fetchNotesByPatient(note.patientId);
      } else {
        await get().fetchPersonalNotes();
      }
    } catch (error) {
      console.error('Błąd podczas usuwania notatki:', error);
      set({ error: 'Błąd podczas usuwania notatki', loading: false });
    }
  },

  togglePin: async (id) => {
    const note = get().notes.find(n => n.id === id);
    if (!note) return;
    try {
      await db.notes.update(id, { pinned: !note.pinned });
      if (note.patientId) {
        await get().fetchNotesByPatient(note.patientId);
      } else {
        await get().fetchPersonalNotes();
      }
    } catch (error) {
      console.error('Błąd podczas przypinania notatki:', error);
      set({ error: 'Błąd podczas przypinania notatki' });
    }
  },

  clearNotes: () => {
    set({ notes: [], loading: false, error: null });
  },

  getPinnedNotes: (patientId: number) => {
    return get().notes.filter(n => n.patientId === patientId && n.pinned);
  },

  getNotesBySession: (sessionId: number) => {
    return get().notes.filter(n => n.sessionId === sessionId);
  },
}));
