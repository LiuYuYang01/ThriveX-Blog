'use client';

import { createContext, useContext, type ReactNode } from 'react';

import { Other, Theme, Web } from '@/types/app/config';
import { User } from '@/types/app/user';

interface AppConfigValue {
  web: Web;
  theme: Theme;
  other: Other;
  author: User;
}

const AppConfigContext = createContext<AppConfigValue | null>(null);

interface Props extends AppConfigValue {
  children: ReactNode;
}

// 传递数据给子组件
export default function AppConfigProvider({ web, theme, other, author, children }: Props) {
  return <AppConfigContext.Provider value={{ web, theme, other, author }}>{children}</AppConfigContext.Provider>;
}

// 获取数据
export function useAppConfig() {
  const value = useContext(AppConfigContext);
  if (!value) throw new Error('useAppConfig 必须在 AppConfigProvider 内使用');
  return value;
}
