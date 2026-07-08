import Image, { StaticImageData } from 'next/image';

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
 * 判断是否为 next/image 无法处理的特殊协议地址
 */
const isNativeOnlySrc = (src: string) => src.startsWith('data:') || src.startsWith('blob:');

/**
 * 智能图片组件：本地/远程统一走 next/image，data/blob 协议回退原生 img
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
  if (!src || (typeof src === 'string' && !src.trim())) return null;

  if (typeof src === 'string' && isNativeOnlySrc(src)) {
    if (fill) {
      return (
        <img src={src} alt={alt} className={className} style={{ objectFit: 'cover', width: '100%', height: '100%', ...style }} onError={onError} />
      );
    }

    return (
      <img src={src} alt={alt} className={className} width={width} height={height} style={style} onError={onError} />
    );
  }

  if (fill) {
    return <Image src={src} alt={alt} fill className={className} priority={priority} sizes={sizes} style={style} onError={onError} />;
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
      onError={onError}
    />
  );
}
