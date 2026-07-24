'use client';

import { useState } from 'react';
import type {
  GalleryItem,
  StepItem,
  TabItem,
  TimelineItem,
  WidgetPayload,
} from './types';

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function WidgetShell({
  children,
  className,
  label,
}: {
  children: React.ReactNode;
  className?: string;
  label?: string;
}) {
  return (
    <div className={cx('tx-widget', className)} data-widget={label}>
      {children}
    </div>
  );
}

export function BilibiliWidget({ data }: { data: WidgetPayload }) {
  const bvid = asString(data.bvid || data.id);
  if (!bvid) return null;
  const page = Number(data.page || 1) || 1;
  const src = `https://player.bilibili.com/player.html?bvid=${encodeURIComponent(bvid)}&page=${page}&high_quality=1&danmaku=0`;

  return (
    <WidgetShell label="bilibili" className="tx-widget--media">
      <div className="tx-widget__ratio">
        <iframe
          src={src}
          title={`Bilibili ${bvid}`}
          allowFullScreen
          scrolling="no"
          frameBorder={0}
          sandbox="allow-scripts allow-same-origin allow-popups allow-presentation"
        />
      </div>
    </WidgetShell>
  );
}

export function YoutubeWidget({ data }: { data: WidgetPayload }) {
  const id = asString(data.id || data.videoId);
  if (!id) return null;
  return (
    <WidgetShell label="youtube" className="tx-widget--media">
      <div className="tx-widget__ratio">
        <iframe
          src={`https://www.youtube.com/embed/${encodeURIComponent(id)}`}
          title={`YouTube ${id}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </WidgetShell>
  );
}

export function NeteaseWidget({ data }: { data: WidgetPayload }) {
  const id = asString(data.id);
  const auto = data.auto === true || data.autoplay === true ? 1 : 0;
  if (!id) return null;
  return (
    <WidgetShell label="netease" className="tx-widget--embed">
      <iframe
        className="tx-widget__netease"
        src={`https://music.163.com/outchain/player?type=2&id=${encodeURIComponent(id)}&auto=${auto}&height=66`}
        title={`Netease ${id}`}
      />
    </WidgetShell>
  );
}

export function DouyinWidget({ data }: { data: WidgetPayload }) {
  const id = asString(data.id || data.vid);
  if (!id) return null;
  return (
    <WidgetShell label="douyin" className="tx-widget--media">
      <div className="tx-widget__ratio tx-widget__ratio--portrait">
        <iframe
          src={`https://open.douyin.com/player/video?vid=${encodeURIComponent(id)}&autoplay=0`}
          title={`Douyin ${id}`}
          referrerPolicy="unsafe-url"
          allowFullScreen
          className="douyin"
        />
      </div>
    </WidgetShell>
  );
}

export function AudioWidget({ data }: { data: WidgetPayload }) {
  const src = asString(data.src || data.url);
  const title = asString(data.title, '音频');
  if (!src) return null;
  return (
    <WidgetShell label="audio" className="tx-widget--card">
      <div className="tx-widget__audio">
        <div className="tx-widget__audio-meta">
          <strong>{title}</strong>
          {asString(data.artist) && <span>{asString(data.artist)}</span>}
        </div>
        <audio controls preload="none" src={src}>
          你的浏览器不支持音频播放
        </audio>
      </div>
    </WidgetShell>
  );
}

export function TabsWidget({ data }: { data: WidgetPayload }) {
  const items = asArray<TabItem>(data.items).filter((item) => item?.title);
  const [active, setActive] = useState(0);
  if (!items.length) return null;
  const current = items[Math.min(active, items.length - 1)];

  return (
    <WidgetShell label="tabs" className="tx-widget--card">
      <div className="tx-widget__tabs" role="tablist">
        {items.map((item, index) => (
          <button
            key={`${item.title}-${index}`}
            type="button"
            role="tab"
            aria-selected={index === active}
            className={cx(index === active && 'is-active')}
            onClick={() => setActive(index)}
          >
            {item.title}
          </button>
        ))}
      </div>
      <div className="tx-widget__tab-panel whitespace-pre-wrap" role="tabpanel">
        {current?.content || ''}
      </div>
    </WidgetShell>
  );
}

export function TimelineWidget({ data }: { data: WidgetPayload }) {
  const items = asArray<TimelineItem>(data.items);
  if (!items.length) return null;
  return (
    <WidgetShell label="timeline" className="tx-widget--card">
      <div className="tx-widget__timeline">
        {items.map((item, index) => (
          <div className="tx-widget__timeline-item" key={`${item.title}-${index}`}>
            <span className="tx-widget__dot" aria-hidden />
            <div className="tx-widget__timeline-body">
              {item.time && <time>{item.time}</time>}
              <strong>{item.title}</strong>
              {item.content && <p className="whitespace-pre-wrap">{item.content}</p>}
            </div>
          </div>
        ))}
      </div>
    </WidgetShell>
  );
}

export function StepsWidget({ data }: { data: WidgetPayload }) {
  const items = asArray<StepItem>(data.items);
  if (!items.length) return null;
  return (
    <WidgetShell label="steps" className="tx-widget--card">
      <div className="tx-widget__steps">
        {items.map((item, index) => (
          <div className="tx-widget__step-item" key={`${item.title}-${index}`}>
            <span className="tx-widget__step-index">{index + 1}</span>
            <div className="tx-widget__step-body">
              <strong>{item.title}</strong>
              {item.content && <p className="whitespace-pre-wrap">{item.content}</p>}
            </div>
          </div>
        ))}
      </div>
    </WidgetShell>
  );
}

export function CtaWidget({ data }: { data: WidgetPayload }) {
  const title = asString(data.title, '立刻行动');
  const description = asString(data.description);
  const primaryText = asString(data.primaryText || data.buttonText, '了解更多');
  const primaryUrl = asString(data.primaryUrl || data.url || data.href, '#');
  const secondaryText = asString(data.secondaryText);
  const secondaryUrl = asString(data.secondaryUrl);

  return (
    <WidgetShell label="cta" className="tx-widget--cta">
      <div>
        <strong>{title}</strong>
        {description && <p>{description}</p>}
      </div>
      <div className="tx-widget__cta-actions">
        <a href={primaryUrl} target="_blank" rel="noopener noreferrer" className="is-primary">
          {primaryText}
        </a>
        {secondaryText && secondaryUrl && (
          <a href={secondaryUrl} target="_blank" rel="noopener noreferrer">
            {secondaryText}
          </a>
        )}
      </div>
    </WidgetShell>
  );
}

export function GalleryWidget({
  data,
  onPreview,
}: {
  data: WidgetPayload;
  onPreview?: (src: string, urls: string[]) => void;
}) {
  const items = asArray<GalleryItem>(data.items).filter((item) => item?.src);
  const urls = items.map((item) => item.src);
  if (!items.length) return null;

  return (
    <WidgetShell label="gallery" className="tx-widget--card">
      <div className={cx('tx-widget__gallery', items.length === 1 && 'is-single')}>
        {items.map((item, index) => (
          <button
            key={`${item.src}-${index}`}
            type="button"
            className="tx-widget__gallery-item"
            onClick={() => onPreview?.(item.src, urls)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.src} alt={item.alt || `gallery-${index + 1}`} />
          </button>
        ))}
      </div>
    </WidgetShell>
  );
}
