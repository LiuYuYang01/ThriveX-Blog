'use client';

import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import CoverImage from '@/components/CoverImage';

export interface RecordSlide {
  id: number;
  text: string;
  image: string;
  timeLabel?: string;
  mood?: string;
}

interface Props {
  list: RecordSlide[];
}

const INTERVAL = 4000;
const FADE_MS = 280;

export default function RecordCarouselClient({ list }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const router = useRouter();
  const pausedRef = useRef(false);
  const indexRef = useRef(0);
  const fadeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (list.length <= 1) return;

    const timer = window.setInterval(() => {
      if (pausedRef.current) return;

      setVisible(false);

      if (fadeTimerRef.current) window.clearTimeout(fadeTimerRef.current);
      fadeTimerRef.current = window.setTimeout(() => {
        const next = (indexRef.current + 1) % list.length;
        indexRef.current = next;
        setCurrentIndex(next);
        setVisible(true);
      }, FADE_MS);
    }, INTERVAL);

    return () => {
      window.clearInterval(timer);
      if (fadeTimerRef.current) window.clearTimeout(fadeTimerRef.current);
    };
  }, [list.length]);

  if (!list.length) return null;

  const current = list[currentIndex] ?? list[0];

  const jumpTo = (index: number, e?: MouseEvent) => {
    e?.stopPropagation();
    if (fadeTimerRef.current) window.clearTimeout(fadeTimerRef.current);
    indexRef.current = index;
    setCurrentIndex(index);
    setVisible(true);
  };

  return (
    <div
      className="mb-3"
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
    >
      <div className="group relative h-[172px] overflow-hidden rounded-xl shadow-[0_8px_24px_-12px_rgba(15,23,42,0.35)] ring-1 ring-black/5 dark:ring-white/10">
        <button
          type="button"
          onClick={() => router.push(`/record?id=${current.id}`)}
          className="absolute inset-0 z-0 cursor-pointer border-0 bg-transparent p-0"
          aria-label="打开闪念"
          title={current.text}
        >
          <div
            className={`absolute inset-0 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
          >
            <CoverImage
              key={current.id}
              src={current.image}
              alt={current.text}
              containerClassName="absolute inset-0 transition-[scale] duration-300 ease-out scale-100 group-hover:scale-[1.04]"
              className="object-cover"
              sizes="320px"
            />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.42)_0%,transparent_36%,rgba(15,23,42,0.12)_52%,rgba(15,23,42,0.84)_100%)]" />
        </button>

        {(current.mood || current.timeLabel) && (
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-end p-2.5">
            <span
              className={`max-w-[70%] truncate rounded-full bg-black/35 px-2 py-1 text-[11px] text-white/90 backdrop-blur-sm transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'
                }`}
            >
              {[current.mood, current.timeLabel].filter(Boolean).join(' · ')}
            </span>
          </div>
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-2.5 pb-2 pt-10">
          <p
            className={`line-clamp-2 text-[13px] leading-5 text-white drop-shadow-sm transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'
              }`}
          >
            {current.text}
          </p>

          <div className="relative mt-1.5 flex items-center gap-3">
            {list.length > 1 ? (
              <div className="pointer-events-auto flex h-1 flex-1 items-center gap-1">
                {list.map((item, index) => (
                  <button
                    key={item.id ?? index}
                    type="button"
                    aria-label={`切换到第 ${index + 1} 条闪念`}
                    onClick={(e) => jumpTo(index, e)}
                    className={`h-1 min-h-0 flex-1 rounded-full cursor-pointer border-0 p-0 ${index === currentIndex ? 'bg-white' : 'bg-white/35 hover:bg-white/55'
                      }`}
                  />
                ))}
              </div>
            ) : (
              <span className="flex-1" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
