'use client';

import { Children, isValidElement, type MouseEvent, useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import 'katex/dist/katex.min.css';

import './DiaryMarkdown.scss';

// 翻页时同一页正文会被复制到多张切片上，按内容缓存解析结果，避免重复解析
const CACHE_LIMIT = 8;
const cache = new Map<string, ReactNode>();

const DiaryImage = ({ src, alt }: { src?: string | Blob; alt?: string }) => (
  <img src={typeof src === 'string' ? src : undefined} alt={alt ?? ''} loading="lazy" className="diary-md-img" />
);

// 图片独占一段时换成不带行高的容器，否则段落里的文字会被压成 0 行高和图片叠在一起
const DiaryParagraph = ({ children }: { children?: ReactNode }) => {
  const items = Children.toArray(children).filter((child) => !(typeof child === 'string' && !child.trim()));
  const onlyImage = items.length === 1 && isValidElement(items[0]) && items[0].type === DiaryImage;
  return onlyImage ? <div className="diary-md-figure">{items[0]}</div> : <p>{children}</p>;
};

const renderMarkdown = (content: string): ReactNode => {
  const cached = cache.get(content);
  if (cached) return cached;

  const node = (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        a: ({ href, children, ...rest }) =>
          href?.startsWith('#') ? (
            <a href={href} {...rest}>
              {children}
            </a>
          ) : (
            <a href={href} target="_blank" rel="noreferrer noopener" {...rest}>
              {children}
            </a>
          ),
        img: DiaryImage,
        p: DiaryParagraph,
      }}
    >
      {content}
    </ReactMarkdown>
  );

  cache.set(content, node);
  if (cache.size > CACHE_LIMIT) cache.delete(cache.keys().next().value as string);
  return node;
};

export default function DiaryMarkdown({ content }: { content: string }) {
  const [viewer, setViewer] = useState<{ src: string; alt: string } | null>(null);

  const openViewer = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target;
    if (!(target instanceof HTMLImageElement) || !target.currentSrc) return;
    setViewer({ src: target.currentSrc, alt: target.alt });
  };

  useEffect(() => {
    if (!viewer) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setViewer(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [viewer]);

  return (
    <div className="diary-md" onClick={openViewer}>
      {renderMarkdown(content)}
      {viewer
        ? createPortal(
            <div className="diary-viewer" role="dialog" aria-modal="true" aria-label={viewer.alt || '查看图片'} onClick={() => setViewer(null)}>
              <img src={viewer.src} alt={viewer.alt} />
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
