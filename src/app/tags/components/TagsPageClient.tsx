'use client';

import React from 'react';
import { Tag } from '@/types/app/tag';
import TagCloudBackground from '@/app/tags/components/TagCloudBackground';
import PageHeroHeader, { PageHeroGrid } from '@/components/PageHeroHeader';
import VirtualizedTagList from './VirtualizedTagList';

interface TagsPageClientProps {
  tags: Tag[];
}

export default function TagsPageClient({ tags }: TagsPageClientProps) {
  const tagNames = tags.map((item: Tag) => item.name).filter(Boolean);

  return (
    <div className="relative min-h-screen hide_sliding">
      <PageHeroGrid />
      <PageHeroHeader title="标签墙" subtitle="拾取标签，发现更多感兴趣的内容" className="z-20" />

      <div className="relative z-20 w-11/12 mx-auto mt-4">
        <VirtualizedTagList tags={tags} initialBatchSize={30} batchSize={30} />
      </div>

      {/* 背景动画 */}
      <TagCloudBackground tags={tagNames} />
    </div>
  );
}
