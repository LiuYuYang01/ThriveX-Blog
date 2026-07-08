'use server';

import { refresh, updateTag } from 'next/cache';

import { Request } from '@/utils/request';
import { CACHE_TAGS } from '@/lib/cache-tags';
import { Wall } from '@/types/app/wall';

export async function addWallAction(data: Wall) {
  const result = await Request('POST', '/wall', data);

  // 如果请求成功则更新缓存
  if (result.code === 200) {
    // 更新留言列表缓存
    updateTag(CACHE_TAGS.walls);
    // 更新留言分类缓存
    if (data.cateId) {
      updateTag(`${CACHE_TAGS.wall}-${data.cateId}`);
    }
    // 触发页面重新渲染
    refresh();
  }

  return result;
}
