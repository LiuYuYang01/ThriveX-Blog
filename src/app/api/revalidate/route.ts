/**
 * 按需刷新 ISR 缓存的 Webhook 接口。
 * 后台在内容变更后携带 REVALIDATE_SECRET 调用 POST，即可使指定 cache tag 失效并触发重新生成。
 */

import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

import { CACHE_TAGS } from '@/lib/cache-tags';

const ALLOWED_TAGS = new Set(Object.values(CACHE_TAGS));

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-revalidate-secret');
  // 验证 secret 密钥
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  // 默认缓存标签
  let tags: string[] = [CACHE_TAGS.articles, CACHE_TAGS.config];

  try {
    // 解析请求体
    const body = await req.json();
    // 如果请求体是数组，则使用数组中的标签；否则使用单个标签
    if (Array.isArray(body?.tags)) {
      tags = body.tags;
    } else if (typeof body?.tag === 'string') {
      tags = [body.tag];
    }
  } catch {
    // 无 body 时使用默认 tags
  }

  // 过滤掉无效的标签
  const invalidTags = tags.filter((tag) => !ALLOWED_TAGS.has(tag as (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS]) && !tag.startsWith(`${CACHE_TAGS.article}-`) && !tag.startsWith(`${CACHE_TAGS.articlesList}-`));
  // 如果无效的标签，则返回 400 错误
  if (invalidTags.length) {
    return NextResponse.json({ message: 'Invalid tags', invalidTags }, { status: 400 });
  }

  // 重新验证标签，标记 max 允许先返回旧数据，同时在后台拉新数据
  tags.forEach((tag) => revalidateTag(tag, 'max'));

  // 返回响应
  return NextResponse.json({ revalidated: true, tags });
}
