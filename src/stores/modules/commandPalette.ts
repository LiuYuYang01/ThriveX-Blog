import { create } from 'zustand';

interface CommandPaletteState {
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export default create<CommandPaletteState>((set) => ({
  open: false,
  openModal: () => set({ open: true }),
  closeModal: () => set({ open: false }),
}));
