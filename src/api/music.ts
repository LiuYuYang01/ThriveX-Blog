import musicRequest from '@/utils/requestMusic'
import { MusicList, MusicLyric } from '@/types/app/music'

// 获取我的喜欢音乐的所有id
export const getLike = async () => {
  return await musicRequest<MusicList>('GET', '/recommend/songs')
}

// 根据id获取歌词
export const getLyric = async (id: number) => {
  return await musicRequest<MusicLyric>('GET', `/lyric?id=${id}`)
}

// 根据id获取音乐信息
export const getMusic = async (ids: number) => {
  return await musicRequest<MusicList>('GET', `/song/url/id=${ids}`)
}

// 搜索音乐
export const search = async (keywords: string, offset = 0, limit = 30) => {
  return await musicRequest<MusicList>('GET', '/search', {
    params: {
      keywords,
      limit,
      offset
    }
  })
}

//根据歌单id获取歌单详情
export const getPlayListDetail = async (id: number) => {
  return await musicRequest<MusicList>('GET', '/playlist/detail', {
    params: {
      id
    }
  })
}

//根据trackIds获取所有的音乐信息
export const getAllMusic = async (trackIds: any[]) => {
  if (trackIds.length === 0) return []
  const ids = trackIds.map((item) => item.id).join(',')
  return await musicRequest<MusicList>('GET', '/song/detail', {
    params: {
      ids
    }
  })
}

// 根据id获取音乐url
export const getMusicUrl = (id: number) => {
  return `https://music.163.com/song/media/outer/url?id=${id}.mp3`
}
