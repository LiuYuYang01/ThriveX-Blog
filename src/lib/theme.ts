import { cache } from 'react';

import { getWebConfigDataAPI } from '@/api/config';
import { Theme } from '@/types/app/config';
import { parseThemeCovers } from '@/utils/cover';

export const getThemeConfig = cache(async () => {
  const { data } = await getWebConfigDataAPI<{ value: Theme }>('theme');
  return data?.value as Theme;
});

export const getThemeCovers = cache(async () => parseThemeCovers((await getThemeConfig())?.covers));
