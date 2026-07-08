'use client';

import { ReactNode } from 'react';
import Ripple from '@/components/Ripple';
import CoverImage from '@/components/CoverImage';
import { getRandomImage } from '@/utils';

interface Props {
  src?: string;
  covers?: string[];
  isRipple?: boolean;
  fullImage?: boolean;
  priority?: boolean;
  children?: ReactNode;
}

/**
 * 首页 / 文章 Hero 背景幻灯片，本地封面图启用 next/image 优化
 */
export default ({ src, covers = [], isRipple = true, fullImage = false, priority = false, children }: Props) => {
  const fallbackImage = getRandomImage(undefined, covers);
  const bgImage = src?.trim() || fallbackImage;

  const containerClass = fullImage
    ? 'overflow-hidden w-full aspect-video relative'
    : 'overflow-hidden h-[300px] sm:h-[500px] md:h-[650px] relative';

  return (
    <>
      <div
        className={`${containerClass} after:content-[''] after:w-full after:h-[20%] after:absolute after:bottom-0 after:left-0 after:bg-[linear-gradient(to_top,#f9f9f9,transparent)] dark:after:bg-[linear-gradient(to_top,#2c333e,transparent)] after:z-[3]`}
      >
        {bgImage && <CoverImage src={bgImage} priority={priority} sizes="100vw" />}
        <div className="absolute top-0 left-0 bg-[rgba(0,0,0,0.2)] w-full h-full z-[1]" />
        <div className="relative z-[2]">{children}</div>
      </div>

      {isRipple && <Ripple />}
    </>
  );
};
