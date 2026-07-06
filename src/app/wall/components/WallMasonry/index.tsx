'use client';

import Masonry from 'react-masonry-css';
import dayjs from 'dayjs';
import { Wall } from '@/types/app/wall';
import '@/components/ArticleLayout/Waterfall/index.scss';
import './index.scss';

// 颜色映射表，将颜色值映射到对应的 Tailwind 类名
const colorMap: Record<string, string> = {
  '#fcafa24d': 'bg-[#fcafa24d]',
  '#a8ed8a4d': 'bg-[#a8ed8a4d]',
  '#caa7f74d': 'bg-[#caa7f74d]',
  '#ffe3944d': 'bg-[#ffe3944d]',
  '#92e6f54d': 'bg-[#92e6f54d]',
};

// 瀑布流断点配置
const breakpointColumnsObj = {
  default: 4,
  1024: 3,
  768: 2,
  640: 1,
};

interface WallMasonryProps {
  walls: Wall[];
}

export default ({ walls }: WallMasonryProps) => {
  return (
    <Masonry breakpointCols={breakpointColumnsObj} className="masonry-grid wall-masonry-grid" columnClassName="masonry-grid_column">
      {walls.map((item, index) => {
        const bgColor = colorMap[item.color] || 'bg-[#ffe3944d]';
        return (
          <div
            key={item.id}
            className={`
              group relative flex flex-col p-5 rounded-2xl
              ${bgColor}
              backdrop-blur-sm
              border border-white/30 dark:border-gray-700/30
              cursor-pointer overflow-hidden mb-3 animate-fade-in-up
              hover:scale-105 hover:-translate-y-1 transition-transform
              transform-gpu
            `}
            style={{
              animationDelay: `${index * 50}ms`,
            }}
          >
            {/* 卡片装饰边框 */}
            <div className="absolute inset-0 rounded-2xl border-2 border-white/20 dark:border-gray-600/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>

            {/* 顶部信息 */}
            <div className="flex justify-between items-center mb-3 pb-3 border-b border-white/20 dark:border-gray-700/30">
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">{dayjs(+item.createTime!).format('YYYY-MM-DD HH:mm')}</span>
              <span className="px-2.5 py-1 text-xs font-semibold backdrop-blur-sm text-gray-700 dark:text-white bg-white/60 dark:bg-gray-800/60 rounded-full transition-transform group-hover:scale-105">{item.cate.name}</span>
            </div>

            {/* 留言内容 */}
            <div className="flex-1 hide_sliding overflow-auto min-h-20 text-sm md:text-base leading-relaxed text-gray-800 dark:text-gray-200 my-3 px-1">{item.content}</div>

            {/* 底部署名 */}
            <div className="flex justify-end items-center mt-4 pt-3 border-t border-white/20 dark:border-gray-700/30">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">—</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-transform group-hover:translate-x-[-2px]">{item.name ? item.name : '匿名'}</span>
              </div>
            </div>

            {/* Hover 时的光效 */}
            <div className="absolute inset-0 bg-linear-to-br from-white/0 via-white/0 to-white/20 dark:from-transparent dark:via-transparent dark:to-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          </div>
        );
      })}
    </Masonry>
  );
};
