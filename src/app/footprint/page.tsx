import { Metadata } from 'next';
import { connection } from 'next/server';
import { getFootprintListCacheAPI } from '@/lib/footprint';
import FootprintPageClient from './components/FootprintPageClient';

export const metadata: Metadata = {
  title: '⛳️ 那年走过的路',
  description: '⛳️ 那年走过的路',
};

export default async () => {
  await connection();
  const { data } = await getFootprintListCacheAPI();
  return <FootprintPageClient list={data?.result ?? []} />;
};
