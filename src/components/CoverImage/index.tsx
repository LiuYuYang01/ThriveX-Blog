import Image, { StaticImageData } from 'next/image';

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
 * 封面图组件：本地/远程统一使用 next/image fill，依赖外层固定尺寸容器
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

  return (
    <div className={`${containerClassName} overflow-hidden`} style={containerStyle}>
      <Image src={src} alt={alt} fill className={className} priority={priority} sizes={sizes} />
    </div>
  );
}
