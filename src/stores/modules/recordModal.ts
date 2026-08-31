import { create } from 'zustand';

interface RecordModalState {
  open: boolean;
  focusId: number | null;
  openModal: (focusId?: number) => void;
  closeModal: () => void;
  clearFocus: () => void;
}

export default create<RecordModalState>((set) => ({
  open: false,
  focusId: null,
  openModal: (focusId) => set({ open: true, focusId: focusId ?? null }),
  closeModal: () => set({ open: false, focusId: null }),
  clearFocus: () => set({ focusId: null }),
}));
