import { create } from 'zustand';

interface BottomSheetState {
    isAnyBottomSheetOpen: boolean;
    openBottomSheet: () => void;
    closeBottomSheet: () => void;
}

export const useBottomSheetState = create<BottomSheetState>((set) => ({
    isAnyBottomSheetOpen: false,
    openBottomSheet: () => set({ isAnyBottomSheetOpen: true }),
    closeBottomSheet: () => set({ isAnyBottomSheetOpen: false }),
})); 