export type WidgetType =
  | 'bilibili'
  | 'youtube'
  | 'netease'
  | 'douyin'
  | 'audio'
  | 'tabs'
  | 'timeline'
  | 'steps'
  | 'cta'
  | 'gallery';

export type WidgetPayload = {
  type: WidgetType;
  [key: string]: unknown;
};

export type TabItem = { title: string; content: string };
export type TimelineItem = { time?: string; title: string; content?: string };
export type StepItem = { title: string; content?: string };
export type GalleryItem = { src: string; alt?: string };
