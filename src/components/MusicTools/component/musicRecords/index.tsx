import Image from 'next/image'
import { Dispatch, SetStateAction } from 'react'
import { imgUrl } from '@/utils'
import { IMusicInfo } from '@/hooks/useMusic'

export default function MusicRecords(props: {
  active: boolean
  isMusic: boolean
  setPanActive: Dispatch<SetStateAction<boolean>>
  musicInfo: IMusicInfo
}) {
  const { active, isMusic, setPanActive, musicInfo } = props
  const { al } = musicInfo

  return (
    <div
      className={`fixed left-[3px] bottom-[50px] w-[80px] h-[80px] cursor-pointer z-[999] rounded-full translate-x-[-50%] transition duration-DEFAULT transform ${
        active
          ? 'translate-x-[10px] translate-y-[-135px] md:translate-x-[20px] md:translate-y-[-80px] shadow-lg hover:shadow-white'
          : 'hover:translate-x-0'
      }`}
    >
      <div
        className={`bg-hero-pattern bg-cover h-full w-full rounded-full p-[13px] animate-cycle ${
          isMusic ? 'animate-running' : 'animate-paused'
        }`}
        id="musicTools"
        onClick={() => setPanActive(!active)}
      >
        <Image
          width={54}
          height={54}
          src={imgUrl(54, al?.picUrl)}
          alt="图片"
          className="rounded-full object-cover h-full w-full"
        />
      </div>
    </div>
  )
}
