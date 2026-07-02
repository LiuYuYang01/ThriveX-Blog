'use client';

import { ReactNode } from 'react';
import Ripple from '@/components/Ripple';
import { getRandomImage } from '@/utils';
import { useConfigStore } from '@/stores';

interface Props {
  src?: string; // 图片列表
  isRipple?: boolean; // 是否显示波浪
  children?: ReactNode;
}

export default ({ src, isRipple = true, children }: Props) => {
  const theme = useConfigStore((state) => state.theme);

  const sty = {
    backgroundImage: `url(${getRandomImage(src, theme.covers)})`,
  };

  return (
    <>
      <div className="overflow-hidden h-[300px] sm:h-[400px] md:h-[500px] relative bg-cover bg-center after:content-[''] after:w-full after:h-[20%] after:absolute after:bottom-0 after:left-0 after:bg-[linear-gradient(to_top,#fff,transparent)] dark:after:bg-[linear-gradient(to_top,#2c333e,transparent)]" style={sty}>
        <div className="absolute top-0 left-0 bg-[rgba(0,0,0,0.2)] w-full h-full"></div>
        <div>{children}</div>
      </div>

      {isRipple && <Ripple />}
    </>
  );
};
