'use client';

import LikeButtonCore from '@/components/LikeButton/LikeButtonCore';
import ArticleSharePoster, { type ArticleShareData } from '@/components/SharePoster/ArticleSharePoster';
import { useArticleLike } from '../Like';

interface ActionBarProps {
  share: Omit<ArticleShareData, 'likeCount'>;
}

export function ArticleActionBar({ share }: ActionBarProps) {
  const { count, like } = useArticleLike();

  return (
    <div className="my-8 flex flex-col items-center gap-2.5">
      <div className="flex flex-wrap items-stretch justify-center gap-4">
        <LikeButtonCore count={count} onLike={like} size="lg" showHint={false} />
        <ArticleSharePoster
          data={{
            ...share,
            likeCount: count,
          }}
        />
      </div>
      <p className="text-center text-xs leading-relaxed text-slate-400 dark:text-slate-500">
        点击为作者加油 ❤️ · 生成海报分享给好友
      </p>
    </div>
  );
}
