import { Metadata } from 'next';
import { connection } from 'next/server';
import { getCommentListCacheAPI } from '@/lib/comment';
import EchoesPageClient from './components/EchoesPageClient';

export const metadata: Metadata = {
  title: '💬 一些互动',
  description: '汇聚来自四面八方的声音',
};

const PAGE_SIZE = 16;

export default async () => {
  await connection();
  const { data } = await getCommentListCacheAPI({ pageNum: 1, pageSize: PAGE_SIZE });

  return (
    <EchoesPageClient
      initialList={data?.result ?? []}
      initialTotal={data?.total ?? 0}
      initialPages={data?.pages ?? 1}
      pageSize={PAGE_SIZE}
    />
  );
};
