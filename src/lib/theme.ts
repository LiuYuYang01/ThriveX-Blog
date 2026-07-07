import { cacheLife, cacheTag } from 'next/cache';

import { getThemeConfigCacheAPI } from '@/lib/config';
import { CACHE_TAGS } from '@/lib/cache-tags';
import { parseThemeCovers } from '@/utils/cover';

export { getThemeConfigCacheAPI } from '@/lib/config';

export async function getThemeCoversCacheAPI() {
  'use cache';
  cacheLife('config');
  cacheTag(CACHE_TAGS.config, CACHE_TAGS.configTheme);

  return parseThemeCovers((await getThemeConfigCacheAPI())?.covers);
}
