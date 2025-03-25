import { MusicListItem, MusicLyric } from '@/types/app/music'
import { getLyric } from '@/api/music'
import { useMusicStore } from '../stores'

// 根据id获取歌词
export default async function useChangeLyric(item: MusicListItem) {
  if (item.id) {
    let { lrc } = (await getLyric(item.id)) as MusicLyric
    if (lrc?.lyric === '') {
      lrc.lyric = '[99:00.00]纯音乐，请欣赏\n'
    }
    useMusicStore.setState({
      currentLyric: lrc?.lyric as string
    })
  } else {
    useMusicStore.setState({ currentLyric: '' })
    return ' '
  }
}
