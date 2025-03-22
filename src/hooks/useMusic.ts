import { MusicListItem } from '@/types/app/music'
import { getMusicUrl } from '@/api/music'
import { useMusicStore } from '@/stores'
interface Singers {
  id?: number
  name?: string
  tns?: []
  alias?: []
}
export interface IMusicInfo {
  al: any
  singers: string
  name: any
  url: any
  currentMusic: MusicListItem
  dailyMusicList: MusicListItem[]
}
export default function useMusicInfo() {
  // 获取当前歌曲和歌曲列表
  const { currentMusic, dailyMusicList } = useMusicStore()
  // 分别是id，歌曲信息，作者，歌曲名
  const { id, al, ar, name } = currentMusic
  // 根据id获取url
  let url = undefined
  if (id) url = getMusicUrl(id)

  // 拼接作者姓名
  let singers = ''
  ar &&
    ar.map((item: Singers, index: number) => {
      singers += item.name
      singers += ar.length === index + 1 ? '' : ' / '
    })

  return { al, singers, name, url, currentMusic, dailyMusicList }
}
