import { cacheLife, cacheTag } from 'next/cache';

import { getFootprintListAPI } from '@/api/footprint';
import { CACHE_TAGS } from '@/lib/cache-tags';

export async function getFootprintListCacheAPI() {
  'use cache';
  cacheLife('blog');
  cacheTag(CACHE_TAGS.footprints);

  return getFootprintListAPI();
}
