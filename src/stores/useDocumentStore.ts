import { create } from 'zustand';
import { db } from '../utils/db';
import type { DocumentType } from '../constants/status';
import type { Document } from '../types/Patient';

interface DocumentStore {
  documents: Document[];
  loading: boolean;
  error: string | null;
  filterType: DocumentType | null;

  // Actions
  fetchDocumentsByPatient: (patientId: number) => Promise<void>;
  addDocument: (data: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateDocument: (id: number, data: Partial<Document>) => Promise<void>;
  deleteDocument: (id: number) => Promise<void>;
  togglePin: (id: number) => Promise<void>;
  clearDocuments: () => void;
  setFilterType: (type: DocumentType | null) => void;

  // Derived getters
  getPinnedDocuments: () => Document[];
  getFilteredDocuments: () => Document[];
}

function sortDocuments(docs: Document[]): Document[] {
  return docs.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  documents: [],
  loading: false,
  error: null,
  filterType: null,

  fetchDocumentsByPatient: async (patientId: number) => {
    set({ loading: true, error: null });
    try {
      const docs = await db.documents
        .where('patientId')
        .equals(patientId)
        .toArray();
      set({ documents: sortDocuments(docs), loading: false });
    } catch (error) {
      console.error('Błąd podczas pobierania dokumentów:', error);
      set({ error: 'Błąd podczas pobierania dokumentów', loading: false });
    }
  },

  addDocument: async (data) => {
    set({ loading: true, error: null });
    try {
      await db.documents.add(data as Document);
      await get().fetchDocumentsByPatient(data.patientId);
    } catch (error) {
      console.error('Błąd podczas dodawania dokumentu:', error);
      set({ error: 'Błąd podczas dodawania dokumentu', loading: false });
    }
  },

  updateDocument: async (id, data) => {
    set({ loading: true, error: null });
    try {
      await db.documents.update(id, data);
      const doc = get().documents.find(d => d.id === id);
      if (doc) {
        await get().fetchDocumentsByPatient(doc.patientId);
      }
    } catch (error) {
      console.error('Błąd podczas aktualizacji dokumentu:', error);
      set({ error: 'Błąd podczas aktualizacji dokumentu', loading: false });
    }
  },

  deleteDocument: async (id) => {
    set({ loading: true, error: null });
    try {
      const doc = get().documents.find(d => d.id === id);
      await db.documents.delete(id);
      if (doc) {
        await get().fetchDocumentsByPatient(doc.patientId);
      } else {
        set({ loading: false });
      }
    } catch (error) {
      console.error('Błąd podczas usuwania dokumentu:', error);
      set({ error: 'Błąd podczas usuwania dokumentu', loading: false });
    }
  },

  togglePin: async (id) => {
    const doc = get().documents.find(d => d.id === id);
    if (!doc) return;
    try {
      await db.documents.update(id, { pinned: !doc.pinned });
      await get().fetchDocumentsByPatient(doc.patientId);
    } catch (error) {
      console.error('Błąd podczas przypinania dokumentu:', error);
      set({ error: 'Błąd podczas przypinania dokumentu' });
    }
  },

  clearDocuments: () => {
    set({ documents: [], loading: false, error: null, filterType: null });
  },

  setFilterType: (type) => {
    set({ filterType: type });
  },

  getPinnedDocuments: () => {
    return get().documents.filter(d => d.pinned);
  },

  getFilteredDocuments: () => {
    const { documents, filterType } = get();
    if (!filterType) return documents;
    return documents.filter(d => d.type === filterType);
  },
}));
