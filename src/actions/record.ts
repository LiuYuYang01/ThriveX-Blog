'use server';

import { refresh, updateTag } from 'next/cache';

import { Request } from '@/utils/request';
import { CACHE_TAGS } from '@/lib/cache-tags';
import { RecordComment } from '@/types/app/recordComment';

export async function likeRecordAction(id: number, count: number) {
  const result = await Request<number>('POST', `/record/${id}/like`, { count });

  if (result.code === 200) {
    updateTag(CACHE_TAGS.records);
    updateTag(`${CACHE_TAGS.record}-${id}`);
    refresh();
  }

  return result;
}

export async function addRecordCommentAction(data: RecordComment) {
  const result = await Request('POST', '/record/comment', data);

  // 如果请求成功则更新缓存
  if (data.recordId && result.code === 200) {
    // 更新说说列表缓存
    updateTag(CACHE_TAGS.records);
    // 更新说说详情缓存
    updateTag(`${CACHE_TAGS.record}-${data.recordId}`);
    // 更新说说评论列表缓存
    updateTag(`${CACHE_TAGS.comments}-${data.recordId}`);
    // 触发页面重新渲染
    refresh();
  }

  return result;
}
