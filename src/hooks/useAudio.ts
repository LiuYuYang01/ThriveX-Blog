import { ORDER } from '@/constant'
import { MusicListItem } from '@/types/app/music'
import { useMusicStore } from '@/stores'
import { useState, useRef, SyntheticEvent, useEffect } from 'react'
import { Dispatch, SetStateAction, RefObject } from 'react'
import useSwitchCurrentMusic from './useSwitchCurrentMusic'
export const INITIAL_VOLUME = 0.66

type Order = 'cycle' | 'single' | 'random'

export interface IAudio {
  canplay: (e: SyntheticEvent<HTMLAudioElement, Event>) => void
  audioTimeUpdate: (e: any, fn?: (e: any) => void) => void
  switchMusic: (type: 'pre' | 'next', order?: Order) => void
  setVolume: Dispatch<SetStateAction<number>>
  switchMusicStaus: () => void
  changeJingyin: () => void
  onError: () => void
  onEnd: () => void
  switchOrder: () => void
  setIsMusic: Dispatch<SetStateAction<boolean>>
  currentOrder: Order
  isMusic: boolean
  duration: number
  audioRef: RefObject<HTMLAudioElement | null>
  volume: number
  // bufferPercent: number
  currentTime: number
}
//需要放在最外面，否则每次执行函数都会重新创建变量
let volumeCache = 0
let isJingyin = false
export default function useAudio(): IAudio {
  const { duration, playingMusicList, currentMusic, currentTime } = useMusicStore()
  // 是否播放音乐
  const [isMusic, setIsMusic] = useState(false)
  //获取audio元素
  const audioRef = useRef<HTMLAudioElement>(null)
  //音量状态
  const [volume, setVolume] = useState(INITIAL_VOLUME)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const switchMusicStaus = () => {
    if (audioRef.current) {
      isMusic ? audioRef.current.pause() : audioRef.current.play()
      setIsMusic(!isMusic)
    }
  }

  const canplay = (e: SyntheticEvent<HTMLAudioElement, Event>) => {
    isMusic ? audioRef.current?.play() : audioRef.current?.pause()
  }

  const changeJingyin = () => {
    // isJingyin和volumnCache放在函数外，防止每次执行函数都重新声明变量
    if (!isJingyin) {
      volumeCache = volume
      setVolume(0)
    } else {
      setVolume(volumeCache)
    }
    isJingyin = !isJingyin
  }
  
  const [bufferPercent, setBufferPercent] = useState(0)

  const audioTimeUpdate = (e: any, fn?: (e: any) => void) => {
    // if (audioRef.current) {
    //   // 获取timeRange
    //   const timeRanges = audioRef.current.buffered
    //   // 最后一个timeRange对象
    //   const last = timeRanges.length - 1
    //   // 当最后一个timeRange对象存在时，可以获取到当前缓冲区的长度（单位是s）
    //   if (last >= 0) {
    //     const bufferPercent = (timeRanges.end(last) / duration) * 1000
    //     setBufferPercent(bufferPercent > 1 ? 1 : bufferPercent)
    //   }
    // }
    // 会修改全局的currentTime和currentLyricIndex
    fn && fn(e)
  }

  const [currentOrder, setCurrentOrder] = useState<Order>('cycle')

  const switchMusic = (type: 'pre' | 'next', order: Order = 'cycle') => {
    // 如果有歌曲就执行
    if (playingMusicList.length) {
      let currentIndex = playingMusicList.findIndex((item) => item === currentMusic)
      let Music: MusicListItem | null = null

      switch (order) {
        case 'cycle': {
          currentIndex += type === 'pre' ? -1 : 1
          //循环播放
          currentIndex =
            currentIndex < 0 ? playingMusicList.length - 1 : currentIndex % playingMusicList.length
          break
        }
        case 'single': {
          break
        }
        case 'random': {
          currentIndex = Math.floor(Math.random() * (playingMusicList.length + 1))
        }
      }
      Music = playingMusicList[currentIndex]
      // 改变当前音乐
      useSwitchCurrentMusic(Music)
      // 根据当前状态判断是否要播放
      isMusic ? audioRef.current?.play() : audioRef.current?.pause()
    }
  }

  const switchOrder = () => {
    const index = ORDER.findIndex((item) => item === currentOrder)
    setCurrentOrder(ORDER[(index + 1) % ORDER.length] as Order)
  }

  const onError = () => {
    if (!currentMusic.initFlag) {
      //防止因为单曲循环报错而不切换音乐
      switchMusic('next', currentOrder === 'single' ? 'cycle' : currentOrder)
      //TODO:Error时发出提示，并且不在切换音乐
    }
  }

  const onEnd = () => {
    switchMusic('next', currentOrder)
  }

  return {
    switchMusicStaus,
    audioTimeUpdate,
    changeJingyin,
    switchMusic,
    setVolume,
    canplay,
    onError,
    onEnd,
    switchOrder,
    setIsMusic,
    currentOrder,
    // bufferPercent,
    currentTime,
    isMusic,
    duration,
    audioRef,
    volume
  }
}
