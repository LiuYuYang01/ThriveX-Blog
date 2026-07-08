'use server';

import { refresh, updateTag } from 'next/cache';

import { Request } from '@/utils/request';
import { CACHE_TAGS } from '@/lib/cache-tags';
import { Comment } from '@/types/app/comment';

export async function likeArticleAction(id: number, count: number) {
  const result = await Request<number>('POST', `/article/${id}/like`, { count });

  if (result.code === 200) {
    updateTag(`${CACHE_TAGS.article}-${id}`);
    updateTag(CACHE_TAGS.articles);
  }

  return result;
}

export async function addArticleCommentAction(data: Comment) {
  const result = await Request('POST', '/comment', data);

  // 如果请求成功则更新缓存
  if (data.articleId && result.code === 200) {
    // 更新文章详情缓存
    updateTag(`${CACHE_TAGS.article}-${data.articleId}`);
    updateTag(CACHE_TAGS.articles);
    updateTag(CACHE_TAGS.comments);
    updateTag(`${CACHE_TAGS.comments}-${data.articleId}`);
    // 触发页面重新渲染
    refresh();
  }

  return result;
}
