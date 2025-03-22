'use client'

import {
  FaVolumeHigh,
  FaVolumeLow,
  FaVolumeOff,
  FaVolumeXmark,
  FaForwardStep,
  FaBackwardStep,
  FaPause,
  FaPlay,
  FaBarsStaggered
} from 'react-icons/fa6'
import { Card, CardFooter, Button, Slider } from '@heroui/react'
import useMusicInfo from '@/hooks/useMusic'
import useLyric from '@/hooks/useLyric'
import useAudio from '@/hooks/useAudio'
import CardHeader from './component/cardHeader'
import MusicLyric from './component/musicLyric'
import { formatTime } from '@/utils/dayFormat'
import { useState } from 'react'
import MusicRecords from './component/musicRecords'
import useHover from '@heroui/react/'

export default function MusicTools() {
  // 是否展开card
  const [isExpanded, setIsExpanded] = useState(false)
  // 是否点击了pan显示card
  const [active, setPanActive] = useState(false)
  // 获取音乐信息的Hook
  const musicInfo = useMusicInfo()
  // 获取歌词信息的Hook
  const lyricInfo = useLyric()
  // 获取歌词信息的Hook
  const lyricInfo2 = useLyric()
  // 获取音频信息的Hook
  const audioInfo = useAudio()
  const {
    isMusic,
    audioRef,
    currentOrder,
    volume,
    currentTime,
    duration,
    changeJingyin,
    canplay,
    onEnd,
    onError,
    switchMusicStaus,
    switchMusic,
    setVolume
  } = audioInfo
  // // 获取时间进度条
  // const TimeSlider = getImpTimeSlider(audioInfo, lyricInfo)
  // // 获取音乐进度条
  // const VolumeSlider = getImpVolumeSlider(audioInfo)

  const iconSize = 20

  // 判断音量图标
  const VolumeIcon = () => {
    if (volume === 0) {
      return <FaVolumeXmark size={iconSize} />
    } else if (volume > 0 && volume <= 0.33) {
      return <FaVolumeOff size={iconSize} />
    } else if (volume > 0.33 && volume <= 0.66) {
      return <FaVolumeLow size={iconSize} />
    } else if (volume > 0.66 && volume <= 1) {
      return <FaVolumeHigh size={iconSize} />
    }
  }

  const updateTime = (value: number | number[]) => {
    if (typeof value === 'number' && audioRef.current) {
      audioRef.current.currentTime = value / 1000
    }
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={musicInfo.url}
        onTimeUpdate={(e) => lyricInfo.updateTime(e)}
        onCanPlay={(e) => canplay(e)}
        onEnded={() => onEnd()}
        onError={() => onError()}
      />
      {/* 小圆唱片 */}
      <MusicRecords
        active={active}
        setPanActive={setPanActive}
        isMusic={isMusic}
        musicInfo={musicInfo}
      />

      <Card
        isBlurred
        isFooterBlurred
        shadow="sm"
        className={`fixed top-[68%] left-[1%] border-none bg-contain bg-background/60 dark:bg-default-100/50 z-[998] ${
          active
            ? 'translate-x-0 translate-y-0 scale-100 opacity-100'
            : 'translate-x-[-500px] translate-y-[500px] scale-0 opacity-0'
        } ${isExpanded ? 'md:w-[80vw] md:h-[80vh] md:top-[8%]' : 'w-[300px] h-[260px] md:w-[700px] md:h-[200px]'}`}
      >
        {/* 音乐歌单组件 */}
        <CardHeader
          musicInfo={musicInfo}
          lyricInfo={lyricInfo2}
          audioInfo={audioInfo}
          isExpanded={isExpanded}
        />

        {/* 音乐信息组件 */}
        <CardFooter
          className={`grid grid-cols-6 md:grid-cols-12 items-center justify-center w-full md:w-full h-[600px] transition-all duration-MUSIC ease-in-out transform ${
            isExpanded ? 'gap-4 md:gap-20' : 'gap-6 md:gap-2'
          }`}
        >
          <div className="hidden md:flex flex-col items-center col-span-8 col-start-1 h-[180px] md:col-span-3 md:col-start-3">
            {/* 歌词 */}
            <MusicLyric leading={10} musicInfo={musicInfo} lyricInfo={lyricInfo} />
          </div>
          <div
            className={`flex flex-col col-span-8 col-start-1 justify-center ${
              isExpanded ? 'md:col-start-6 md:col-span-8' : 'md:col-start-7 md:col-span-6'
            }`}
          >
            {/* 播放按钮 */}
            <div className="flex items-end justify-center h-full">
              <Button
                isIconOnly
                className="data-[hover]:bg-foreground/10"
                radius="full"
                variant="light"
                onPress={() => switchMusic('pre', currentOrder)}
              >
                <FaBackwardStep size={iconSize} />
              </Button>
              <Button
                isIconOnly
                className="data-[hover]:bg-foreground/10"
                radius="full"
                variant="light"
                onPress={() => switchMusicStaus()}
              >
                {isMusic ? <FaPause size={iconSize} /> : <FaPlay size={iconSize} />}
              </Button>
              <Button
                isIconOnly
                className="data-[hover]:bg-foreground/10"
                radius="full"
                variant="light"
                onPress={() => switchMusic('next', currentOrder)}
              >
                <FaForwardStep size={iconSize} />
              </Button>
              <div className="flex flex-col group">
                <Slider
                  className="opacity-0 group-hover:opacity-100 h-14"
                  defaultValue={volume}
                  value={volume}
                  maxValue={1}
                  minValue={0}
                  orientation="vertical"
                  size="sm"
                  step={0.02}
                  color="foreground"
                  onChange={(value) => setVolume(value as number)}
                />
                <Button
                  isIconOnly
                  className="data-[hover]:bg-foreground/10"
                  radius="full"
                  variant="light"
                  onPress={() => changeJingyin()}
                >
                  {VolumeIcon()}
                </Button>
              </div>
              <Button
                isIconOnly
                className="data-[hover]:bg-foreground/10"
                radius="full"
                variant="light"
                onPress={() => setIsExpanded(!isExpanded)}
              >
                <FaBarsStaggered size={iconSize} />
              </Button>
            </div>
            {/* 播放进度 */}
            <div className="flex flex-col mt-3 gap-1">
              <Slider
                aria-label="Music progress"
                classNames={{
                  track: 'bg-default-500/30',
                  thumb: 'w-2 h-2 after:w-2 after:h-2 after:bg-foreground'
                }}
                color="foreground"
                defaultValue={0}
                maxValue={duration}
                size="sm"
                onChangeEnd={(value) => updateTime(value)}
              />
              <div className="flex justify-between">
                <p className="text-small">{formatTime(currentTime)}</p>
                <p className="text-small text-foreground/50">{formatTime(duration)}</p>
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </>
  )
}
