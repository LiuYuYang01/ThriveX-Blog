import { cacheLife, cacheTag } from 'next/cache';

import { getWebListAPI, getWebTypeListAPI } from '@/api/web';
import { CACHE_TAGS } from '@/lib/cache-tags';

export async function getWebTypeListCacheAPI() {
  'use cache';

  cacheLife('blog');
  cacheTag(CACHE_TAGS.webs);

  return getWebTypeListAPI();
}

export async function getWebListCacheAPI() {
  'use cache';

  cacheLife('blog');
  cacheTag(CACHE_TAGS.webs);

  return getWebListAPI();
}
