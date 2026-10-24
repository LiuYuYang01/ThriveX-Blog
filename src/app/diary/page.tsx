import { Metadata } from 'next';
import { connection } from 'next/server';

import { getDiaryQuestionListAPI } from '@/api/diary';
import { getDiaryBookDataAPI, readDiaryToken } from '@/lib/diary';
import DiaryGate from './components/DiaryGate';
import DiaryBook from './components/DiaryBook';

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

  // 有凭证就先替读者取回内容，取不到（过期/失效）就退回封面
  if (token) {
    const { code, data: book } = await getDiaryBookDataAPI();
    if (code === 200 && book) return <DiaryBook book={book} />;
  }

  return <DiaryGate questions={questions} expired={!!token} />;
}
