'use client';

import Link from 'next/link';
import { HiOutlinePhoto } from 'react-icons/hi2';

import OptimizedImage from '@/components/OptimizedImage';
import PageHeroHeader, { PageHeroGrid } from '@/components/PageHeroHeader';
import { Album } from '@/types/app/album';

interface AlbumGalleryProps {
  albums: Album[];
}

export default function AlbumGallery({ albums }: AlbumGalleryProps) {
  return (
    <main className="relative min-h-screen bg-[#f7f8fa] pb-20 dark:bg-black-a">
      <PageHeroGrid />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6">
        <PageHeroHeader title="画廊" subtitle="风景并不惊艳，只是回忆加了分" />

        {albums.length ? (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {albums.map((album) => (
              <Link
                key={album.id}
                href={`/album/${album.id}`}
                prefetch={false}
                className="group relative block aspect-[4/3] cursor-pointer overflow-hidden rounded-2xl bg-[#e9edf3] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-primary dark:bg-[#303946]"
                aria-label={`打开${album.name}相册，共 ${album.photoCount} 张照片`}
              >
                <span className="absolute inset-0 flex items-center justify-center text-[#a8b0bd] dark:text-slate-600" aria-hidden="true">
                  <HiOutlinePhoto className="size-10" />
                </span>
                <OptimizedImage
                  src={album.cover}
                  alt={`${album.name}相册封面`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] group-focus-visible:scale-[1.03] motion-reduce:transition-none motion-reduce:transform-none"
                  onError={(event) => {
                    event.currentTarget.style.opacity = '0';
                  }}
                />
                <span className="absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-transparent" aria-hidden="true" />
                <span className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                  <span className="block text-xl font-semibold text-white">{album.name}</span>
                  <span className="mt-1 block text-xs text-white/70">{album.photoCount} 张照片</span>
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-16 flex min-h-60 flex-col items-center justify-center text-center">
            <HiOutlinePhoto className="size-10 text-[#a8b0bd] dark:text-slate-600" />
            <p className="mt-4 text-sm text-[#7c8798] dark:text-slate-400">暂无相册</p>
          </div>
        )}
      </div>
    </main>
  );
}
