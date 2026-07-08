'use client';

import { createContext, useContext, type ReactNode } from 'react';
import useDebouncedLike from '@/hooks/useDebouncedLike';
import { likeArticleAction } from '@/actions/article';
import LikeButtonCore from '@/components/LikeButton/LikeButtonCore';

interface ArticleLikeContextValue {
  count: number;
  like: () => void;
}

export const ArticleLikeContext = createContext<ArticleLikeContextValue | null>(null);

export function useArticleLike() {
  const ctx = useContext(ArticleLikeContext);
  if (!ctx) throw new Error('useArticleLike must be used within ArticleLikeProvider');
  return ctx;
}

export function ArticleLikeProvider({
  articleId,
  initialCount = 0,
  children,
}: {
  articleId: number;
  initialCount?: number;
  children: ReactNode;
}) {
  const value = useDebouncedLike(articleId, initialCount, likeArticleAction);
  return <ArticleLikeContext.Provider value={value}>{children}</ArticleLikeContext.Provider>;
}

export function ArticleLikeHero({ className }: { className?: string }) {
  const { count, like } = useArticleLike();
  return <LikeButtonCore count={count} onLike={like} variant="hero" className={className} />;
}
