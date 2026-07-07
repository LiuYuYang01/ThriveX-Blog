'use client';

import Masonry from 'react-masonry-css';
import { Wall } from '@/types/app/wall';
import { getRelativeTimeLabel } from '@/utils';
import '@/components/ArticleLayout/Waterfall/index.scss';

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

const breakpointColumnsObj = {
  default: 4,
  1024: 3,
  768: 2,
  640: 1,
};

const msgCardClass =
  'wall-paper-texture relative mb-14 cursor-default rounded-2xl p-6 ' +
  'shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.18)] ' +
  'transition-[rotate,scale,translate,box-shadow,opacity] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ' +
  'animate-[wall-card-enter_0.65s_ease_forwards] ' +
  'hover:rotate-0! hover:scale-[1.07] hover:-translate-y-2.5 hover:z-30 ' +
  'hover:shadow-[0_10px_24px_-6px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_10px_24px_-6px_rgba(0,0,0,0.28)]';

const pushpinClass =
  'absolute -top-2 left-1/2 z-[5] size-4 -translate-x-1/2 rounded-full ' +
  'shadow-[0_2px_6px_rgba(0,0,0,0.35),inset_0_-3px_6px_rgba(0,0,0,0.15),inset_0_3px_6px_rgba(255,255,255,0.4)] ' +
  "after:absolute after:top-[3px] after:left-1 after:size-[5px] after:rounded-full after:bg-white/45 after:content-['']";

interface WallMasonryProps {
  walls: Wall[];
}

export default ({ walls }: WallMasonryProps) => {
  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="masonry-grid -ml-5 sm:ml-[-15px] md:-ml-5 lg:-ml-6"
      columnClassName="masonry-grid_column pl-3"
    >
      {walls.map((item, index) => {
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
            <span className={`mb-3 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${theme.badge}`}>{item.cate.name}</span>
            <p className="hide_sliding mb-5 min-h-16 overflow-auto text-sm leading-relaxed text-stone-800">{item.content}</p>
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-stone-600 dark:text-black">{item.name ? item.name : '匿名'}</span>
              <span className="text-stone-400 dark:text-stone-600">{getRelativeTimeLabel(item.createTime)}</span>
            </div>
          </div>
        );
      })}
    </Masonry>
  );
};
