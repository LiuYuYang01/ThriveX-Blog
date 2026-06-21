import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Config, Theme, Web } from '@/types/app/config';

interface ConfigState {
  // 是否暗黑模式
  isDark: boolean;
  setIsDark: (status: boolean) => void;

  // 网站配置
  web: Web;
  setWeb: (data: Web) => void;

  // 主题配置
  theme: Theme;
  setTheme: (data: Theme) => void;

  // 公开配置
  config: Config;
  setConfig: (data: Config) => void;
}

export default create(
  persist<ConfigState>(
    (set) => ({
      isDark: false,
      setIsDark: (status: boolean) => set(() => ({ isDark: status })),

      web: {} as Web,
      setWeb: (data: Web) => set(() => ({ web: data })),

      theme: {} as Theme,
      setTheme: (data: Theme) => set(() => ({ theme: data })),

      config: {} as Config,
      setConfig: (data: Config) => set(() => ({ config: data }))
    }),
    {
      name: 'config_storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
)