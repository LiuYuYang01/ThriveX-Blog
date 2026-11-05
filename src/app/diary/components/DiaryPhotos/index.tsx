'use client';

import { useState } from 'react';
import PhotoPreview, { type PhotoItem } from '@/ThriveUI/PhotoPreview';

interface Props {
  images: string[];
  // 纸上只摆最前面几张，其余的收进最后一张的 +N
  maxShow?: number;
}

export default function DiaryPhotos({ images, maxShow = 9 }: Props) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  if (!images.length) return null;

  const visible = Math.max(1, maxShow);
  const photos: PhotoItem[] = images.map((url, i) => ({ id: `${i}`, url, alt: `日记照片 ${i + 1}` }));
  const more = images.length - visible;

  return (
    <>
      <div className="mt-4 flex flex-wrap gap-2">
        {photos.slice(0, visible).map((photo, i) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => {
              setIndex(i);
              setOpen(true);
            }}
            className="diary-photo group relative cursor-pointer"
          >
            <img src={photo.url} alt={photo.alt} className="diary-photo-img" />
            {i === visible - 1 && more > 0 ? (
              <>
                <span aria-hidden className="diary-photo-shade" />
                <span className="diary-photo-more">+{more}</span>
              </>
            ) : null}
          </button>
        ))}
      </div>

      <PhotoPreview open={open} photos={photos} index={index} onClose={() => setOpen(false)} onIndexChange={setIndex} />
    </>
  );
}
