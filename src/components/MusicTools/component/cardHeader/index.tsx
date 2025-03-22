'use client'

import { Card, CardBody, CardHeader, Tabs, Tab } from '@heroui/react'
import CardRecommend from '../cardRecommend'
import { ILyric } from '@/hooks/useLyric'
import { IMusicInfo } from '@/hooks/useMusic'
import { IAudio } from '@/hooks/useAudio'
import MusicLyric from '../musicLyric'

export default function MusicHeader(props: {
  isExpanded: boolean
  lyricInfo: ILyric
  musicInfo: IMusicInfo
  audioInfo: IAudio
}) {
  const { lyricInfo, musicInfo, audioInfo, isExpanded } = props

  let tabs = [
    {
      title: '每日推荐',
      content: <CardRecommend audioInfo={audioInfo} />
    },
    {
      title: '正在播放',
      content: '敬请期待。。。'
    },

    {
      title: '我的歌单',
      content: '敬请期待。。。'
    }
  ]

  return (
    <CardHeader className={`grid-cols-6 gap-4 ${isExpanded ? 'hidden md:grid' : 'hidden'}`}>
      <Tabs
        className="col-start-1 col-end-3 md:col-start-2 md:col-end-4 "
        aria-label="Dynamic tabs"
        items={tabs}
        isVertical
      >
        {(item) => (
          <Tab key={item.title} title={item.title}>
            <Card>
              <CardBody>{item.content}</CardBody>
            </Card>
          </Tab>
        )}
      </Tabs>
      <div className="flex flex-col items-center col-start-5 w-[450px] h-[560px]">
        {/* 歌词 */}
        <MusicLyric leading={10} musicInfo={musicInfo} lyricInfo={lyricInfo} />
      </div>
    </CardHeader>
  )
}
