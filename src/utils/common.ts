// 获取随机数
export const getRandom = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 抖音视频的站内播放地址，非抖音链接返回 null
export const getDouyinEmbedUrl = (url?: string | null): string | null => {
  const match = url?.match(/douyin\.com\/(?:share\/)?video\/(\d+)/);
  return match ? `https://www.douyin.com/player/${match[1]}?autoplay=0` : null;
}