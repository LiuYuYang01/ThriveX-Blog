import { cacheLife, cacheTag } from 'next/cache';

import { getCommentListAPI } from '@/api/comment';
import { CACHE_TAGS } from '@/lib/cache-tags';

export async function getCommentListCacheAPI(params: Page = {}) {
  'use cache';
  cacheLife('blog');
  cacheTag(CACHE_TAGS.comments);

  return getCommentListAPI(params);
}
