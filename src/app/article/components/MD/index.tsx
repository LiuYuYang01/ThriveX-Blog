'use client';

import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import type { TocHeading } from '@/utils/article';
import { useConfigStore } from '@/stores';
import PhotoPreview, { type PhotoItem } from '@/ThriveUI/PhotoPreview';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'katex/dist/katex.min.css';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { remarkMark } from 'remark-mark-highlight';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import rehypeSemanticBlockquotes from 'rehype-semantic-blockquotes';
import rehypeCallouts from 'rehype-callouts';
import 'rehype-callouts/theme/obsidian';
import Skeleton from '@/components/Skeleton';
import { BiCopy } from 'react-icons/bi';

import './index.scss';

import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

interface Props {
  data: string;
  headings?: TocHeading[];
}

const loadedImageUrls = new Set<string>();

function createHeadingComponents(headings: TocHeading[], indexRef: React.MutableRefObject<number>): Components {
  const nextId = () => headings[indexRef.current++]?.id;

  return {
    h1: ({ children }) => <h1 id={nextId()}>{children}</h1>,
    h2: ({ children }) => <h2 id={nextId()}>{children}</h2>,
    h3: ({ children }) => <h3 id={nextId()}>{children}</h3>,
  };
}

function extractMarkdownImages(content: string): string[] {
  const urls: string[] = [];
  const markdownPattern = /!\[[^\]]*]\(([^)]+)\)/g;
  let match: RegExpExecArray | null;
  while ((match = markdownPattern.exec(content)) !== null) {
    urls.push(match[1]);
  }
  const htmlPattern = /<img[^>]+src=["']([^"']+)["']/gi;
  while ((match = htmlPattern.exec(content)) !== null) {
    if (!urls.includes(match[1])) urls.push(match[1]);
  }
  return urls;
}

