export interface Album {
  id: number;
  name: string;
  description: string;
  cover: string;
  originalCover: string;
  createTime: string;
  photoCount: number;
}

export interface AlbumPayload {
  id: number;
  name: string;
  description: string | null;
  cover: string;
  original_cover: string;
  create_time: string;
  photo_count: number;
}

export interface AlbumPhoto {
  id: number;
  name: string;
  description: string;
  url: string;
  originalUrl: string;
  size: number;
  width: number;
  height: number;
  type: string;
  hash: string;
  isFeatured: boolean;
  createTime: string;
}

export interface AlbumPhotoPayload {
  id: number;
  name: string;
  description: string | null;
  url: string;
  original_url: string;
  size: number;
  width: number;
  height: number;
  type: string;
  hash: string;
  is_featured: boolean;
  create_time: string;
}

export interface AlbumPhotosPage {
  next: boolean;
  prev: boolean;
  page: number;
  size: number;
  pages: number;
  total: number;
  result: AlbumPhoto[];
}
