import { create } from 'zustand';

interface RecordModalState {
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export default create<RecordModalState>((set) => ({
  open: false,
  openModal: () => set({ open: true }),
  closeModal: () => set({ open: false }),
}));
