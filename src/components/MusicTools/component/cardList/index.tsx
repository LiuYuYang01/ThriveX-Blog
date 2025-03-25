'use client'

import { MusicListItem } from '@/types/app/music'
import { useMusicStore } from '@/stores'
import img from '@/assets/image/playing.gif'
import Image from 'next/image'
import { formatTime } from '@/utils/dayFormat'
import { LIST_NULL_TEXT } from '@/constant'

interface Props {
  rowClick?: (item: MusicListItem) => void
  rowDoubleClick?: (item: MusicListItem) => void
}

let timer: any = null

export default function CardList(props: Props) {
  // 请求热榜推荐歌曲的数据
  const { rowClick, rowDoubleClick } = props
  const { currentMusic, dailyMusicList } = useMusicStore()

  // 单击row触发事件
  const single = (item: MusicListItem) => {
    clearTimeout(timer) // 清除第二次单击事件
    timer = setTimeout(() => {
      rowClick && rowClick(item)
    }, 200)
  }

  // 双击row触发事件
  const double = (item: MusicListItem) => {
    clearTimeout(timer) // 清除第一次单击事件
    rowDoubleClick && rowDoubleClick(item)
  }

  if (!dailyMusicList.length || !dailyMusicList)
    return <div className="flex h-full w-full justify-center items-center">{LIST_NULL_TEXT}</div>

  return (
    <>
      <div className="flex flex-col h-[550px] w-[700px]">
        <div className="flex indent-3.5 font-thin border-1 border-[hsla(0,0%,100%,.1)] leading-[50px]">
          <span className="w-[80px]" />
          <span className="flex-[5]">歌曲</span>
          <span className="flex-[2]">歌手</span>
          <span className="w-[80px]">时长</span>
        </div>
        <div className="flex-1 overflow-auto">
          {dailyMusicList.map((item, index) => (
            <div
              key={item.id}
              className="flex indent-3.5 leading-[50px] border-1 font-thin cursor-pointer border-[hsla(0,0%,100%,.1)] hover:bg-[rgba(0,0,0,.05)]"
              onClick={() => single(item)}
              onDoubleClick={() => double(item)}
            >
              {/* 序号 */}
              <span className="w-[80px] flex items-center justify-center">
                {currentMusic.id === item.id ? <Image src={img} alt="" /> : index + 1}
              </span>
              {/* 歌名 */}
              <span className="flex-[5] realative">{item.name}</span>
              {/* 歌手 */}
              <span className="flex-[2]">{item.ar && item.ar[0].name}</span>
              {/* 时长 */}
              <span className="w-[80px]">{formatTime(item.dt ?? 0)}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
