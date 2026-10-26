import { Metadata } from 'next';
import { connection } from 'next/server';

import { getDiaryQuestionListAPI } from '@/api/diary';
import { getDiaryPagesDataAPI, readDiaryToken } from '@/lib/diary';
import DiaryGate from './components/DiaryGate';
import DiaryReader from './components/DiaryReader';

import './diary.scss';

export const metadata: Metadata = {
  title: '日记本',
  description: '只写给答得出密语的人',
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default async function DiaryPage() {
  await connection();

  const [{ data }, token] = await Promise.all([getDiaryQuestionListAPI(), readDiaryToken()]);
  const questions = data ?? [];

  // 有凭证就先替读者取回整本，取不到（过期/失效）就退回封面
  if (token) {
    const { code, data } = await getDiaryPagesDataAPI();
    // 最新的排在前面，翻开就是第一页
    if (code === 200 && data) return <DiaryReader pages={[...data].reverse()} />;
  }

  return <DiaryGate questions={questions} expired={!!token} />;
}
