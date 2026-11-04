'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

// 日记本是独立的一册书：进入 /diary 时收起站点页头、页脚与浮动入口
export default function DiaryStandalone({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith('/diary')) return null;
  return <>{children}</>;
}