function CodeBlock({ language, value }: { language: string; value: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = value.split('\n').length > 10;

  const highlightedLines = (() => {
    try {
      if (hljs.getLanguage(language)) {
        return hljs.highlight(value, { language }).value.split('\n');
      }
    } catch (error) {
      console.error(error);
    }

    return hljs.highlightAuto(value).value.split('\n');
  })();

  const linesToRender = highlightedLines;
  if (linesToRender.length > 1 && linesToRender[linesToRender.length - 1] === '') {
    linesToRender.pop();
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(
      () => toast.success('代码已复制 🎉'),
      () => toast.error('复制失败 😖')
    );
  };

  return (
    <pre
      className={`mac-style with-line-number ${isLong ? (expanded ? 'expanded' : 'collapsed') : ''}`}
      onClick={() => {
        if (isLong && !expanded) setExpanded(true);
      }}
    >
      <div className="language-label">{language?.toLowerCase()}</div>

      <button
        className="copy-button"
        onClick={(e) => {
          e.stopPropagation();
          handleCopy();
        }}
        type="button"
        aria-label="复制代码"
      >
        <BiCopy size={16} />
      </button>

      <code className={`hljs language-${language}`}>
        {linesToRender.map((line, idx) => (
          <div key={idx} className="code-line">
            <span className="line-number">{idx + 1}</span>
            <span className="line-content" dangerouslySetInnerHTML={{ __html: line || '\u200B' }} />
          </div>
        ))}
      </code>

      {isLong && (
        <button
          className="toggle-btn"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
          type="button"
        >
          {expanded ? '收起代码' : `展开代码 (${value.split('\n').length - 1} 行)`}
        </button>
      )}
    </pre>
  );
}

function MarkdownImage({
  alt,
  src,
  className,
  onPreview,
}: React.ImgHTMLAttributes<HTMLImageElement> & { onPreview?: (src: string) => void }) {
  const imageSrc = typeof src === 'string' ? src : undefined;
  const [loaded, setLoaded] = useState(() => !!imageSrc && loadedImageUrls.has(imageSrc));

  const markLoaded = useCallback(() => {
    if (!imageSrc) return;
    loadedImageUrls.add(imageSrc);
    setLoaded(true);
  }, [imageSrc]);

  return (
    <span className="flex justify-center my-4 dark:brightness-90">
      <img
        alt={alt}
        src={imageSrc}
        className={`${className ?? 'max-h-[500px]'} ${loaded ? '' : 'markdown-img--loading'}`}
        onLoad={markLoaded}
        ref={(node) => {
          if (node?.complete) markLoaded();
        }}
        onClick={() => imageSrc && onPreview?.(imageSrc)}
      />
    </span>
  );
}

type MarkdownBodyProps = {
  data: string;
  headings: TocHeading[];
  onOpenPreview: (src: string) => void;
};

const MarkdownBody = memo(function MarkdownBody({ data, headings, onOpenPreview }: MarkdownBodyProps) {
  const headingIndexRef = useRef(0);

  const headingComponents = useMemo(
    () => createHeadingComponents(headings, headingIndexRef),
    [headings],
  );

  const renderers = useMemo<Partial<Components>>(
    () => ({
      img: (props) => <MarkdownImage {...props} onPreview={onOpenPreview} />,
      a: ({ href, children }: { href?: string; children?: React.ReactNode }) => {
        if (children === 'douyin-video' && href) {
          const videoId = href.split('/').pop();
          return (
            <div className="flex justify-center">
              <iframe src={`https://open.douyin.com/player/video?vid=${videoId}&autoplay=0`} referrerPolicy="unsafe-url" allowFullScreen className="douyin" />
            </div>
          );
        }
        return <a href={href}>{children}</a>;
      },
      code: ({ node, inline, className = '', children, ...props }: any) => {
        const match = /language-(\w+)/.exec(className || '');

        if (inline || !match) {
          return (
            <code className={className} {...props}>
              {children}
            </code>
          );
        }

        const language = match[1].toLowerCase();
        const codeString = node?.value ?? String(children);

        return <CodeBlock language={language} value={codeString} />;
      },
    }),
    [onOpenPreview],
  );

  useEffect(() => {
    const imgs = document.querySelectorAll<HTMLImageElement>('.ContentMdComponent .markdown-body img:not([data-blur-ready])');
    imgs.forEach((img) => {
      img.dataset.blurReady = 'true';
      const reveal = () => {
        if (img.src) loadedImageUrls.add(img.src);
        img.classList.remove('markdown-img--loading');
      };
      if (img.complete) reveal();
      else {
        img.classList.add('markdown-img--loading');
        img.addEventListener('load', reveal, { once: true });
      }
    });
  }, [data]);

  headingIndexRef.current = 0;

  return (
    <div className="ContentMdComponent">
      <ToastContainer autoClose={1000} hideProgressBar />

      <div className="content markdown-body">
        <ReactMarkdown components={{ ...renderers, ...headingComponents }} remarkPlugins={[[remarkGfm, { singleTilde: false }], remarkMath, remarkMark]} rehypePlugins={[rehypeRaw, rehypeKatex, rehypeCallouts, rehypeSemanticBlockquotes]}>
          {data}
        </ReactMarkdown>
      </div>
    </div>
  );
});

const ContentMD = ({ data, headings = [] }: Props) => {
  const { isDark } = useConfigStore();
  const [isClient, setIsClient] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewStartIndex, setPreviewStartIndex] = useState(0);

  const photos = useMemo<PhotoItem[]>(
    () => extractMarkdownImages(data).map((url, i) => ({ id: `${i}`, url, alt: `图片-${i + 1}` })),
    [data],
  );

  const openPreview = useCallback((src: string) => {
    const index = photos.findIndex((photo) => photo.url === src);
    setPreviewStartIndex(index >= 0 ? index : 0);
    setPreviewOpen(true);
  }, [photos]);

  const closePreview = useCallback(() => {
    setPreviewOpen(false);
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    document.body.style.backgroundColor = isDark ? '#0f0f0f' : '#fff';

    const color = isDark ? '36, 41, 48' : '255, 255, 255';
    const waves = document.querySelectorAll<SVGUseElement>('.waves use');
    if (waves.length) {
      waves[0].style.fill = `rgba(${color}, 0.7)`;
      waves[1].style.fill = `rgba(${color}, 0.5)`;
      waves[2].style.fill = `rgba(${color}, 0.3)`;
      waves[3].style.fill = `rgba(${color})`;
    }

    return () => {
      document.body.style.backgroundColor = '#f9f9f9';
      if (waves) {
        waves[0].style.fill = 'rgba(249, 249, 249, 0.7)';
        waves[1].style.fill = 'rgba(249, 249, 249, 0.5)';
        waves[2].style.fill = 'rgba(249, 249, 249, 0.3)';
        waves[3].style.fill = 'rgba(249, 249, 249)';
      }
    };
  }, [isDark, isClient]);

  if (!isClient) {
    return (
      <div className="ContentMdComponent">
        <div className="content markdown-body space-y-6 p-4">
          <Skeleton className="h-10 w-3/4" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-4/5" />
          </div>
          <Skeleton className="h-[200px] w-3/6 my-4" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-10/12" />
            <Skeleton className="h-4 w-9/12" />
          </div>
          <Skeleton className="h-[120px] w-full" />
        </div>
      </div>
    );
  }

  return (
    <>
      <MarkdownBody data={data} headings={headings} onOpenPreview={openPreview} />

      <PhotoPreview
        open={previewOpen}
        photos={photos}
        index={previewStartIndex}
        onClose={closePreview}
      />
    </>
  );
};

export default ContentMD;
