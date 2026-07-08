import { cacheLife, cacheTag } from 'next/cache';

import { getSwiperListAPI } from '@/api/swiper';
import { CACHE_TAGS } from '@/lib/cache-tags';

export async function getSwiperListCacheAPI() {
  'use cache';
  cacheLife('blog');
  cacheTag(CACHE_TAGS.swipers);

  return getSwiperListAPI();
}
