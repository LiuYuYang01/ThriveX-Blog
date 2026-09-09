'use client';

import { RiChat3Line } from 'react-icons/ri';
import {
  actionMinimalCountClass,
  actionMinimalIconClass,
  actionMinimalItemClass,
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
    <button
      type="button"
      onClick={scrollToComment}
      aria-label="查看评论"
      className={cn(actionMinimalItemClass, 'hover:bg-orange-50 dark:hover:bg-orange-500/10', className)}
    >
      <RiChat3Line className={cn(actionMinimalIconClass, 'text-lg text-orange-500')} />
      <span className={cn('tabular-nums', actionMinimalCountClass)}>{count}</span>
    </button>
  );
}
