import { cache } from 'react';

import { getThemeConfigCacheAPI } from '@/lib/config';
import { parseThemeCovers } from '@/utils/cover';

export { getThemeConfigCacheAPI } from '@/lib/config';

export const getThemeCoversCacheAPI = cache(async () => parseThemeCovers((await getThemeConfigCacheAPI())?.covers));
