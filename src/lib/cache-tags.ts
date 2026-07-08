export const CACHE_TAGS = {
  config: 'config',
  configWeb: 'config-web',
  configTheme: 'config-theme',
  configOther: 'config-other',
  configAuthor: 'config-author',
  articles: 'articles',
  article: 'article',
  articlesList: 'articles-list',
  records: 'records',
  record: 'record',
  walls: 'walls',
  wall: 'wall',
  webs: 'webs',
  comments: 'comments',
} as const;

// 动态缓存标签前缀
const DYNAMIC_PREFIXES = [
  `${CACHE_TAGS.article}-`,
  `${CACHE_TAGS.articlesList}-`,
  `${CACHE_TAGS.record}-`,
  `${CACHE_TAGS.wall}-`,
  `${CACHE_TAGS.comments}-`,
] as const;

// 判断是否是允许的缓存标签
export function isAllowedCacheTag(tag: string) {
  // 如果标签是 CACHE_TAGS 中的值，则返回 true
  return (
    (Object.values(CACHE_TAGS) as string[]).includes(tag) ||
    // 如果标签是 DYNAMIC_PREFIXES 中的值，则返回 true
    DYNAMIC_PREFIXES.some((prefix) => tag.startsWith(prefix))
    // 如果标签是 CACHE_TAGS 中的值，或者 DYNAMIC_PREFIXES 中的值，则返回 true
  );
}
