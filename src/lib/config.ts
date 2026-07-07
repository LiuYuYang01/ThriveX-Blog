import { cacheLife, cacheTag } from 'next/cache';

import { getWebConfigDataAPI } from '@/api/config';
import { getAuthorDataAPI } from '@/api/user';
import { CACHE_TAGS } from '@/lib/cache-tags';
import { Other, Theme, Web } from '@/types/app/config';
import { User } from '@/types/app/user';

export async function getWebConfigCacheAPI() {
  'use cache';
  cacheLife('config');
  cacheTag(CACHE_TAGS.config, CACHE_TAGS.configWeb);

  const { data } = await getWebConfigDataAPI<{ value: Web }>('web');
  return data?.value as Web;
}

export async function getThemeConfigCacheAPI() {
  'use cache';
  cacheLife('config');
  cacheTag(CACHE_TAGS.config, CACHE_TAGS.configTheme);

  const { data } = await getWebConfigDataAPI<{ value: Theme }>('theme');
  return data?.value as Theme;
}

export async function getOtherConfigCacheAPI() {
  'use cache';
  cacheLife('config');
  cacheTag(CACHE_TAGS.config, CACHE_TAGS.configOther);

  const { data } = await getWebConfigDataAPI<{ value: Other }>('other');
  return data?.value as Other;
}

export async function getAuthorDataCacheAPI() {
  'use cache';
  cacheLife('config');
  cacheTag(CACHE_TAGS.config, CACHE_TAGS.configAuthor);

  const { data } = await getAuthorDataAPI();
  return data as User;
}

export async function getAppConfigCacheAPI() {
  'use cache';
  cacheLife('config');
  cacheTag(CACHE_TAGS.config);

  const [web, theme, other, author] = await Promise.all([
    getWebConfigCacheAPI(),
    getThemeConfigCacheAPI(),
    getOtherConfigCacheAPI(),
    getAuthorDataCacheAPI(),
  ]);
  return { web, theme, other, author };
}
