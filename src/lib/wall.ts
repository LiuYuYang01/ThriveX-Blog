import { cacheLife, cacheTag } from 'next/cache';

import { getCateListAPI as getWallCateListAPI, getCateWallListAPI } from '@/api/wall';
import { CACHE_TAGS } from '@/lib/cache-tags';

export async function getWallCateListCacheAPI() {
  'use cache';

  cacheLife('blog');
  cacheTag(CACHE_TAGS.walls);

  return getWallCateListAPI();
}

export async function getCateWallListCacheAPI(cateId: number) {
  'use cache';

  cacheLife('blog');
  cacheTag(CACHE_TAGS.walls);

  return getCateWallListAPI(cateId);
}
