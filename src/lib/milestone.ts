import { cacheLife, cacheTag } from 'next/cache';

import { getMilestoneListAPI } from '@/api/milestone';
import { CACHE_TAGS } from '@/lib/cache-tags';

export async function getMilestoneListCacheAPI() {
  'use cache';
  cacheLife('blog');
  cacheTag(CACHE_TAGS.milestones);

  return getMilestoneListAPI();
}
