import Image, { StaticImageData } from 'next/image';

import { isLocalImage } from '@/utils/image';

type CoverImageSrc = string | StaticImageData;

interface CoverImageProps {
  src: CoverImageSrc;
  alt?: string;
  className?: string;
  containerClassName?: string;
  containerStyle?: React.CSSProperties;
  priority?: boolean;
  sizes?: string;
}

/**
 * 封面图组件：本地图片走 next/image fill 优化，远程图片保持 background-image
 */
export default function CoverImage({
  src,
  alt = '',
  className = 'object-cover',
  containerClassName = 'absolute inset-0',
  containerStyle,
  priority = false,
  sizes = '100vw',
}: CoverImageProps) {
  if (!src || (typeof src === 'string' && !src.trim())) return null;

  if (typeof src !== 'string' || isLocalImage(src)) {
    return (
      <div className={`${containerClassName} overflow-hidden`} style={containerStyle}>
        <Image src={src} alt={alt} fill className={className} priority={priority} sizes={sizes} />
      </div>
    );
  }

  return (
    <div
      aria-hidden={!alt}
      className={`${containerClassName} bg-cover bg-center bg-no-repeat`}
      style={{ ...containerStyle, backgroundImage: `url(${src})` }}
    />
  );
}
