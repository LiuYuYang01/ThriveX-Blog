'use client'

import CardList from '../cardList'
import { useEffect } from 'react'
import { MusicListItem, MusicList } from '@/types/app/music'
import { useMusicStore } from '@/stores'
import { getLike } from '@/api/music'
import useSwitchCurrentMusic from '@/hooks/useSwitchCurrentMusic'
import { IAudio } from '@/hooks/useAudio'

export default function cardRecommend(props: { audioInfo: IAudio }) {
  const { changeDailyMusicList, pushPlayingMusicList } = useMusicStore()
  const { audioInfo } = props
  const { setIsMusic } = audioInfo

  // 获取每日推荐歌曲
  useEffect(() => {
    const fetchHotRecommend = async () => {
      const { data } = (await getLike()) || { data: [] as MusicList }
      const dailySongs = data.dailySongs || []
      // 保存
      changeDailyMusicList(dailySongs)
    }
    fetchHotRecommend()
  }, [])

  const pushIntoPlayingMusicList = async (item: MusicListItem) => {
    setIsMusic(false)
    useSwitchCurrentMusic(item)
    pushPlayingMusicList(item)
    setIsMusic(true)
    //TODO:push成功的dialog
    // alert('push成功')
  }
  return <CardList rowClick={pushIntoPlayingMusicList} rowDoubleClick={pushIntoPlayingMusicList} />
}
