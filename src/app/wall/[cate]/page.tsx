'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ZCOOL_KuaiLe } from 'next/font/google';
import AddWallInfo from '../components/AddWallInfo';
import WallMasonry from '../components/WallMasonry';
import Loading from '@/components/Loading';
import { getCateListAPI, getCateWallListAPI } from '@/api/wall';
import { Cate, Wall } from '@/types/app/wall';
import '../wall.css';

const zcoolKuaiLe = ZCOOL_KuaiLe({ weight: '400', subsets: ['latin'] });

const floatDots = [
  { size: 'w-2 h-2', color: 'bg-rose-400/70', delay: '0s' },
  { size: 'w-1.5 h-1.5', color: 'bg-amber-400/70', delay: '0.5s' },
  { size: 'w-2.5 h-2.5', color: 'bg-violet-400/70', delay: '1s' },
  { size: 'w-1.5 h-1.5', color: 'bg-cyan-400/70', delay: '1.5s' },
  { size: 'w-2 h-2', color: 'bg-emerald-400/70', delay: '2s' },
];

export default () => {
  const params = useParams();
  const cate = params?.cate as string;

  const [cateList, setCateList] = useState<Cate[]>([]);
  const [walls, setWalls] = useState<Wall[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCateList = async () => {
      const { data } = await getCateListAPI();
      const sorted = [...data].sort((a, b) => a.order - b.order);
      setCateList(sorted);
    };
    fetchCateList();
  }, []);

  const getWallList = useCallback(async () => {
    const id = cateList.find((item) => item.mark === cate)?.id ?? 0;
    if (!id) return;

    setLoading(true);
    try {
      const { data } = await getCateWallListAPI(id);
      setWalls(data?.result ?? []);
    } catch (error) {
      console.error('获取留言列表失败:', error);
      setWalls([]);
    } finally {
      setLoading(false);
    }
  }, [cate, cateList]);

  useEffect(() => {
    if (cateList.length > 0 && cate) {
      getWallList();
    }
  }, [cate, cateList, getWallList]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gray-50 text-gray-900 antialiased dark:bg-[#0f172a] dark:text-white">
      <title>💌 留言墙</title>
      <meta name="description" content="💌 留言墙" />

      {/* 网格背景 */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-size-[64px_64px]" />
      </div>

      {/* 头部 */}
      <header className="relative z-10 pt-20 pb-4 mt-10 text-center">
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
            留言墙
          </span>
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 text-base sm:text-lg tracking-[0.2em] font-light">想对我说些什么？来吧</p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <div className="w-20 h-px bg-linear-to-r from-transparent to-neutral-300 dark:to-neutral-700" />
          <div className="w-2 h-2 rounded-full bg-amber-400/80 shadow-lg shadow-amber-400/20" />
          <div className="w-20 h-px bg-linear-to-l from-transparent to-neutral-300 dark:to-neutral-700" />
        </div>
      </header>

      {/* 分类标签 */}
      <div className="relative z-10 flex flex-wrap justify-center gap-2 md:gap-3 px-4 mb-8">
        {cateList?.map((item) => (
          <Link
            key={item.id}
            href={`/wall/${item.mark}`}
            className={`
              relative px-5 py-2.5 text-sm font-medium rounded-full
              transition-[scale] duration-300 ease-out cursor-pointer
              ${item.mark === cate ? 'text-white bg-primary scale-105' : 'text-gray-700 dark:text-gray-300 bg-white/80 dark:bg-gray-700/80 backdrop-blur-xs border dark:border-gray-700/50 hover:text-primary hover:scale-105'}
            `}
          >
            {item.name}
          </Link>
        ))}
      </div>

      {/* 留言卡片瀑布流 */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 pb-24">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loading />
          </div>
        ) : walls.length > 0 ? (
          <div className="py-6">
            <WallMasonry walls={walls} />
          </div>
        ) : (
          <div className="text-center py-12 text-neutral-500 dark:text-neutral-400">暂无留言</div>
        )}
      </main>

      <AddWallInfo />

      <footer className="relative z-10 text-center pb-16 pt-4">
        <p className="text-neutral-400 dark:text-neutral-600 text-sm tracking-[0.3em] font-light">— 每一条留言，都是一颗发光的心 —</p>
      </footer>
    </div>
  );
};
