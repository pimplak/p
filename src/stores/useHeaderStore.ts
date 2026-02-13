import { create } from 'zustand';
import type { ReactNode } from 'react';

export interface HeaderState {
  title: ReactNode;
  leftSlot: ReactNode;
  rightSlot: ReactNode;
}

interface HeaderStore extends HeaderState {
  setHeader: (partial: Partial<HeaderState>) => void;
  resetHeader: () => void;
}

const defaultState: HeaderState = {
  title: '',
  leftSlot: null,
  rightSlot: null,
};

export const useHeaderStore = create<HeaderStore>(set => ({
  ...defaultState,
  setHeader: partial =>
    set(state => ({
      ...state,
      ...partial,
    })),
  resetHeader: () => set(defaultState),
}));
