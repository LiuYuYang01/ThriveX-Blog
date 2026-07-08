'use client';

import useDebouncedLike from '@/hooks/useDebouncedLike';
import LikeButtonCore from './LikeButtonCore';

type LikeAPI = (id: number, count: number) => Promise<{ code?: number; data?: number }>;

interface Props {
  entityId: number;
  initialCount?: number;
  likeAPI: LikeAPI;
  size?: 'md' | 'lg';
  variant?: 'default' | 'hero' | 'inline';
  minimal?: boolean;
  className?: string;
}

export default function LikeButton({ entityId, initialCount = 0, likeAPI, size = 'md', variant = 'default', minimal, className }: Props) {
  const { count, like } = useDebouncedLike(entityId, initialCount, likeAPI);

  return (
    <LikeButtonCore
      count={count}
      onLike={like}
      size={size}
      variant={variant}
      minimal={minimal}
      className={className}
    />
  );
}
