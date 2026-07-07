import { Metadata } from 'next';
import { getFootprintListAPI } from '@/api/footprint';
import FootprintPageClient from './components/FootprintPageClient';

export const metadata: Metadata = {
  title: '⛳️ 那年走过的路',
  description: '⛳️ 那年走过的路',
};

export default async () => {
  const { data } = await getFootprintListAPI();
  return <FootprintPageClient list={data?.result ?? []} />;
};
