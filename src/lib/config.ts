import { cacheLife, cacheTag } from 'next/cache';

import { getPageConfigDataByNameAPI, getPublicConfigDataAPI, getWebConfigDataAPI } from '@/api/config';
import { getAuthorDataAPI } from '@/api/user';
import { CACHE_TAGS } from '@/lib/cache-tags';
import { Other, PublicConfig, Theme, Web } from '@/types/app/config';
import { User } from '@/types/app/user';

export async function getWebConfigCacheAPI() {
  'use cache';
  cacheLife('config');
  cacheTag(CACHE_TAGS.config);

  const { data } = await getWebConfigDataAPI<{ value: Web }>('web');
  return data?.value as Web;
}

export async function getThemeConfigCacheAPI() {
  'use cache';
  cacheLife('config');
  cacheTag(CACHE_TAGS.config);

  const { data } = await getWebConfigDataAPI<{ value: Theme }>('theme');
  return data?.value as Theme;
}

export async function getOtherConfigCacheAPI() {
  'use cache';
  cacheLife('config');
  cacheTag(CACHE_TAGS.config);

  const { data } = await getWebConfigDataAPI<{ value: Other }>('other');
  return data?.value as Other;
}

export async function getPublicConfigCacheAPI() {
  'use cache';
  cacheLife('config');
  cacheTag(CACHE_TAGS.config);

  const { data } = await getPublicConfigDataAPI();
  return data as PublicConfig;
}

export async function getAuthorDataCacheAPI() {
  'use cache';
  cacheLife('config');
  cacheTag(CACHE_TAGS.config);

  const { data } = await getAuthorDataAPI();
  return data as User;
}

export async function getPageConfigCacheAPI(name: string) {
  'use cache';
  cacheLife('config');
  cacheTag(CACHE_TAGS.config);

  return getPageConfigDataByNameAPI(name);
}

export async function getAppConfigCacheAPI() {
  'use cache';
  cacheLife('config');
  cacheTag(CACHE_TAGS.config);

  const [web, theme, other, publicConfig, author] = await Promise.all([
    getWebConfigCacheAPI(),
    getThemeConfigCacheAPI(),
    getOtherConfigCacheAPI(),
    getPublicConfigCacheAPI(),
    getAuthorDataCacheAPI(),
  ]);
  return { web, theme, other, publicConfig, author };
}
