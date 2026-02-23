import { create } from 'zustand';
import { supabase } from '../utils/supabase';
import type { Session, User } from '@supabase/supabase-js';

interface AuthState {
  session: Session | null;
  user: User | null;
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
  initialize: () => () => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  sendMagicLink: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
  sendPasswordReset: (email: string) => Promise<void>;
  updateEmail: (newEmail: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  loading: true,
  actionLoading: false,
  error: null,

  initialize: () => {
    void supabase.auth.getSession().then(({ data: { session } }) => {
      set({ session, user: session?.user ?? null, loading: false });
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null });
    });

    return () => subscription.unsubscribe();
  },

  signIn: async (email, password) => {
    set({ actionLoading: true, error: null });
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    set({ actionLoading: false, error: error?.message ?? null });
    if (error) throw error;
  },

  signUp: async (email, password) => {
    set({ actionLoading: true, error: null });
    const { error } = await supabase.auth.signUp({ email, password });
    set({ actionLoading: false, error: error?.message ?? null });
    if (error) throw error;
  },

  sendMagicLink: async (email) => {
    set({ actionLoading: true, error: null });
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    set({ actionLoading: false, error: error?.message ?? null });
    if (error) throw error;
  },

  signOut: async () => {
    set({ actionLoading: true, error: null });
    const { error } = await supabase.auth.signOut();
    set({ actionLoading: false, error: error?.message ?? null });
    if (error) throw error;
  },

  clearError: () => set({ error: null }),

  sendPasswordReset: async (email) => {
    set({ actionLoading: true, error: null });
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    set({ actionLoading: false, error: error?.message ?? null });
    if (error) throw error;
  },

  updateEmail: async (newEmail) => {
    set({ actionLoading: true, error: null });
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    set({ actionLoading: false, error: error?.message ?? null });
    if (error) throw error;
  },

  updatePassword: async (newPassword) => {
    set({ actionLoading: true, error: null });
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    set({ actionLoading: false, error: error?.message ?? null });
    if (error) throw error;
  },
}));
