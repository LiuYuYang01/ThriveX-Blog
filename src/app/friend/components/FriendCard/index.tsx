'use client';

import Link from 'next/link';
import { Web } from '@/types/app/web';
import OptimizedImage from '@/components/OptimizedImage';
import MagneticCard from '../MagneticCard';
import ScrollReveal from '../ScrollReveal';

const DEFAULT_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Ccircle fill='%23e5e7eb' cx='32' cy='32' r='32'/%3E%3Cpath fill='%239ca3af' d='M32 32a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm0 8c-8 0-16 4-16 12v4h32v-4c0-8-8-12-16-12z'/%3E%3C/svg%3E";

export default function FriendCard({ item, type, index }: { item: Web; type: string; index: number }) {
  const isPinned = type === '全站置顶';

  return (
    <ScrollReveal delay={index * 80}>
      <Link href={item.url} target="_blank" className="group block h-full">
        <MagneticCard className="h-full">
          <div
            className={`h-full relative overflow-hidden rounded-2xl border transition-[transform,shadow] duration-300 ease-out group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-primary/10 ${
              isPinned
                ? 'bg-primary/5 dark:bg-primary/10 border-primary/20 dark:border-primary/30'
                : 'bg-white/80 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/30'
            }`}
          >
            <div className="absolute inset-0 bg-linear-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out" />

            {isPinned && (
              <div className="absolute top-3 right-3 px-2.5 py-1 bg-primary text-[10px] font-bold text-white rounded-full shadow-lg shadow-primary/30">
                PINNED
              </div>
            )}

            <div className="relative p-5 flex items-center gap-4">
              <div className="relative shrink-0">
                <div className="absolute inset-0 rounded-full bg-primary opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-500 ease-out" />
                <OptimizedImage
                  src={item.image}
                  alt={item.title}
                  width={56}
                  height={56}
                  className="relative w-14 h-14 rounded-full object-cover bg-gray-100 dark:bg-gray-800 border-2 border-white dark:border-gray-700 shadow-md transition-[scale,rotate] duration-500 group-hover:scale-110 group-hover:rotate-3"
                  onError={(e) => {
                    const el = e.target as HTMLImageElement;
                    if (el.src !== DEFAULT_AVATAR) el.src = DEFAULT_AVATAR;
                  }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary truncate">
                  {item.title}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                  {item.description || '暂无介绍...'}
                </p>
              </div>

              <div className="shrink-0 opacity-0 transition-[opacity,translate] duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </div>
        </MagneticCard>
      </Link>
    </ScrollReveal>
  );
}
