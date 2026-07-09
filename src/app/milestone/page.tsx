import { Metadata } from 'next';

import { getMilestoneListCacheAPI } from '@/lib/milestone';

import MilestonePageClient from './components/MilestonePageClient';

import './milestone.css';

export const metadata: Metadata = {
  title: '🌟 人生里程碑',
  description: '记录每一个重要的时刻',
};

export default async () => {
  const { data: listData } = await getMilestoneListCacheAPI();

  return <MilestonePageClient list={listData?.result ?? []} />;
};
