export interface MusicListItem {
  name?: string
  id?: number
  ar?: {
    id?: number
    name?: string
  }[]
  al?: {
    id: number
    name: string
    picUrl: string
  }
  dt?: number
  lyric?: string
  initFlag?: boolean
}

export interface MusicDetail {
  reason?: string
  reasonId?: string
  songId?: number
}

export interface MusicList {
  dailySongs?: MusicListItem[]
  demote?: boolean
  fromCache?: boolean
  recommend?: MusicDetail[]
  orderSongs?: number
}

export interface MusicLyric {
  code?: number
  lrc?: {
    lyric?: string
    version?: number
  }
  needDesc?: boolean
  pureMusic?: boolean
  qfy?: boolean
  sfy?: boolean
  sgc?: boolean
}
