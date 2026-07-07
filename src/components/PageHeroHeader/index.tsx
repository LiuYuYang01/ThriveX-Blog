'use client';

import { ZCOOL_KuaiLe } from 'next/font/google';
import './hero.css';

const zcoolKuaiLe = ZCOOL_KuaiLe({ weight: '400', subsets: ['latin'] });

const floatDots = [
  { size: 'w-2 h-2', color: 'bg-rose-400/70', delay: '0s' },
  { size: 'w-1.5 h-1.5', color: 'bg-amber-400/70', delay: '0.5s' },
  { size: 'w-2.5 h-2.5', color: 'bg-violet-400/70', delay: '1s' },
  { size: 'w-1.5 h-1.5', color: 'bg-cyan-400/70', delay: '1.5s' },
  { size: 'w-2 h-2', color: 'bg-emerald-400/70', delay: '2s' },
];

interface PageHeroHeaderProps {
  title: string;
  subtitle: string;
  className?: string;
}

export function PageHeroGrid() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-size-[64px_64px]" />
    </div>
  );
}

export default function PageHeroHeader({ title, subtitle, className = '' }: PageHeroHeaderProps) {
  return (
    <header className={`relative z-10 pt-20 pb-4 mt-10 text-center select-none ${className}`}>
      <div className="flex justify-center gap-3 mb-6">
        {floatDots.map((dot, i) => (
          <span
            key={i}
            className={`animate-[wall-float-dot_3s_ease-in-out_infinite] rounded-full ${dot.size} ${dot.color}`}
            style={{ animationDelay: dot.delay }}
          />
        ))}
      </div>

      <h1 className={`text-6xl sm:text-7xl font-bold tracking-tight mb-5 ${zcoolKuaiLe.className}`}>
        <span className="bg-size-[200%_auto] bg-linear-to-r from-amber-500 via-rose-500 to-violet-500 bg-clip-text text-transparent animate-[wall-shimmer_5s_ease_infinite] dark:from-amber-300 dark:via-rose-300 dark:to-violet-400">
          {title}
        </span>
      </h1>
      <p className="text-neutral-500 dark:text-neutral-400 text-base sm:text-lg tracking-[0.2em] font-light">{subtitle}</p>

      <div className="mt-8 flex items-center justify-center gap-3">
        <div className="w-20 h-px bg-linear-to-r from-transparent to-neutral-300 dark:to-neutral-700" />
        <div className="w-2 h-2 rounded-full bg-amber-400/80 shadow-lg shadow-amber-400/20" />
        <div className="w-20 h-px bg-linear-to-l from-transparent to-neutral-300 dark:to-neutral-700" />
      </div>
    </header>
  );
}
