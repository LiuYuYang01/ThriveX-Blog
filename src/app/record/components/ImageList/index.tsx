'use client';

import { useEffect, useMemo, useState } from 'react';
import PhotoPreview, { type PhotoItem } from '@/ThriveUI/PhotoPreview';

interface Props {
  list: string[];
}

const MAX_SHOW = 9;

type GridLayout = {
  gridClass: string;
  gapClass: string;
};

type ImageSize = { width: number; height: number };

/** 双图 / 三图 / 四图 / 多图 各自独立尺寸 */
function getGridLayout(count: number): GridLayout {
  if (count === 2) {
    return { gridClass: 'grid-cols-2 w-[272px]', gapClass: 'gap-1.5' };
  }
  if (count === 3) {
    return { gridClass: 'grid-cols-3 w-full max-w-[390px]', gapClass: 'gap-1.5' };
  }
  if (count === 4) {
    return { gridClass: 'grid-cols-2 w-[272px]', gapClass: 'gap-1.5' };
  }
  return { gridClass: 'grid-cols-3 w-full max-w-[390px]', gapClass: 'gap-1.5' };
}

/** 单图展示尺寸：按原图比例缩放，容器与图片完全一致 */
function calcSingleDisplaySize(naturalW: number, naturalH: number): ImageSize {
  const ratio = naturalW / naturalH;

  let maxW: number;
  let maxH: number;

  if (ratio > 1.25) {
    maxW = 320;
    maxH = 220;
  } else if (ratio < 0.8) {
    maxW = 220;
    maxH = 380;
  } else {
    maxW = 260;
    maxH = 260;
  }

  let width = naturalW;
  let height = naturalH;

  if (width > maxW) {
    width = maxW;
    height = width / ratio;
  }
  if (height > maxH) {
    height = maxH;
    width = height * ratio;
  }

  return { width: Math.round(width), height: Math.round(height) };
}

function useImageSize(src: string) {
  const [size, setSize] = useState<ImageSize | null>(null);

  useEffect(() => {
    setSize(null);
    const img = new Image();
    img.onload = () => {
      if (img.naturalWidth && img.naturalHeight) {
        setSize(calcSingleDisplaySize(img.naturalWidth, img.naturalHeight));
      }
    };
    img.src = src;
  }, [src]);

  return size;
}

function SingleImage({ src, onClick }: { src: string; onClick: () => void }) {
  const size = useImageSize(src);

  return (
    <button
      type="button"
      onClick={onClick}
      style={size ? { width: size.width, height: size.height } : undefined}
      className="group relative block shrink-0 cursor-pointer overflow-hidden rounded"
    >
      <img
        src={src}
        alt="闪念图片"
        className="block h-full w-full object-cover transition-[scale] duration-500 ease-out group-hover:scale-105"
      />
    </button>
  );
}

function GridImage({
  src,
  index,
  showMore,
  moreCount,
  onClick,
}: {
  src: string;
  index: number;
  showMore: boolean;
  moreCount: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative aspect-square w-full cursor-pointer overflow-hidden rounded"
    >
      <img
        src={src}
        alt={`闪念图片-${index}`}
        className="block h-full w-full object-cover transition-[scale] duration-500 ease-out group-hover:scale-105"
      />
      {showMore && (
        <>
          <span className="absolute inset-0 bg-[rgba(17,22,25,0.35)]" />
          <span className="absolute inset-0 z-2 grid place-items-center text-lg font-bold text-white">
            +{moreCount}
          </span>
        </>
      )}
    </button>
  );
}

export default function ImageList({ list }: Props) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const photos = useMemo<PhotoItem[]>(
    () => list.map((url, i) => ({ id: `${i}`, url, alt: `闪念图片-${i}` })),
    [list],
  );

  if (!list?.length) return null;

  const count = list.length;
  const displayList = list.slice(0, MAX_SHOW);
  const hasMore = count > MAX_SHOW;

  const openPreview = (i: number) => {
    setIndex(i);
    setOpen(true);
  };

  const preview = (
    <PhotoPreview
      open={open}
      photos={photos}
      index={index}
      onClose={() => setOpen(false)}
      onIndexChange={setIndex}
    />
  );

  if (count === 1) {
    return (
      <>
        <SingleImage src={list[0]} onClick={() => openPreview(0)} />
        {preview}
      </>
    );
  }

  const { gridClass, gapClass } = getGridLayout(count);

  return (
    <>
      <div className={`inline-grid ${gapClass} ${gridClass}`}>
        {displayList.map((src, i) => (
          <GridImage
            key={i}
            src={src}
            index={i}
            showMore={hasMore && i === MAX_SHOW - 1}
            moreCount={count - MAX_SHOW}
            onClick={() => openPreview(i)}
          />
        ))}
      </div>
      {preview}
    </>
  );
}
