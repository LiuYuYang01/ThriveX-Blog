'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getRandomArticleListAPI } from '@/api/article';
import { useAppConfig } from '@/components/AppConfigProvider';
import { Article } from '@/types/app/article';
import { getRandomImage } from '@/utils';
import RandomArticleSvg from '@/assets/svg/other/article.svg';

const RandomArticle = () => {
  const { theme } = useAppConfig();

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
          className="scroll-smooth scrollbar-thin [scrollbar-color:rgb(148_163_184/0.4)_transparent]
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
                  className="group block w-[260px] shrink-0 overflow-hidden rounded-xl no-underline text-inherit shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_12px_28px_-6px_rgba(83,157,253,0.22)] dark:shadow-none dark:hover:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.45)]"
                >
                  <div
                    className="relative w-full h-40 bg-cover bg-center bg-no-repeat"
                    style={coverUrl ? { backgroundImage: `url(${coverUrl})` } : undefined}
                  >
                    {!coverUrl && <div className="absolute inset-0 bg-slate-400/50 dark:bg-slate-600/50" />}
                    <div
                      className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent pointer-events-none"
                      aria-hidden
                    />
                    <h4 className="absolute bottom-3 left-3 right-3 z-2 m-0 line-clamp-2 overflow-hidden text-[0.9375rem] font-semibold leading-snug text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">
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
