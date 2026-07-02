import { getRandom } from './common';

// 解析主题随机照片列表
export const parseThemeCovers = (covers: unknown): string[] => {
  if (Array.isArray(covers)) return covers.filter(Boolean);
  if (typeof covers !== 'string' || !covers.trim()) return [];
  try {
    const parsed = JSON.parse(covers);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [covers];
  } catch {
    return [covers];
  }
};

// 图片为空时从随机列表随机取图
export const getRandomImage = (src: string | null | undefined, defaults: unknown): string => {
  if (src?.trim()) return src;
  // 从随机列表中选取
  const list = parseThemeCovers(defaults);
   // 随机列表为空，则返回空字符串
  if (!list.length) return '';
  return list[getRandom(0, list.length - 1)];
};

// 根据 seed 稳定选取，避免 SSR / 客户端 hydration 结果不一致
export const getStableImage = (src: string | null | undefined, defaults: unknown, seed: string): string => {
  if (src?.trim()) return src;
  const list = parseThemeCovers(defaults);
  if (!list.length) return '';
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return list[hash % list.length];
};
