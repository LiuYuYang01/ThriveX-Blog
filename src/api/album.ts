import { Album, AlbumPayload, AlbumPhoto, AlbumPhotoPayload, AlbumPhotosPage } from '@/types/app/album';
import { Request } from '@/utils';

const ALBUM_API = 'https://frame-api.liuyuyang.net/api/album/public';
const DEFAULT_PHOTO_LIMIT = 40;

interface AlbumPhotoParams {
  page?: number;
  limit?: number;
}

export const getAlbumListAPI = async () => {
  const response = await Request<Paginate<AlbumPayload[]>>('GET', `${ALBUM_API}/list`);

  return {
    ...response,
    data: {
      ...response.data,
      result: (response.data?.result ?? []).map<Album>((album) => ({
        id: album.id,
        name: album.name,
        description: album.description?.trim() || '一组被时间温柔收藏的画面',
        cover: album.cover.replace(/\?+$/, ''),
        originalCover: album.original_cover.replace(/\?+$/, ''),
        createTime: album.create_time,
        photoCount: album.photo_count,
      })),
    },
  };
};

export const getAlbumPhotosAPI = async (
  albumId: number,
  { page = 1, limit = DEFAULT_PHOTO_LIMIT }: AlbumPhotoParams = {},
) => {
  const response = await Request<Paginate<AlbumPhotoPayload[]>>(
    'GET',
    `${ALBUM_API}/${albumId}/photos`,
    { params: { page, limit } },
  );

  return {
    ...response,
    data: {
      ...response.data,
      result: (response.data?.result ?? []).map<AlbumPhoto>((photo) => ({
        id: photo.id,
        name: photo.name,
        description: photo.description?.trim() || '',
        url: photo.url.replace(/\?+$/, ''),
        originalUrl: photo.original_url.replace(/\?+$/, ''),
        size: photo.size,
        width: photo.width,
        height: photo.height,
        type: photo.type,
        hash: photo.hash,
        isFeatured: photo.is_featured,
        createTime: photo.create_time,
      })),
    } satisfies AlbumPhotosPage,
  };
};
