import { cacheLife, cacheTag } from 'next/cache';

import { getRecordListAPI } from '@/api/record';
import { CACHE_TAGS } from '@/lib/cache-tags';

export async function getRecordListCacheAPI(params: Page = {}) {
  'use cache';
  const pageNum = params.pageNum ?? 1;
  const pageSize = params.pageSize ?? 8;

  cacheLife('blog');
  cacheTag(CACHE_TAGS.records);

  return getRecordListAPI(params);
}
