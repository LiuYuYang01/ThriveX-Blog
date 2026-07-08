import { Metadata } from 'next';
import { getFootprintListCacheAPI } from '@/lib/footprint';
import FootprintPageClient from './components/FootprintPageClient';

export const metadata: Metadata = {
  title: '⛳️ 那年走过的路',
  description: '⛳️ 那年走过的路',
};

export default async () => {
  const { data } = await getFootprintListCacheAPI();
  return <FootprintPageClient list={data?.result ?? []} />;
};
