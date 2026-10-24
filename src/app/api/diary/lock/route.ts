import { NextResponse } from 'next/server';

import { DIARY_COOKIE } from '@/lib/diary';

// 合上本子：清掉阅读凭证，日记重新对访客关闭
export function POST() {
  const res = NextResponse.json({ code: 200, message: '本子合上了', data: null });
  res.cookies.delete(DIARY_COOKIE);
  return res;
}
