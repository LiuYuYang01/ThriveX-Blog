import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';

import { getAlbumListCacheAPI, getAlbumPhotosCacheAPI } from '@/lib/album';
import AlbumPhotos from './components/AlbumPhotos';

const getAlbumId = (value: string) => {
  const albumId = Number(value);
  return Number.isInteger(albumId) && albumId > 0 ? albumId : null;
};

export async function generateMetadata({ params }: PageProps<'/album/[id]'>): Promise<Metadata> {
  const { id } = await params;
  const albumId = getAlbumId(id);
  if (!albumId) return { title: '相册' };

  const response = await getAlbumListCacheAPI();
  const album = response.data?.result.find((item) => item.id === albumId);

  return {
    title: album?.name ?? '相册',
    description: album?.description || '翻阅这一册被光影收藏的瞬间。',
  };
}

export default async function AlbumPhotosPage({ params }: PageProps<'/album/[id]'>) {
  await connection();
  const { id } = await params;
  const albumId = getAlbumId(id);
  if (!albumId) notFound();

  const [albumResponse, photosResponse] = await Promise.all([
    getAlbumListCacheAPI(),
    getAlbumPhotosCacheAPI(albumId),
  ]);

  if (albumResponse.code !== 200 || photosResponse.code !== 200) {
    throw new Error(photosResponse.message || albumResponse.message || '相册照片加载失败');
  }

  const album = albumResponse.data?.result.find((item) => item.id === albumId);
  if (!album) notFound();

  return <AlbumPhotos album={album} initialPage={photosResponse.data} />;
}
