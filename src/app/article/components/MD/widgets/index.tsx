'use client';

import type { WidgetPayload } from './types';
import {
  ArticleRefWidget,
  AudioWidget,
  BilibiliWidget,
  CalloutWidget,
  CollapseWidget,
  ComparisonWidget,
  CtaWidget,
  DiffWidget,
  DouyinWidget,
  GalleryWidget,
  LinkCardWidget,
  NeteaseWidget,
  RatingWidget,
  StepsWidget,
  TabsWidget,
  TimelineWidget,
  YoutubeWidget,
} from './components';

type Props = {
  data: WidgetPayload;
  onPreview?: (src: string, urls: string[]) => void;
  /** 段落内链接别名渲染的块级组件标记，供 p 渲染器识别（内部约定，不进 DOM） */
  txBlock?: boolean;
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
    case 'callout':
      return <CalloutWidget data={data} />;
    case 'link-card':
      return <LinkCardWidget data={data} />;
    case 'collapse':
      return <CollapseWidget data={data} />;
    case 'diff':
      return <DiffWidget data={data} />;
    case 'rating':
      return <RatingWidget data={data} />;
    case 'comparison':
      return <ComparisonWidget data={data} />;
    case 'article-ref':
      return <ArticleRefWidget data={data} />;
    default:
      return (
        <div className="tx-widget tx-widget--unknown">
          未知小组件类型：{String((data as WidgetPayload).type)}
        </div>
      );
  }
}
