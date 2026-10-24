import { Request } from '@/utils';
import type { DiaryQuestion } from '@/types/app/diary';

// 密语问题：公开接口，后端只返回问题
export const getDiaryQuestionListAPI = () => Request<DiaryQuestion[]>('GET', '/diary/questions');

// 以下两个接口都是本站代理，阅读令牌只存在于 HttpOnly Cookie 中
export const unlockDiaryAPI = async (questionId: number, answer: string) => {
  const res = await fetch('/api/diary/unlock', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ questionId, answer }),
  });
  return res.json() as Promise<ResponseData<null>>;
};

export const lockDiaryAPI = () => fetch('/api/diary/lock', { method: 'POST' });
