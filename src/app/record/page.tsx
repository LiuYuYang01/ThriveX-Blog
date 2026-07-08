import { Metadata } from 'next';
import { getRecordListCacheAPI } from '@/lib/record';
import { getAuthorDataCacheAPI } from '@/lib/config';
import RecordPageClient from './components/RecordPageClient';

export const metadata: Metadata = {
  title: '日记',
  description: '记录生活，遇见美好',
};

export default async () => {
  const [user, recordRes] = await Promise.all([
    getAuthorDataCacheAPI(),
    getRecordListCacheAPI({ pageNum: 1, pageSize: 8 }),
  ]);

  return (
    <RecordPageClient
      user={user ?? null}
      initialRecords={recordRes?.data?.result ?? []}
      initialTotal={recordRes?.data?.total ?? 0}
      totalPages={recordRes?.data?.pages ?? 1}
    />
  );
};
