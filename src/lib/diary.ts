import { cookies } from 'next/headers';

import type { Diary } from '@/types/app/diary';

// 访客阅读凭证：HttpOnly，页面脚本读不到，只由本站接口写入
export const DIARY_COOKIE = 'thrivex_diary_reader';

const DEFAULT_MAX_AGE = 7 * 24 * 60 * 60;
const READER_HEADER = 'X-Diary-Token';

const getApiUrl = () => process.env.PROJECT_API_INTERNAL || process.env.NEXT_PUBLIC_PROJECT_API || '';

export const diaryCookieOptions = (maxAge?: number) => ({
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: Number(maxAge) > 0 ? Number(maxAge) : DEFAULT_MAX_AGE,
});

export async function readDiaryToken() {
  const cookieStore = await cookies();
  return cookieStore.get(DIARY_COOKIE)?.value ?? '';
}

// 服务端带令牌直连后端；没有凭证时直接给出与后端一致的 401
export async function getDiaryPagesDataAPI(): Promise<ResponseData<Diary[] | null>> {
  const token = await readDiaryToken();
  if (!token) return { code: 401, message: '请先答出密语', data: null };

  const res = await fetch(`${getApiUrl()}/diary/pages`, {
    headers: { [READER_HEADER]: token },
    cache: 'no-store',
  });
  return res.json() as Promise<ResponseData<Diary[] | null>>;
}

// 服务端把答案交给后端校验，令牌只写 Cookie，不回传页面
export async function verifyDiaryAnswerAPI(questionId: number, answer: string) {
  const res = await fetch(`${getApiUrl()}/diary/unlock`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ questionId, answer }),
    cache: 'no-store',
  });
  return res.json() as Promise<ResponseData<{ token: string; maxAge: number } | null>>;
}
