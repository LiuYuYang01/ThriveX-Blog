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
  | 'gallery'
  | 'callout'
  | 'link-card'
  | 'collapse'
  | 'diff'
  | 'rating'
  | 'comparison'
  | 'article-ref';

export type WidgetPayload = {
  type: WidgetType;
  [key: string]: unknown;
};

export type TabItem = { title: string; content: string };
export type TimelineItem = { time?: string; title: string; content?: string };
export type StepItem = { title: string; content?: string };
export type GalleryItem = { src: string; alt?: string };
export type RatingItem = { label?: string; score: number };
export type ComparisonItem = { label?: string; left?: string; right?: string };
export type ArticleRefItem = { id?: number; title?: string; description?: string; cover?: string };
