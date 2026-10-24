import { NextResponse } from 'next/server';

import { DIARY_COOKIE, diaryCookieOptions, verifyDiaryAnswerAPI } from '@/lib/diary';

export async function POST(req: Request) {
  const { questionId, answer } = (await req.json().catch(() => ({}))) as {
    questionId?: number;
    answer?: string;
  };

  if (!Number.isInteger(questionId) || !answer?.trim()) {
    return NextResponse.json({ code: 400, message: '先选一句密语，再写上答案', data: null });
  }

  const { code, message, data } = await verifyDiaryAnswerAPI(Number(questionId), answer);

  if (code !== 200 || !data?.token) {
    return NextResponse.json({ code: code ?? 500, message: message ?? '暂时打不开，稍后再试', data: null });
  }

  // 令牌只进 Cookie，响应体里没有它
  const res = NextResponse.json({ code: 200, message: '本子打开了', data: null });
  res.cookies.set(DIARY_COOKIE, data.token, diaryCookieOptions(data.maxAge));
  return res;
}
