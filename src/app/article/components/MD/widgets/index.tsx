'use client';

import type { WidgetPayload } from './types';
import {
  AudioWidget,
  BilibiliWidget,
  CtaWidget,
  DouyinWidget,
  GalleryWidget,
  NeteaseWidget,
  StepsWidget,
  TabsWidget,
  TimelineWidget,
  YoutubeWidget,
} from './components';

type Props = {
  data: WidgetPayload;
  onPreview?: (src: string, urls: string[]) => void;
};

export default function WidgetRenderer({ data, onPreview }: Props) {
  switch (data.type) {
    case 'bilibili':
      return <BilibiliWidget data={data} />;
    case 'youtube':
      return <YoutubeWidget data={data} />;
    case 'netease':
      return <NeteaseWidget data={data} />;
    case 'douyin':
      return <DouyinWidget data={data} />;
    case 'audio':
      return <AudioWidget data={data} />;
    case 'tabs':
      return <TabsWidget data={data} />;
    case 'timeline':
      return <TimelineWidget data={data} />;
    case 'steps':
      return <StepsWidget data={data} />;
    case 'cta':
      return <CtaWidget data={data} />;
    case 'gallery':
      return <GalleryWidget data={data} onPreview={onPreview} />;
    default:
      return (
        <div className="tx-widget tx-widget--unknown">
          未知小组件类型：{String((data as WidgetPayload).type)}
        </div>
      );
  }
}
