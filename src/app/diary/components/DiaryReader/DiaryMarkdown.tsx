'use client';

import { type ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import 'katex/dist/katex.min.css';

import './DiaryMarkdown.scss';

// 翻页时同一页正文会被复制到多张切片上，按内容缓存解析结果，避免重复解析
const CACHE_LIMIT = 8;
const cache = new Map<string, ReactNode>();

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
        img: ({ src, alt }) => <img src={src} alt={alt ?? ''} loading="lazy" className="diary-md-img" />,
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
  return <div className="diary-md">{renderMarkdown(content)}</div>;
}
