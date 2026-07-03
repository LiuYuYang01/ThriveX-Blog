'use client';

import { type ReactNode, useEffect, useRef, useState } from 'react';
import { LuList, LuX } from 'react-icons/lu';
import type { TocHeading } from '@/utils/article';

type Props = {
  headings: TocHeading[];
  children: ReactNode;
};

const TOC_WIDTH = 220;
const TOC_OFFSET = 48;
const TOC_VIEWPORT_MIN = 12;
const HEADER_OFFSET = 96;
const LEVEL_INDENT: Record<number, string> = {
  1: 'pl-2',
  2: 'pl-4',
  3: 'pl-6',
};

function TocNav({
  headings,
  activeId,
  onSelect,
  overlay = false,
}: {
  headings: TocHeading[];
  activeId: string;
  onSelect: (id: string) => void;
  overlay?: boolean;
}) {
  return (
    <nav aria-label="文章目录">
      <ul className="space-y-0.5 overflow-y-auto pr-1">
        {headings.map((heading) => {
          const active = activeId === heading.id;
          const indent = LEVEL_INDENT[heading.level] ?? 'pl-0';

          return (
            <li key={heading.id}>
              <button
                type="button"
                onClick={() => onSelect(heading.id)}
                className={`relative w-full rounded-lg text-left text-[13px] leading-snug transition-colors cursor-pointer ${overlay ? 'py-2' : 'py-1.5'} ${indent} ${
                  active
                    ? 'bg-primary/10 font-medium text-primary'
                    : overlay
                      ? 'text-[#4d4d4d] dark:text-[#8c9ab1]'
                      : 'text-[#4d4d4d] hover:bg-neutral-100 hover:text-neutral-900 dark:text-[#8c9ab1] dark:hover:bg-[#313d4e99] dark:hover:text-neutral-200'
                }`}
              >
                {active ? (
                  <span
                    aria-hidden
                    className="absolute left-0 top-1/2 h-3.5 w-0.5 -translate-y-1/2 rounded-full bg-primary"
                  />
                ) : null}
                <span className="line-clamp-2">{heading.text}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default function ArticleTOC({ headings, children }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canShow, setCanShow] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [fixedLeft, setFixedLeft] = useState(0);
  const [activeId, setActiveId] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      const hero = document.getElementById('article-hero');
      const container = containerRef.current;
      if (!container || window.innerWidth < 1280) {
        setCanShow(false);
        setIsPinned(false);
        return;
      }

      const { left } = container.getBoundingClientRect();
      const tocLeft = left - TOC_WIDTH - TOC_OFFSET;

      if (tocLeft < TOC_VIEWPORT_MIN) {
        setCanShow(false);
        setIsPinned(false);
        return;
      }

      setCanShow(true);
      setFixedLeft(tocLeft);
      setIsPinned(hero ? hero.getBoundingClientRect().bottom <= HEADER_OFFSET : false);
    };

    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, { passive: true });

    const observer = new ResizeObserver(update);
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update);
      observer.disconnect();
    };
  }, [headings]);

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let retryTimer: ReturnType<typeof setTimeout>;

    const setup = () => {
      const elements = headings
        .map((heading) => document.getElementById(heading.id))
        .filter((element): element is HTMLElement => Boolean(element));

      if (!elements.length) {
        retryTimer = setTimeout(setup, 150);
        return;
      }

      observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

          if (visible.length > 0) {
            setActiveId(visible[0].target.id);
          }
        },
        { rootMargin: '-96px 0px -55% 0px', threshold: 0 },
      );

      elements.forEach((element) => observer!.observe(element));
    };

    setup();

    return () => {
      clearTimeout(retryTimer);
      observer?.disconnect();
    };
  }, [headings]);

  useEffect(() => {
    if (!mobileOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false);
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  const handleSelect = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
      window.scrollTo({ top, behavior: 'smooth' });
      setActiveId(id);
      setMobileOpen(false);
    }
  };

  const panel = (
    <TocNav headings={headings} activeId={activeId} onSelect={handleSelect} />
  );

  if (headings.length < 2) {
    return <div className="flex min-w-0 flex-col gap-4">{children}</div>;
  }

  return (
    <div ref={containerRef} className="relative flex min-w-0 flex-col gap-4">
      {canShow ? (
        <div
          className={`z-40 hidden xl:block ${isPinned ? 'fixed' : 'absolute top-0'}`}
          style={
            isPinned
              ? { top: HEADER_OFFSET, left: fixedLeft, width: TOC_WIDTH }
              : { left: -(TOC_WIDTH + TOC_OFFSET), width: TOC_WIDTH }
          }
        >
          {panel}
        </div>
      ) : null}

      {children}

      <div className="fixed bottom-6 left-4 z-40 xl:hidden">
        {mobileOpen ? (
          <div
            role="dialog"
            aria-label="文章目录"
            className="fixed bottom-[4.5rem] left-4 z-50 w-[min(18rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-black/5 bg-white/80 backdrop-blur-2xl shadow-lg dark:border-white/10 dark:bg-black-b/80"
          >
            <div className="border-b border-neutral-100/80 px-4 py-2.5 text-center dark:border-[#4e5969]/50">
              <span className="text-sm font-medium text-[#333] dark:text-[#e5e7eb]">目录</span>
            </div>
            <div className="max-h-[min(52vh,18rem)] overflow-y-auto p-3">
              <TocNav headings={headings} activeId={activeId} onSelect={handleSelect} overlay />
            </div>
          </div>
        ) : null}

        <button
          type="button"
          aria-label={mobileOpen ? '关闭文章目录' : '打开文章目录'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
          className="relative z-50 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white shadow-[0_4px_20px_-4px_rgba(83,157,253,0.55)] transition-transform active:scale-95 cursor-pointer"
        >
          {mobileOpen ? <LuX className="h-5 w-5" /> : <LuList className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
}
