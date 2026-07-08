import { cacheLife, cacheTag } from 'next/cache';

import { getCateWallListAPI } from '@/api/wall';
import { CACHE_TAGS } from '@/lib/cache-tags';

export async function getCateWallListCacheAPI(cateId: number) {
  'use cache';

  cacheLife('blog');
  cacheTag(CACHE_TAGS.walls, `${CACHE_TAGS.wall}-${cateId}`);

  return getCateWallListAPI(cateId);
}
