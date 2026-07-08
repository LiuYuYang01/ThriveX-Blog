import { cacheLife, cacheTag } from 'next/cache';

import { getTagArticleListAPI, getTagListAPI } from '@/api/tag';
import { CACHE_TAGS } from '@/lib/cache-tags';

export async function getTagListCacheAPI() {
  'use cache';
  cacheLife('blog');
  cacheTag(CACHE_TAGS.tags);

  return getTagListAPI();
}

export async function getTagArticleListCacheAPI(id: number, params: Page = {}) {
  'use cache';
  const pageNum = params.pageNum ?? 1;
  const pageSize = params.pageSize ?? 8;

  cacheLife('blog');
  cacheTag(CACHE_TAGS.tags);

  return getTagArticleListAPI(id, { pageNum, pageSize });
}
