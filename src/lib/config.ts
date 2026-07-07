import { cache } from 'react';

import { getWebConfigDataAPI } from '@/api/config';
import { getAuthorDataAPI } from '@/api/user';
import { Other, Theme, Web } from '@/types/app/config';
import { User } from '@/types/app/user';

export const getWebConfigCacheAPI = cache(async () => {
  const { data } = await getWebConfigDataAPI<{ value: Web }>('web');
  return data?.value as Web;
});

export const getThemeConfigCacheAPI = cache(async () => {
  const { data } = await getWebConfigDataAPI<{ value: Theme }>('theme');
  return data?.value as Theme;
});

export const getOtherConfigCacheAPI = cache(async () => {
  const { data } = await getWebConfigDataAPI<{ value: Other }>('other');
  return data?.value as Other;
});

export const getAuthorDataCacheAPI = cache(async () => {
  const { data } = await getAuthorDataAPI();
  return data as User;
});

export const getAppConfigCacheAPI = cache(async () => {
  const [web, theme, other, author] = await Promise.all([
    getWebConfigCacheAPI(),
    getThemeConfigCacheAPI(),
    getOtherConfigCacheAPI(),
    getAuthorDataCacheAPI(),
  ]);
  return { web, theme, other, author };
});
