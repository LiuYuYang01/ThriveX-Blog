'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  FiChevronLeft,
  FiChevronRight,
  FiRotateCcw,
  FiRotateCw,
  FiX,
  FiZoomIn,
  FiZoomOut,
} from 'react-icons/fi';

export type PhotoItem = {
  id: string;
  url: string;
  thumb?: string;
  alt?: string;
};

type PhotoPreviewProps = {
  open: boolean;
  photos: PhotoItem[];
  index?: number;
  onClose: () => void;
  onIndexChange?: (index: number) => void;
};

const preloadedUrls = new Set<string>();

function preloadImage(url: string) {
  if (!url || preloadedUrls.has(url)) return;
  preloadedUrls.add(url);
  const img = new Image();
  img.src = url;
}

export default function PhotoPreview({
  open,
  photos,
  index = 0,
  onClose,
  onIndexChange,
}: PhotoPreviewProps) {
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(index);

  const boundedIndex = Math.min(Math.max(index, 0), Math.max(photos.length - 1, 0));

  useEffect(() => {
    if (!open) return;
    setCurrentIndex(boundedIndex);
    setRotation(0);
    setScale(1);
  }, [open, boundedIndex]);

  const activeIndex = Math.min(Math.max(currentIndex, 0), Math.max(photos.length - 1, 0));
  const activePhoto = photos[activeIndex];
  const hasMultiple = photos.length > 1;

  const setIndex = useCallback(
    (next: number) => {
      const normalized = (next + photos.length) % photos.length;
      setCurrentIndex(normalized);
      onIndexChange?.(normalized);
    },
    [onIndexChange, photos.length],
  );

  const goPrev = useCallback(() => {
    if (!hasMultiple) return;
    setRotation(0);
    setScale(1);
    setIndex(activeIndex - 1);
  }, [activeIndex, hasMultiple, setIndex]);

  const goNext = useCallback(() => {
    if (!hasMultiple) return;
    setRotation(0);
    setScale(1);
    setIndex(activeIndex + 1);
  }, [activeIndex, hasMultiple, setIndex]);

  useEffect(() => {
    if (!open) return;
    const nearbyIndexes = hasMultiple
      ? [activeIndex, (activeIndex - 1 + photos.length) % photos.length, (activeIndex + 1) % photos.length]
      : [activeIndex];
    nearbyIndexes.forEach((photoIndex) => preloadImage(photos[photoIndex]?.url));
  }, [activeIndex, hasMultiple, open, photos]);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose, goPrev, goNext]);

  const onImageWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setScale((prev) => Math.min(prev + 0.1, 3));
      return;
    }
    setScale((prev) => Math.max(prev - 0.1, 0.4));
  };

  if (!open || !photos.length || !activePhoto) return null;

  return (
    <div
      className="fixed inset-0 z-200 flex items-center justify-center bg-black/92"
      onClick={onClose}
      role="dialog"
      aria-modal
      aria-label="图片预览"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-5 top-5 z-10 inline-flex size-11 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/80 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        aria-label="关闭预览"
      >
        <FiX className="size-5" />
      </button>

      {hasMultiple ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
          className="absolute left-5 top-1/2 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-neutral-800/45 text-2xl text-white transition-colors hover:bg-neutral-800/60 cursor-pointer"
          aria-label="上一张"
        >
          <FiChevronLeft />
        </button>
      ) : null}

      {hasMultiple ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
          className="absolute right-5 top-1/2 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-neutral-800/45 text-2xl text-white transition-colors hover:bg-neutral-800/60 cursor-pointer"
          aria-label="下一张"
        >
          <FiChevronRight />
        </button>
      ) : null}

      <div
        onWheel={onImageWheel}
        onClick={(e) => e.stopPropagation()}
        className="relative z-2 flex h-[min(760px,calc(100vh-130px))] w-[min(1040px,calc(100vw-96px))] items-center justify-center"
      >
        <img
          src={activePhoto.url}
          alt={activePhoto.alt || ''}
          className="h-full w-full select-none object-contain"
          style={{ transform: `rotate(${rotation}deg) scale(${scale})` }}
          draggable={false}
        />
      </div>

      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/20 bg-neutral-500/30 px-4 py-2.5 backdrop-blur-2xl"
      >
        {hasMultiple ? (
          <button
            type="button"
            onClick={goPrev}
            className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full text-lg text-neutral-100 transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            aria-label="上一张"
          >
            <FiChevronLeft />
          </button>
        ) : null}

        <button
          type="button"
          onClick={() => setRotation((prev) => prev - 90)}
          className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full text-lg text-neutral-100 transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          aria-label="向左旋转"
        >
          <FiRotateCcw />
        </button>

        <button
          type="button"
          onClick={() => setRotation((prev) => prev + 90)}
          className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full text-lg text-neutral-100 transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          aria-label="向右旋转"
        >
          <FiRotateCw />
        </button>

        <button
          type="button"
          onClick={() => setScale((prev) => Math.max(prev - 0.2, 0.4))}
          className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full text-lg text-neutral-100 transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          aria-label="缩小"
        >
          <FiZoomOut />
        </button>

        <button
          type="button"
          onClick={() => setScale((prev) => Math.min(prev + 0.2, 3))}
          className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full text-lg text-neutral-100 transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          aria-label="放大"
        >
          <FiZoomIn />
        </button>

        {hasMultiple ? (
          <button
            type="button"
            onClick={goNext}
            className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full text-lg text-neutral-100 transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            aria-label="下一张"
          >
            <FiChevronRight />
          </button>
        ) : null}
      </div>
    </div>
  );
}
