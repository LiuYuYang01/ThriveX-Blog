'use client';

import { ReactNode, useMemo } from 'react';
import Ripple from '@/components/Ripple';
import { getRandomImage } from '@/utils';
import { useConfigStore } from '@/stores';

interface Props {
  src?: string; // 图片列表
  isRipple?: boolean; // 是否显示波浪
  /** 按 16:9 比例完整展示背景图，避免固定高度裁切 */
  fullImage?: boolean;
  children?: ReactNode;
}

export default ({ src, isRipple = true, fullImage = false, children }: Props) => {
  const theme = useConfigStore((state) => state.theme);

  const fallbackImage = useMemo(() => getRandomImage(undefined, theme.covers), [theme.covers]);
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
