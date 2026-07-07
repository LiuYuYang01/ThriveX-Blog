'use client';

import { useEffect, useState } from 'react';
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

export default function PhotoPreview({
  open,
  photos,
  index = 0,
  onClose,
  onIndexChange,
}: PhotoPreviewProps) {
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [switching, setSwitching] = useState(false);

  const activeIndex = Math.min(Math.max(index, 0), Math.max(photos.length - 1, 0));
  const activePhoto = photos[activeIndex];
  const hasMultiple = photos.length > 1;

  const setIndex = (next: number) => {
    onIndexChange?.((next + photos.length) % photos.length);
  };

  const goPrev = () => {
    if (!hasMultiple) return;
    setSwitching(true);
    window.setTimeout(() => {
      setIndex(activeIndex - 1);
      setRotation(0);
      setScale(1);
      setSwitching(false);
    }, 180);
  };

  const goNext = () => {
    if (!hasMultiple) return;
    setSwitching(true);
    window.setTimeout(() => {
      setIndex(activeIndex + 1);
      setRotation(0);
      setScale(1);
      setSwitching(false);
    }, 180);
  };

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
        className="absolute right-5 top-5 z-10 inline-flex size-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/80 transition-colors hover:text-white"
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
        className="relative z-2 flex h-[min(640px,calc(100vh-180px))] w-[min(760px,calc(100vw-130px))] items-center justify-center transition-[opacity,transform] duration-180 ease-out"
        style={{
          opacity: switching ? 0 : 1,
          transform: switching ? 'scale(0.96)' : 'scale(1)',
        }}
      >
        <img
          src={activePhoto.url}
          alt={activePhoto.alt || ''}
          className="h-full w-full select-none object-contain transition-transform duration-200 ease-out"
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
            className="inline-flex size-[34px] items-center justify-center rounded-full text-lg text-neutral-100 transition-colors hover:bg-white/10 cursor-pointer"
            aria-label="上一张"
          >
            <FiChevronLeft />
          </button>
        ) : null}

        <button
          type="button"
          onClick={() => setRotation((prev) => prev - 90)}
          className="inline-flex size-[34px] items-center justify-center rounded-full text-lg text-neutral-100 transition-colors hover:bg-white/10 cursor-pointer"
          aria-label="向左旋转"
        >
          <FiRotateCcw />
        </button>

        <button
          type="button"
          onClick={() => setRotation((prev) => prev + 90)}
          className="inline-flex size-[34px] items-center justify-center rounded-full text-lg text-neutral-100 transition-colors hover:bg-white/10 cursor-pointer"
          aria-label="向右旋转"
        >
          <FiRotateCw />
        </button>

        <button
          type="button"
          onClick={() => setScale((prev) => Math.max(prev - 0.2, 0.4))}
          className="inline-flex size-[34px] items-center justify-center rounded-full text-lg text-neutral-100 transition-colors hover:bg-white/10 cursor-pointer"
          aria-label="缩小"
        >
          <FiZoomOut />
        </button>

        <button
          type="button"
          onClick={() => setScale((prev) => Math.min(prev + 0.2, 3))}
          className="inline-flex size-[34px] items-center justify-center rounded-full text-lg text-neutral-100 transition-colors hover:bg-white/10 cursor-pointer"
          aria-label="放大"
        >
          <FiZoomIn />
        </button>

        {hasMultiple ? (
          <button
            type="button"
            onClick={goNext}
            className="inline-flex size-[34px] items-center justify-center rounded-full text-lg text-neutral-100 transition-colors hover:bg-white/10 cursor-pointer"
            aria-label="下一张"
          >
            <FiChevronRight />
          </button>
        ) : null}
      </div>
    </div>
  );
}
