import { cacheLife, cacheTag } from 'next/cache';

import { getArticleDataAPI, getArticlePagingAPI, getRandomArticleListAPI } from '@/api/article';
import { CACHE_TAGS } from '@/lib/cache-tags';

type ArticlePagingParams = {
  pageNum?: number;
  pageSize?: number;
  key?: string;
};

export async function getArticleCacheAPI(id: number) {
  'use cache';
  // 缓存生命周期, 到期后自动清理缓存
  cacheLife('blog');
  // 缓存标签, 通过 cacheTag 函数将多个缓存标签关联在一起，可使用 revalidateTag 手动使缓存失效
  cacheTag(CACHE_TAGS.articles, `${CACHE_TAGS.article}-${id}`);
  // revalidateTag('articles', 'max')    // 所有带 articles 标签的缓存都失效
  // revalidateTag('article-123', 'max') // 只失效 id=123 的详情

  return getArticleDataAPI(id);
}

export async function getArticlePagingCacheAPI(params: ArticlePagingParams = {}) {
  'use cache';
  const pageNum = params.pageNum ?? 1;
  const pageSize = params.pageSize ?? 8;
  const key = params.key ?? '';

  cacheLife('blog');
  cacheTag(
    CACHE_TAGS.articles,
    `${CACHE_TAGS.articlesList}-${pageNum}-${pageSize}`,
    ...(key ? [`${CACHE_TAGS.articlesList}-search-${key}`] : []),
  );

  return getArticlePagingAPI({
    pageNum,
    pageSize,
    ...(key ? { key } : {}),
  });
}

export async function getRandomArticleListCacheAPI() {
  'use cache';
  cacheLife('blog');
  cacheTag(CACHE_TAGS.articles);

  return getRandomArticleListAPI();
}

/** 获取全部文章列表，用于归档、sitemap 等需要完整数据的场景 */
export async function getAllArticleListCacheAPI() {
  'use cache';
  cacheLife('blog');
  cacheTag(CACHE_TAGS.articles, `${CACHE_TAGS.articlesList}-all`);

  return getArticlePagingAPI();
}
