import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ThemeState {
  isDark: boolean;
  setIsDark: (status: boolean) => void;
}

type ThemePersist = Pick<ThemeState, 'isDark'>;

export default create(
  persist<ThemeState, [], [], ThemePersist>(
    (set) => ({
      isDark: false,
      setIsDark: (status: boolean) => set({ isDark: status }),
    }),
    {
      name: 'config_storage',
      storage: createJSONStorage<ThemePersist>(() => localStorage),
      partialize: (state) => ({ isDark: state.isDark }),
    },
  ),
);
