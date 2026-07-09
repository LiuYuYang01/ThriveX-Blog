'use client';

import Image from 'next/image';
import { ReactNode } from 'react';
import Ripple from '@/components/Ripple';
import { getStableImage } from '@/utils';

interface Props {
  src?: string;
  covers?: string[];
  isRipple?: boolean;
  fullImage?: boolean;
  priority?: boolean;
  children?: ReactNode;
}

/**
 * 首页 / 文章 Hero 背景幻灯片，本地/远程封面图统一走 next/image fill 优化
 */
export default ({ src, covers = [], isRipple = true, fullImage = false, priority = false, children }: Props) => {
  const fallbackImage = getStableImage(undefined, covers, 'home-hero');
  const bgImage = src?.trim() || fallbackImage;

  const containerClass = fullImage
    ? 'overflow-hidden w-full aspect-video relative isolate'
    : 'overflow-hidden h-[300px] sm:h-[500px] md:h-[650px] relative isolate';

  return (
    <>
      <div className={containerClass}>
        {bgImage && (
          <Image
            src={bgImage}
            alt=""
            fill
            priority={priority}
            sizes="100vw"
            className="object-cover object-center"
            suppressHydrationWarning
          />
        )}

        <div aria-hidden className="pointer-events-none absolute inset-0 z-1 bg-[rgba(0,0,0,0.2)]" />

        <div className="absolute inset-0 z-2">{children}</div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-3 h-[20%] bg-[linear-gradient(to_top,#f9f9f9,transparent)] dark:bg-[linear-gradient(to_top,#2c333e,transparent)]"
        />
      </div>

      {isRipple && <Ripple />}
    </>
  );
};
