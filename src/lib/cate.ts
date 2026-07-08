import { cacheLife, cacheTag } from 'next/cache';

import { getCateArticleListAPI, getCateListAPI } from '@/api/cate';
import { CACHE_TAGS } from '@/lib/cache-tags';

export async function getCateListCacheAPI() {
  'use cache';
  cacheLife('blog');
  cacheTag(CACHE_TAGS.cates);

  return getCateListAPI();
}

export async function getCateArticleListCacheAPI(id: number, params: Page = {}) {
  'use cache';
  const pageNum = params.pageNum ?? 1;
  const pageSize = params.pageSize ?? 8;

  cacheLife('blog');
  cacheTag(CACHE_TAGS.cates);

  return getCateArticleListAPI(id, { pageNum, pageSize });
}
