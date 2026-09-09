'use client';

import LikeButtonCore from '@/components/LikeButton/LikeButtonCore';
import ArticleSharePoster, { type ArticleShareData } from '@/components/SharePoster/ArticleSharePoster';
import CommentAction from './CommentAction';
import { actionBarDividerClass, actionBarPillClass } from '@/components/ActionCard/styles';
import { useArticleLike } from '../Like';
import { useArticleShare } from '../Share';

interface ActionBarProps {
  share: Omit<ArticleShareData, 'likeCount'>;
  commentCount?: number;
}

export function ArticleActionBar({ share, commentCount = 0 }: ActionBarProps) {
  const { count, like } = useArticleLike();
  const { count: shareCount, recordShare } = useArticleShare();

  return (
    <div className="my-8 flex justify-center">
      <div className={actionBarPillClass}>
        <LikeButtonCore count={count} onLike={like} size="lg" minimal showHint={false} />
        <span className={actionBarDividerClass} aria-hidden />
        <ArticleSharePoster
          minimal
          shareCount={shareCount}
          onShare={() => void recordShare()}
          data={{
            ...share,
            likeCount: count,
          }}
        />
        <span className={actionBarDividerClass} aria-hidden />
        <CommentAction count={commentCount} />
      </div>
    </div>
  );
}
