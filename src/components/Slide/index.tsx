'use client';

import { ReactNode, useMemo } from 'react';
import Ripple from '@/components/Ripple';
import { getRandomImage } from '@/utils';

interface Props {
  src?: string;
  covers?: string[];
  isRipple?: boolean;
  fullImage?: boolean;
  children?: ReactNode;
}

export default ({ src, covers = [], isRipple = true, fullImage = false, children }: Props) => {
  const fallbackImage = useMemo(() => getRandomImage(undefined, covers), [covers]);
  const bgImage = src?.trim() || fallbackImage;

  const sty = {
    backgroundImage: bgImage ? `url(${bgImage})` : undefined,
  };

  const containerClass = fullImage
    ? 'overflow-hidden w-full aspect-video relative bg-cover bg-center'
    : 'overflow-hidden h-[300px] sm:h-[500px] md:h-[650px] relative bg-cover bg-center';

  return (
    <>
      <div className={`${containerClass} after:content-[''] after:w-full after:h-[20%] after:absolute after:bottom-0 after:left-0 after:bg-[linear-gradient(to_top,#f9f9f9,transparent)] dark:after:bg-[linear-gradient(to_top,#2c333e,transparent)]`} style={sty}>
        <div className="absolute top-0 left-0 bg-[rgba(0,0,0,0.2)] w-full h-full"></div>
        <div>{children}</div>
      </div>

      {isRipple && <Ripple />}
    </>
  );
};
