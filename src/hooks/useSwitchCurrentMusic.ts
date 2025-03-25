import { MusicListItem } from '@/types/app/music'
import { useMusicStore } from '../stores'
import useChangeLyric from './useChangeLyric'

//切换歌曲
export default function useSwitchCurrentMusic(item: MusicListItem) {
  useMusicStore.setState({
    currentMusic: item,
    currentLyricIndex: 0,
    currentTime: 0,
    duration: item.dt ?? 0
  })
  useChangeLyric(item)
}
