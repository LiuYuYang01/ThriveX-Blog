'use client';

import { CommentActionIcon } from '@/components/ActionBar/icons';
import {
  actionIconWrapClass,
  actionMinimalButtonClass,
  actionMinimalCountClass,
  actionMinimalIconClass,
  actionMinimalItemClass,
  actionPillClass,
} from '@/components/ActionCard/styles';
import { cn } from '@/lib/utils';

interface Props {
  count: number;
  className?: string;
}

export default function CommentAction({ count, className }: Props) {
  const scrollToComment = () => {
    const element = document.getElementById('article-comment');
    if (!element) return;

    // 滚动到评论区域，并留出100px的间距
    const top = element.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <div className={cn(actionMinimalItemClass, className)}>
      <button
        type="button"
        onClick={scrollToComment}
        className={cn(actionPillClass, actionMinimalButtonClass)}
        aria-label="查看评论"
      >
        <span className={cn(actionIconWrapClass, actionMinimalIconClass, 'flex h-11 w-11 items-center justify-center p-0')}>
          <CommentActionIcon className="h-11 w-11" />
        </span>
      </button>
      <span
        className={cn(
          'mt-1 min-w-[2rem] rounded-full px-2 py-0.5 text-center text-xs font-bold leading-none text-[#FA8511] tabular-nums',
          actionMinimalCountClass,
        )}
      >
        {count}
      </span>
    </div>
  );
}
