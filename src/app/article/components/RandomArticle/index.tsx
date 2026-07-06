'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getRandomArticleListAPI } from '@/api/article';
import { useConfigStore } from '@/stores';
import { Article } from '@/types/app/article';
import { getRandomImage } from '@/utils';
import RandomArticleSvg from '@/assets/svg/other/article.svg';

const RandomArticle = () => {
  const { theme } = useConfigStore();

  const [list, setList] = useState<Article[]>([]);

  const getRandomArticleList = async () => {
    const { data } = await getRandomArticleListAPI();
    setList(data ?? []);
  };

  useEffect(() => {
    getRandomArticleList();
  }, []);

  if (!list.length) return null;

  return (
    <section className="mt-8">
      <div className="flex items-center gap-2 mb-3">
        <Image src={RandomArticleSvg} alt="随机推荐" width={24} height={24} />
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">随机推荐</h3>
        <p className="ml-auto text-[0.8125rem] text-slate-500 dark:text-slate-400">发现更多精彩内容</p>
      </div>

      <div className="overflow-x-auto py-4">
        <div
          className="scroll-smooth [scrollbar-width:thin] [scrollbar-color:rgb(148_163_184/0.4)_transparent]
          [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb]:bg-slate-400/40 
          [&::-webkit-scrollbar-thumb:hover]:bg-slate-400/60"
        >
          <div className="flex gap-4 pb-1 min-w-min">
            {list.map((item) => {
              const coverUrl = getRandomImage(item.cover, theme.covers);
              return (
                <Link
                  key={item.id}
                  href={`/article/${item.id}`}
                  target="_blank"
                  className="group flex-shrink-0 w-[260px] block no-underline text-inherit 
                  hover:shadow-lg dark:hover:shadow-[0_12px_24px_-8px_rgba(0,0,0,0.4)] transition-[transform,box-shadow,border-color] duration-200 ease-out overflow-hidden rounded-xl hover:-translate-y-1"
                >
                  <div
                    className="relative w-full h-40 bg-cover bg-center bg-no-repeat"
                    style={coverUrl ? { backgroundImage: `url(${coverUrl})` } : undefined}
                  >
                    {coverUrl ? (
                      <Image
                        src={coverUrl}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-slate-400/50 dark:bg-slate-600/50" />
                    )}
                    <div
                      className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent pointer-events-none"
                      aria-hidden
                    />
                    <h4 className="absolute bottom-3 left-3 right-3 text-[0.9375rem] font-semibold text-white m-0 line-clamp-2 overflow-hidden leading-snug [text-shadow:0_1px_2px_rgba(0,0,0,0.5)] z-[2] group-hover:text-primary transition-colors">
                      {item.title}
                    </h4>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RandomArticle;
