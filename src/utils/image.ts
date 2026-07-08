/**
 * 判断图片是否为本地资源（public 目录或相对路径），远程 URL 返回 false
 */
export const isLocalImage = (src: string | null | undefined): boolean => {
  if (!src?.trim()) return false;
  const value = src.trim();
  if (value.startsWith('//') || /^https?:\/\//i.test(value)) return false;
  if (value.startsWith('data:') || value.startsWith('blob:')) return false;
  return value.startsWith('/') || value.startsWith('./') || value.startsWith('../');
};
