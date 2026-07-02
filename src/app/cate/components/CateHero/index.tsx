'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { LuChevronDown } from 'react-icons/lu';

interface Props {
  children: React.ReactNode;
  image: string;
}

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
      className="relative flex flex-col items-center justify-center overflow-hidden px-4 pt-16 pb-10 text-center transition-opacity duration-500 ease-out max-md:h-[min(48vh,20rem)] max-md:min-h-[17.5rem] md:min-h-[100dvh] md:px-6 md:pb-24 md:pt-28"
      style={{ opacity }}
    >
      <div aria-hidden className="absolute inset-0">
        <Image
          src={image}
          alt=""
          fill
          priority
          className="object-cover object-[center_45%] max-md:object-[center_32%] sm:object-center"
          sizes="100vw"
          quality={80}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/25 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 via-45% to-transparent md:via-55%" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-[#f9f9f9] from-5% via-[#f9f9f9]/75 to-transparent dark:from-black-a dark:via-black-a/75 max-md:h-[68%] md:h-[42%]" />
      </div>

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
