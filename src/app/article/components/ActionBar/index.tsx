'use client';

import LikeButtonCore from '@/components/LikeButton/LikeButtonCore';
import ArticleSharePoster, { type ArticleShareData } from '@/components/SharePoster/ArticleSharePoster';
import CommentAction from './CommentAction';
import { actionBarClass } from '@/components/ActionCard/styles';
import { useArticleLike } from '../Like';
import { useArticleShare } from '../Share';
import { cn } from '@/lib/utils';

interface ActionBarProps {
  share: Omit<ArticleShareData, 'likeCount'>;
  commentCount?: number;
}

export function ArticleActionBar({ share, commentCount = 0 }: ActionBarProps) {
  const { count, like } = useArticleLike();
  const { count: shareCount, recordShare } = useArticleShare();

  return (
    <div className="my-8 flex justify-center">
      <div className={cn(actionBarClass, 'items-start')}>
        <LikeButtonCore count={count} onLike={like} size="lg" minimal showHint={false} />
        <ArticleSharePoster
          minimal
          shareCount={shareCount}
          onShare={() => void recordShare()}
          data={{
            ...share,
            likeCount: count,
          }}
        />
        <CommentAction count={commentCount} />
      </div>
    </div>
  );
}
