'use client';

import { useState } from 'react';
import Link from 'next/link';
import { HiOutlineArrowDown, HiOutlineArrowLeft, HiOutlineArrowPath, HiOutlinePhoto } from 'react-icons/hi2';

import { getAlbumPhotosAPI } from '@/api/album';
import OptimizedImage from '@/components/OptimizedImage';
import { PageHeroGrid } from '@/components/PageHeroHeader';
import PhotoPreview, { type PhotoItem } from '@/ThriveUI/PhotoPreview';
import { Album, AlbumPhoto, AlbumPhotosPage } from '@/types/app/album';

interface AlbumPhotosProps {
  album: Album;
  initialPage: AlbumPhotosPage;
}

const getAspectRatio = (photo: AlbumPhoto) => {
  if (!photo.width || !photo.height) return '4 / 3';
  return `${photo.width} / ${photo.height}`;
};

export default function AlbumPhotos({ album, initialPage }: AlbumPhotosProps) {
  const [photos, setPhotos] = useState(initialPage.result);
  const [page, setPage] = useState(initialPage.page);
  const [hasMore, setHasMore] = useState(initialPage.next);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  const previewPhotos: PhotoItem[] = photos.map((photo, index) => ({
    id: String(photo.id),
    url: photo.originalUrl || photo.url,
    thumb: photo.url,
    alt: photo.description || `${album.name}相册第 ${index + 1} 张照片`,
  }));

  const openPreview = (index: number) => {
    setPreviewIndex(index);
    setPreviewOpen(true);
  };

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    setLoadError('');

    try {
      const response = await getAlbumPhotosAPI(album.id, {
        page: page + 1,
        limit: initialPage.size || 40,
      });
      if (response.code !== 200) throw new Error(response.message || '加载失败');

      setPhotos((current) => {
        const currentIds = new Set(current.map((photo) => photo.id));
        return [...current, ...response.data.result.filter((photo) => !currentIds.has(photo.id))];
      });
      setPage(response.data.page);
      setHasMore(response.data.next);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : '加载失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-[#f7f8fa] pb-20 dark:bg-black-a">
      <PageHeroGrid />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-28 sm:px-6 sm:pt-32">
        <Link
          href="/album"
          className="inline-flex min-h-11 cursor-pointer items-center gap-2 text-sm text-[#667085] hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:text-slate-400 dark:hover:text-primary"
        >
          <HiOutlineArrowLeft className="size-4" />
          返回画廊
        </Link>

        <header className="mt-8 mb-10">
          <h1 className="text-4xl font-semibold tracking-tight text-[#1d2433] dark:text-white sm:text-5xl">{album.name}</h1>
          {album.description ? (
            <p className="mt-3 max-w-2xl text-base leading-7 text-[#667085] dark:text-slate-400">{album.description}</p>
          ) : null}
          <p className="mt-2 text-sm text-[#8a94a3] dark:text-slate-500">{initialPage.total} 张照片</p>
        </header>

        {photos.length ? (
          <div className="columns-1 gap-4 sm:columns-2 sm:gap-5 lg:columns-3">
            {photos.map((photo, index) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => openPreview(index)}
                className="group relative mb-4 block w-full cursor-zoom-in overflow-hidden rounded-2xl bg-[#e9edf3] break-inside-avoid focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-primary dark:bg-[#303946] sm:mb-5"
                style={{ aspectRatio: getAspectRatio(photo) }}
                aria-label={`预览${album.name}相册第 ${index + 1} 张照片`}
              >
                <span className="absolute inset-0 flex items-center justify-center text-[#a8b0bd] dark:text-slate-600" aria-hidden="true">
                  <HiOutlinePhoto className="size-9" />
                </span>
                <OptimizedImage
                  src={photo.url}
                  alt={photo.description || `${album.name}相册第 ${index + 1} 张照片`}
                  fill
                  priority={index < 4}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02] group-focus-visible:scale-[1.02] motion-reduce:transition-none motion-reduce:transform-none"
                  onError={(event) => {
                    event.currentTarget.style.opacity = '0';
                  }}
                />
              </button>
            ))}
          </div>
        ) : (
          <div className="flex min-h-60 flex-col items-center justify-center text-center">
            <HiOutlinePhoto className="size-10 text-[#a8b0bd] dark:text-slate-600" />
            <p className="mt-4 text-sm text-[#7c8798] dark:text-slate-400">暂无照片</p>
          </div>
        )}

        {loadError ? (
          <div className="mt-10 text-center" role="alert">
            <p className="text-sm text-rose-600 dark:text-rose-300">{loadError}</p>
            <button
              type="button"
              onClick={loadMore}
              className="mt-3 inline-flex min-h-11 cursor-pointer items-center gap-2 text-sm font-medium text-rose-600 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 dark:text-rose-300"
            >
              <HiOutlineArrowPath className="size-4" />
              再试一次
            </button>
          </div>
        ) : null}

        {photos.length && hasMore ? (
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={loadMore}
              disabled={loading}
              className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-[#1d2433] px-5 text-sm font-medium text-white hover:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-[#1d2433] dark:hover:bg-primary dark:hover:text-white"
            >
              {loading ? <HiOutlineArrowPath className="size-4 animate-spin motion-reduce:animate-none" /> : <HiOutlineArrowDown className="size-4" />}
              {loading ? '加载中' : '加载更多'}
            </button>
          </div>
        ) : null}
      </div>

      <PhotoPreview
        open={previewOpen}
        photos={previewPhotos}
        index={previewIndex}
        onClose={() => setPreviewOpen(false)}
        onIndexChange={setPreviewIndex}
      />
    </main>
  );
}
