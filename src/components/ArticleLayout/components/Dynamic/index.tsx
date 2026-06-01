'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { HiOutlineSpeakerphone } from 'react-icons/hi';
import { FiChevronRight } from 'react-icons/fi';
import { getRecordListAPI } from '@/api/record';
import { Record } from '@/types/app/record';
import { extractText } from '@/utils';

export default function Dynamic({ className = '' }: { className?: string }) {
  const [list, setList] = useState<Record[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 使用 useRef 管理定时器，防止组件卸载时内存泄漏
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fadeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const getRecordList = async () => {
    try {
      const { data } = await getRecordListAPI({ pageNum: 1, pageSize: 8 });
      setList(data?.result ?? []);
    } catch (error) {
      console.error('获取说说失败：', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getRecordList();
  }, []);

  useEffect(() => {
    if (list.length <= 1) return;

    timerRef.current = setInterval(() => {
      setIsFading(true);

      fadeTimerRef.current = setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % list.length);
        setIsFading(false);
      }, 400);
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    };
  }, [list.length]);

  if (isLoading) {
    return (
      <div className={`flex items-center w-full px-4 py-3.5 mb-2 bg-slate-50 dark:bg-[#1a1a1a] rounded-xl border border-transparent ${className}`}>
        <div className="h-5 w-24 bg-slate-200 dark:bg-zinc-800 rounded animate-pulse mr-4" />
        <div className="h-5 flex-1 bg-slate-200 dark:bg-zinc-800 rounded animate-pulse" />
      </div>
    );
  }

  if (list.length === 0) return null;

  const currentContent = extractText(list[currentIndex]?.content || '');

  return (
    <div
      className={`
        group flex flex-row items-center justify-between w-full px-4 py-3 mb-2 
        bg-slate-50 dark:bg-black-b
        border dark:border-zinc-800/80
        rounded-xl hover:shadow-sm
        ${className}
      `}
    >
      <div className="flex items-center flex-shrink-0 mr-3 lg:mr-5">
        <span className="relative flex h-2 w-2 mr-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
        </span>

        <HiOutlineSpeakerphone className="text-blue-500 dark:text-blue-400 text-lg mr-1.5" />
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">最新动态</span>

        <div className="hidden sm:block w-px h-3.5 bg-slate-300 dark:bg-zinc-700 mx-3"></div>
      </div>

      <Link href="/record" className="flex-1 flex items-center justify-between overflow-hidden cursor-pointer" title={currentContent}>
        <div className="relative flex-1 h-[20px] overflow-hidden">
          <span
            className={`
              absolute left-0 top-0 w-full line-clamp-1 text-sm text-slate-600 dark:text-slate-400
              group-hover:text-blue-600 dark:group-hover:text-blue-400
              transition-opacity duration-300 ease-in-out
              ${isFading ? 'opacity-0' : 'opacity-100'}
            `}
          >
            {currentContent}
          </span>
        </div>

        <FiChevronRight className="flex-shrink-0 text-slate-400 group-hover:text-blue-500 ml-2 group-hover:translate-x-0.5 duration-200" />
      </Link>
    </div>
  );
}
