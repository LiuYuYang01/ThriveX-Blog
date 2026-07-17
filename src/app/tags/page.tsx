import { getTagListCacheAPI } from '@/lib/tag';
import { Metadata } from 'next';
import { connection } from 'next/server';
import TagsPageClient from './components/TagsPageClient';

export const metadata: Metadata = {
  title: '🏷️ 标签墙',
  description: '🏷️ 标签墙',
};

export default async () => {
  await connection();
  const { data } = await getTagListCacheAPI();
  return <TagsPageClient tags={data?.result ?? []} />;
};
