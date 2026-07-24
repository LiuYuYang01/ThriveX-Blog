import { Metadata } from 'next';
import { connection } from 'next/server';

import { getAlbumListCacheAPI } from '@/lib/album';
import AlbumGallery from './components/AlbumGallery';

export const metadata: Metadata = {
  title: '画廊',
  description: '风景并不惊艳，只是回忆加了分',
};

export default async function AlbumPage() {
  await connection();
  const response = await getAlbumListCacheAPI();

  if (response.code !== 200) {
    throw new Error(response.message || '相册加载失败');
  }

  return <AlbumGallery albums={response.data?.result ?? []} />;
}
