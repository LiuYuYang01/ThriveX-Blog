'use client';

import { createContext, useContext, type ReactNode } from 'react';
import useShareCount from '@/hooks/useShareCount';
import { shareArticleAPI } from '@/api/article';

interface ArticleShareContextValue {
  count: number;
  recordShare: () => Promise<void>;
}

export const ArticleShareContext = createContext<ArticleShareContextValue | null>(null);

export function useArticleShare() {
  const ctx = useContext(ArticleShareContext);
  if (!ctx) throw new Error('useArticleShare must be used within ArticleShareProvider');
  return ctx;
}

export function ArticleShareProvider({
  articleId,
  initialCount = 0,
  children,
}: {
  articleId: number;
  initialCount?: number;
  children: ReactNode;
}) {
  const value = useShareCount(articleId, initialCount, shareArticleAPI);
  return <ArticleShareContext.Provider value={value}>{children}</ArticleShareContext.Provider>;
}
