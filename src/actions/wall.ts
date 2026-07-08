'use server';

import { refresh, updateTag } from 'next/cache';

import { Request } from '@/utils/request';
import { CACHE_TAGS } from '@/lib/cache-tags';
import { Wall } from '@/types/app/wall';

export async function addWallAction(data: Wall) {
  const result = await Request('POST', '/wall', data);

  // 如果请求成功则更新缓存
  if (result.code === 200) {
    updateTag(CACHE_TAGS.walls);
    refresh();
  }

  return result;
}
