import { cacheLife, cacheTag } from 'next/cache';

import { getAlbumListAPI, getAlbumPhotosAPI } from '@/api/album';
import { CACHE_TAGS } from '@/lib/cache-tags';

export async function getAlbumListCacheAPI() {
  'use cache';
  cacheLife('blog');
  cacheTag(CACHE_TAGS.albums);

  return getAlbumListAPI();
}

export async function getAlbumPhotosCacheAPI(albumId: number, page = 1, limit = 40) {
  'use cache';
  cacheLife('blog');
  cacheTag(CACHE_TAGS.albums);

  return getAlbumPhotosAPI(albumId, { page, limit });
}
