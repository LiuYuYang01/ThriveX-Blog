import { Metadata } from 'next';
import { connection } from 'next/server';

import { getRecordListCacheAPI } from '@/lib/record';
import RecordTimeline from './components/RecordTimeline';

export const metadata: Metadata = {
  title: '闪念',
  description: '记录生活，遇见美好',
};

const PAGE_SIZE = 10;

interface Props {
  searchParams: Promise<{ id?: string }>;
}

export default async (props: Props) => {
  await connection();
  const { id } = await props.searchParams;
  const { data } = await getRecordListCacheAPI({ pageNum: 1, pageSize: PAGE_SIZE });

  return (
    <RecordTimeline
      initialList={data?.result ?? []}
      initialPages={data?.pages ?? 1}
      pageSize={PAGE_SIZE}
      focusId={id ? Number(id) : null}
    />
  );
};
