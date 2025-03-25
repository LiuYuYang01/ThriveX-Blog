import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { MusicListItem } from '@/types/app/music'

interface initialMusic {
  // 每日推荐音乐列表
  dailyMusicList: MusicListItem[]
  // 正在播放音乐列表
  playingMusicList: MusicListItem[]
  // 当前音乐信息
  currentMusic: MusicListItem
  // 当前音乐的歌词
  currentLyric: string
  // 当前音乐的时长
  duration: number
  // 当前音乐的播放时间
  currentTime: number
  // 当前音乐的歌词下标
  currentLyricIndex: number
}

// 初始化状态（initFlag为了判断是否是第一次）
export const initialCurrentMusic = { initFlag: true }
const initialState: initialMusic = {
  dailyMusicList: [],
  //JSON.parse(localStorage.getItem('music_storage') || '[]').playingMusicList
  playingMusicList: [],
  currentMusic: initialCurrentMusic,
  currentLyric: '',
  duration: 0,
  currentTime: 0,
  currentLyricIndex: 0
}

interface musicState {
  dailyMusicList: MusicListItem[]
  changeDailyMusicList: (status: MusicListItem[]) => void

  playingMusicList: MusicListItem[]
  pushPlayingMusicList: (status: MusicListItem) => void
  removeFromPlayingMusicList: (status: MusicListItem[]) => void

  currentMusic: MusicListItem
  changeCurrentMusic: (status: MusicListItem) => void

  currentLyric: string
  changeCurrentLyric: (status: string) => void

  duration: number
  changeDuration: (status: number) => void

  currentTime: number
  changeCurrentTime: (status: number) => void

  currentLyricIndex: number
  changeCurrentLyricIndex: (status: number) => void
}
export default create(
  persist<musicState>(
    (set, get) => ({
      ...initialState,

      changeDailyMusicList: (status) => set({ dailyMusicList: status }),

      pushPlayingMusicList: (status) =>
        set({ playingMusicList: [...get().playingMusicList, status] }),

      removeFromPlayingMusicList: (status) =>
        set({ playingMusicList: status.filter((item) => !status.includes(item)) }),

      changeCurrentMusic: (status) => set({ currentMusic: status }),

      changeCurrentLyric: (status) => set({ currentLyric: status }),

      changeDuration: (status) => set({ duration: status }),

      changeCurrentTime: (status) => set({ currentTime: status }),

      changeCurrentLyricIndex: (status) => set({ currentLyricIndex: status }),
    }),
    {
      name: 'music_storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
)
