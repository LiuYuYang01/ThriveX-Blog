'use server';

import { refresh, updateTag } from 'next/cache';

import { Request } from '@/utils/request';
import { CACHE_TAGS } from '@/lib/cache-tags';
import { Web } from '@/types/app/web';

export async function addWebAction(data: Web) {
  const result = await Request('POST', '/link', data);

  // 如果请求成功则更新缓存
  if (result.code === 200) {
    // 更新友链列表缓存
    updateTag(CACHE_TAGS.webs);
    // 触发页面重新渲染
    refresh();
  }

  return result;
}
