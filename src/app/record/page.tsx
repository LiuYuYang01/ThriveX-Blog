import { Metadata } from 'next';
import { getRecordListCacheAPI } from '@/lib/record';
import { getAuthorDataAPI } from '@/api/user';
import RecordPageClient from './components/RecordPageClient';

export const metadata: Metadata = {
  title: '日记',
  description: '记录生活，遇见美好',
};

export default async () => {
  const [userRes, recordRes] = await Promise.all([
    getAuthorDataAPI(),
    getRecordListCacheAPI({ pageNum: 1, pageSize: 8 }),
  ]);

  return (
    <RecordPageClient
      user={userRes?.data ?? null}
      initialRecords={recordRes?.data?.result ?? []}
      initialTotal={recordRes?.data?.total ?? 0}
      totalPages={recordRes?.data?.pages ?? 1}
    />
  );
};
