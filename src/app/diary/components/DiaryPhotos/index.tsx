'use client';

import { useState } from 'react';
import PhotoPreview, { type PhotoItem } from '@/ThriveUI/PhotoPreview';

interface Props {
  images: string[];
}

const MAX_SHOW = 9;

export default function DiaryPhotos({ images }: Props) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  if (!images.length) return null;

  const photos: PhotoItem[] = images.map((url, i) => ({ id: `${i}`, url, alt: `日记照片 ${i + 1}` }));
  const more = images.length - MAX_SHOW;

  return (
    <>
      <div className="mt-4 flex flex-wrap gap-2">
        {photos.slice(0, MAX_SHOW).map((photo, i) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => {
              setIndex(i);
              setOpen(true);
            }}
            className="group relative size-24 cursor-pointer overflow-hidden rounded-lg ring-1 ring-black/8 sm:size-28 dark:ring-white/12"
          >
            <img src={photo.url} alt={photo.alt} className="h-full w-full object-cover transition-[scale] duration-500 ease-out group-hover:scale-105" />
            {i === MAX_SHOW - 1 && more > 0 ? (
              <>
                <span aria-hidden className="absolute inset-0 bg-[rgba(17,22,25,0.4)]" />
                <span className="absolute inset-0 z-2 grid place-items-center text-base font-bold text-white">+{more}</span>
              </>
            ) : null}
          </button>
        ))}
      </div>

      <PhotoPreview open={open} photos={photos} index={index} onClose={() => setOpen(false)} onIndexChange={setIndex} />
    </>
  );
}
