import { cacheLife, cacheTag } from 'next/cache';

import { getRssListAPI } from '@/api/rss';
import { CACHE_TAGS } from '@/lib/cache-tags';

export async function getRssListCacheAPI(params: Page = {}) {
  'use cache';
  cacheLife('blog');
  cacheTag(CACHE_TAGS.rss);

  return getRssListAPI(params);
}
