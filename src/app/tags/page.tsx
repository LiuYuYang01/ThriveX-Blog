import { getTagListCacheAPI } from '@/lib/tag';
import { Metadata } from 'next';
import TagsPageClient from './components/TagsPageClient';

export const metadata: Metadata = {
  title: '🏷️ 标签墙',
  description: '🏷️ 标签墙',
};

export default async () => {
  const { data } = await getTagListCacheAPI();
  return <TagsPageClient tags={data?.result ?? []} />;
};
