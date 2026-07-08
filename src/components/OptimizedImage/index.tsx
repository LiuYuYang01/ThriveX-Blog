import Image, { StaticImageData } from 'next/image';

import { isLocalImage } from '@/utils/image';

type OptimizedImageSrc = string | StaticImageData;

interface OptimizedImageProps {
  src: OptimizedImageSrc;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  fill?: boolean;
  style?: React.CSSProperties;
  onError?: React.ReactEventHandler<HTMLImageElement>;
}

/**
 * 智能图片组件：本地资源使用 next/image，远程 URL 保持原生 img
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  sizes,
  fill = false,
  style,
  onError,
}: OptimizedImageProps) {
  const useNextImage = typeof src !== 'string' || isLocalImage(src);

  if (useNextImage) {
    if (fill) {
      return <Image src={src} alt={alt} fill className={className} priority={priority} sizes={sizes} style={style} />;
    }

    return (
      <Image
        src={src}
        alt={alt}
        width={width ?? 100}
        height={height ?? 100}
        className={className}
        priority={priority}
        sizes={sizes}
        style={style}
      />
    );
  }

  const remoteSrc = src as string;

  if (fill) {
    return (
      <img src={remoteSrc} alt={alt} className={className} style={{ objectFit: 'cover', width: '100%', height: '100%', ...style }} onError={onError} />
    );
  }

  return (
    <img src={remoteSrc} alt={alt} className={className} width={width} height={height} style={style} onError={onError} />
  );
}
