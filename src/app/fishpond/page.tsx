import { Metadata } from 'next';
import { getRssListCacheAPI } from '@/lib/rss';
import FishpondPageClient from './components/FishpondPageClient';

export const metadata: Metadata = {
  title: '🐟 鱼塘 | Rss Feed',
  description: '汇聚好友与订阅的动态鱼塘',
};

export default async () => {
  const { data } = await getRssListCacheAPI();
  return <FishpondPageClient rssData={data?.result ?? []} />;
};
