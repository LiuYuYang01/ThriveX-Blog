'use client';

import { useEffect, useRef, useState } from 'react';
import { LuChevronDown } from 'react-icons/lu';
import { Wall } from '@/types/app/wall';
import { getRelativeTimeLabel } from '@/utils';

const colorThemes: Record<string, { bg: string; pushpin: string; badge: string }> = {
  '#fcafa24d': {
    bg: 'linear-gradient(145deg,#FFE4E6,#FECDD3)',
    pushpin: 'linear-gradient(135deg,#fb7185,#e11d48)',
    badge: 'bg-rose-400/25 text-rose-800',
  },
  '#a8ed8a4d': {
    bg: 'linear-gradient(145deg,#D1FAE5,#A7F3D0)',
    pushpin: 'linear-gradient(135deg,#34d399,#059669)',
    badge: 'bg-emerald-400/25 text-emerald-800',
  },
  '#caa7f74d': {
    bg: 'linear-gradient(145deg,#EDE9FE,#DDD6FE)',
    pushpin: 'linear-gradient(135deg,#a78bfa,#7c3aed)',
    badge: 'bg-violet-400/25 text-violet-800',
  },
  '#ffe3944d': {
    bg: 'linear-gradient(145deg,#FEF3C7,#FDE68A)',
    pushpin: 'linear-gradient(135deg,#fbbf24,#d97706)',
    badge: 'bg-amber-400/25 text-amber-800',
  },
  '#92e6f54d': {
    bg: 'linear-gradient(145deg,#DBEAFE,#BFDBFE)',
    pushpin: 'linear-gradient(135deg,#60a5fa,#2563eb)',
    badge: 'bg-blue-400/25 text-blue-800',
  },
};

const defaultTheme = colorThemes['#ffe3944d'];
const rotations = [-3, 2.5, -1.8, 4, -2.8, 1.5, -3.5, 3, -2, 1.8, -3.2, 2.5];

const msgCardClass =
  'wall-paper-texture relative rounded-2xl p-6 ' +
  'shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.18)] ' +
  'transition-[rotate,scale,translate,box-shadow,opacity] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ' +
  'animate-[wall-card-enter_0.65s_ease_forwards] ' +
  'hover:rotate-0! hover:scale-[1.07] hover:-translate-y-2.5 hover:z-30 ' +
  'hover:shadow-[0_10px_24px_-6px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_10px_24px_-6px_rgba(0,0,0,0.28)]';

const pushpinClass =
  'absolute -top-2 left-1/2 z-5 size-4 -translate-x-1/2 rounded-full ' +
  'shadow-[0_2px_6px_rgba(0,0,0,0.35),inset_0_-3px_6px_rgba(0,0,0,0.15),inset_0_3px_6px_rgba(255,255,255,0.4)] ' +
  "after:absolute after:top-[3px] after:left-1 after:size-[5px] after:rounded-full after:bg-white/45 after:content-['']";

function getColumnCount(width: number) {
  if (width < 640) return 1;
  if (width < 768) return 2;
  if (width < 1024) return 3;
  return 4;
}

function estimateCardHeight(wall: Wall) {
  const lines = Math.ceil(wall.content.length / 16);
  return 150 + Math.min(lines, 7) * 22;
}

function distributeToShortestColumns(walls: Wall[], columnCount: number) {
  const columns: Wall[][] = Array.from({ length: columnCount }, () => []);
  const heights = Array(columnCount).fill(0);

  walls.forEach((wall) => {
    const targetCol = heights.indexOf(Math.min(...heights));
    columns[targetCol].push(wall);
    heights[targetCol] += estimateCardHeight(wall) + 32;
  });

  return columns;
}

function WallCardContent({ content }: { content: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState(false);
  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const update = () => {
      setCanScroll(el.scrollHeight > el.clientHeight + 1);
      setAtBottom(el.scrollHeight - el.scrollTop <= el.clientHeight + 1);
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(el);
    el.addEventListener('scroll', update, { passive: true });

    return () => {
      observer.disconnect();
      el.removeEventListener('scroll', update);
    };
  }, [content]);

  const showHint = canScroll && !atBottom;

  const scrollMore = () => {
    scrollRef.current?.scrollBy({ top: 72, behavior: 'smooth' });
  };

  return (
    <div className="relative z-10 mb-4">
      <div
        ref={scrollRef}
        className={`hide_sliding max-h-40 overflow-y-auto overscroll-y-contain text-sm leading-[1.75] text-stone-800 touch-pan-y ${
          showHint ? 'mask-[linear-gradient(to_bottom,black_78%,transparent)]' : ''
        }`}
        onWheel={(e) => e.stopPropagation()}
      >
        {content}
      </div>
      {showHint && (
        <button
          type="button"
          onClick={scrollMore}
          className="mt-2 flex w-full cursor-pointer items-center justify-center gap-1.5 border-0 bg-transparent py-0.5 text-[11px] text-stone-400/90 transition-colors hover:text-stone-600"
        >
          <span className="h-px w-8 bg-stone-400/25" />
          <LuChevronDown className="size-3.5 animate-bounce" strokeWidth={2} />
          <span className="h-px w-8 bg-stone-400/25" />
        </button>
      )}
    </div>
  );
}

interface WallMasonryProps {
  walls: Wall[];
}

export default ({ walls }: WallMasonryProps) => {
  const [columnCount, setColumnCount] = useState(4);

  useEffect(() => {
    const updateColumnCount = () => setColumnCount(getColumnCount(window.innerWidth));
    updateColumnCount();
    window.addEventListener('resize', updateColumnCount);
    return () => window.removeEventListener('resize', updateColumnCount);
  }, []);

  const columns = distributeToShortestColumns(walls, columnCount);
  const wallIndexMap = new Map(walls.map((wall, index) => [wall.id, index]));

  return (
    <div className="flex items-start gap-5 sm:gap-6 lg:gap-7">
      {columns.map((column, colIndex) => (
        <div key={colIndex} className="flex min-w-0 flex-1 flex-col gap-8">
          {column.map((item) => {
            const index = wallIndexMap.get(item.id) ?? 0;
            const theme = colorThemes[item.color] || defaultTheme;
            const rotate = rotations[index % rotations.length];

            return (
              <div
                key={item.id}
                className={msgCardClass}
                style={{
                  rotate: `${rotate}deg`,
                  background: theme.bg,
                  animationDelay: `${index * 90 + 300}ms`,
                }}
              >
                <div className={pushpinClass} style={{ background: theme.pushpin }} />
                <span className={`relative z-10 mb-3 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${theme.badge}`}>
                  {item.cate.name}
                </span>
                <WallCardContent content={item.content} />
                <div className="relative z-10 flex items-center justify-between gap-3 text-xs">
                  <span className="shrink-0 font-medium text-stone-600 dark:text-black">{item.name ? item.name : '匿名'}</span>
                  <span className="shrink-0 text-stone-400 dark:text-stone-600">{getRelativeTimeLabel(item.createTime)}</span>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};
