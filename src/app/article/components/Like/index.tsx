'use client';

import { createContext, useContext, type ReactNode } from 'react';
import useDebouncedLike from '@/hooks/useDebouncedLike';
import { likeArticleAPI } from '@/api/article';
import LikeButtonCore from '@/components/LikeButton/LikeButtonCore';

interface ArticleLikeContextValue {
  count: number;
  like: () => void;
}

const ArticleLikeContext = createContext<ArticleLikeContextValue | null>(null);

function useArticleLike() {
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
  const value = useDebouncedLike(articleId, initialCount, likeArticleAPI);
  return <ArticleLikeContext.Provider value={value}>{children}</ArticleLikeContext.Provider>;
}

export function ArticleLikeHero() {
  const { count, like } = useArticleLike();
  return <LikeButtonCore count={count} onLike={like} variant="hero" />;
}

export function ArticleLikeFooter() {
  const { count, like } = useArticleLike();
  return (
    <div className="my-8 flex justify-center">
      <LikeButtonCore count={count} onLike={like} size="lg" />
    </div>
  );
}
