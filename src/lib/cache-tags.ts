export const CACHE_TAGS = {
  config: 'config',
  articles: 'articles',
  article: 'article',
  articlesList: 'articles-list',
  records: 'records',
  cates: 'cates',
  tags: 'tags',
  swipers: 'swipers',
  walls: 'walls',
  webs: 'webs',
  comments: 'comments',
  footprints: 'footprints',
  milestones: 'milestones',
  rss: 'rss',
  albums: 'albums',
} as const;

const DYNAMIC_PREFIXES = [
  `${CACHE_TAGS.article}-`,
  `${CACHE_TAGS.articlesList}-`,
  `${CACHE_TAGS.comments}-`,
] as const;

export function isAllowedCacheTag(tag: string) {
  return (
    (Object.values(CACHE_TAGS) as string[]).includes(tag) ||
    DYNAMIC_PREFIXES.some((prefix) => tag.startsWith(prefix))
  );
}
