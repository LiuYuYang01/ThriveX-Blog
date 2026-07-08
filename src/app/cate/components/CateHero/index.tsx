'use client';

import { useEffect, useState } from 'react';
import { LuChevronDown } from 'react-icons/lu';
import CoverImage from '@/components/CoverImage';

interface Props {
  children: React.ReactNode;
  image: string;
}

/**
 * 分类页 Hero，背景图统一使用 next/image fill 并开启 priority
 */
export default function CateHero({ children, image }: Props) {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const onScroll = () => {
      const progress = Math.min(window.scrollY / 360, 1);
      setOpacity(1 - progress * 0.85);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      id="cate-hero"
      className="relative flex flex-col items-center justify-center overflow-hidden px-4 pt-16 pb-10 text-center transition-opacity duration-500 ease-out max-md:h-[min(48vh,20rem)] max-md:min-h-70 md:min-h-dvh md:px-6 md:pb-24 md:pt-28"
      style={{ opacity }}
    >
      <CoverImage
        src={image}
        alt=""
        priority
        sizes="100vw"
        className="object-cover object-[center_45%] max-md:object-[center_32%] sm:object-center"
      />
      <div aria-hidden className="absolute inset-0 bg-linear-to-r from-black/45 via-black/25 to-black/10 z-[1]" />
      <div aria-hidden className="absolute inset-0 bg-linear-to-b from-black/35 via-black/10 via-45% to-transparent md:via-55% z-[1]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] bg-linear-to-t from-background from-5% via-background/75 to-transparent dark:from-black-a dark:via-black-a/75 max-md:h-[68%] md:h-[42%] z-[1]" />

      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center justify-center px-2 sm:px-6">
        {children}
      </div>

      <div className="absolute inset-x-0 bottom-3 z-10 flex flex-col items-center gap-1 text-white/45 md:bottom-10 md:gap-2">
        <span className="text-[9px] tracking-[0.18em] uppercase md:text-[10px]">向下滑动</span>
        <LuChevronDown className="h-3.5 w-3.5 animate-bounce md:h-4 md:w-4" strokeWidth={1.5} />
      </div>
    </header>
  );
}
