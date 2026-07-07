'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import { LiaTagsSolid } from 'react-icons/lia';
import { Tag } from '@/types/app/tag';
import { clsx } from 'clsx';

interface TagItemCardProps {
  data: Tag;
  count: number;
  index: number;
}

// 颜色数组提取到组件外部，避免重复创建
const COLORS = ['bg-blue-400/20', 'bg-green-400/20', 'bg-yellow-400/20', 'bg-red-400/20', 'bg-indigo-400/20', 'bg-purple-400/20', 'bg-pink-400/20'] as const;

const TagItemCard = memo(
  ({ data, count, index }: TagItemCardProps) => {
    const color = COLORS[index % COLORS.length];
    const href = `/tag/${data?.id}?name=${encodeURIComponent(data?.name || '')}`;

    return (
      <Link
        href={href}
        className={clsx('flex h-10 transition-[scale] duration-200 ease-out hover:scale-105', color)}
        style={{
          borderRadius: '0.5rem',
          margin: '0.5rem',
          padding: '0 1rem',
          alignItems: 'center',
          contain: 'layout style paint', // CSS containment 隔离渲染
          transform: 'translateZ(0)', // 启用硬件加速
          backfaceVisibility: 'hidden', // 优化渲染性能
        }}
        prefetch={false} // 禁用预取，减少初始加载
      >
        <LiaTagsSolid className="h-4 w-4 text-gray-400 shrink-0" aria-hidden="true" />
        <span className="ml-2 truncate max-w-[200px]" title={data?.name}>
          {data?.name}
        </span>
        <span className="ml-4 text-sm text-gray-400 dark:text-gray-500 shrink-0">{count}</span>
      </Link>
    );
  },
  (prevProps, nextProps) => {
    // 自定义比较函数，只有关键属性变化时才重新渲染
    return prevProps.data?.id === nextProps.data?.id && prevProps.data?.name === nextProps.data?.name && prevProps.count === nextProps.count && prevProps.index === nextProps.index;
  }
);

TagItemCard.displayName = 'TagItemCard';

export default TagItemCard;
