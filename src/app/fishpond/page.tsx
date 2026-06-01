'use client';

import { useState, useEffect } from 'react';
import { Rss } from '@/types/app/rss';
import { getRssListAPI } from '@/api/rss';
import Loading from '@/components/Loading';
import Empty from '@/components/Empty';
import RandomAvatar from '@/components/RandomAvatar';
import parse from 'html-react-parser';
import { HTMLParser } from '@/utils/htmlParser';
import Masonry from 'react-masonry-css';
import { dayFormat } from '@/utils';

// 引入图标
import { HiOutlineClock, HiOutlineHashtag } from 'react-icons/hi2';
import { TbRipple } from 'react-icons/tb';

// 瀑布流断点配置
const breakpointColumnsObj = {
  default: 5,
  1600: 4,
  1280: 3,
  1024: 2,
  768: 1,
};

export default function FishpondPage() {
  const [rssData, setRssData] = useState<Rss[] | null>(null);
  const [loading, setLoading] = useState(true);

  const getRssList = async () => {
    try {
      setLoading(true);
      const response = await getRssListAPI();

      if (response?.data) {
        setRssData(response.data.result);
      }
    } catch (error) {
      console.error('获取RSS数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRssList();
  }, []);

  const ContentRenderer = ({ content, mode = 'html' }: { content: string; mode?: 'html' | 'text' }) => {
    if (mode === 'text') {
      const summary = HTMLParser.getSummary(content, 150);
      return <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 text-justify line-clamp-4">{summary.text}</p>;
    }

    const cleanHTML = HTMLParser.sanitize(content, {
      allowedTags: ['p', 'br', 'strong', 'em', 'u', 'a', 'span', 'div'],
      allowedAttributes: ['href', 'target', 'rel'],
      maxLength: 150,
    });

    return <div className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 text-justify line-clamp-4 prose prose-sm dark:prose-invert max-w-none prose-a:text-blue-500 prose-a:no-underline hover:prose-a:underline">{parse(cleanHTML)}</div>;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <title>🐟 鱼塘 | Rss Feed</title>
      <meta name="description" content="汇聚好友与订阅的动态鱼塘" />

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary/6 blur-[120px]" />
        <div className="absolute top-1/4 right-0 w-96 h-96 rounded-full bg-violet-400/8 blur-[80px]" />
        <div className="absolute bottom-1/4 left-0 w-80 h-80 rounded-full bg-cyan-400/8 blur-[80px]" />
      </div>

      <div className="w-full min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-[1920px] mx-auto">
        <div className="relative mb-14 flex flex-col items-center select-none pt-6 md:pt-12">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <TbRipple className="text-4xl text-blue-500 animate-pulse" />
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">鱼 塘</h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">潜入信息的海洋，捕获最新鲜的动态</p>
          <div className="absolute -bottom-6 w-32 h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent rounded-full blur-[1px]"></div>
        </div>

        <div className="mt-24">
          {rssData && rssData.length > 0 ? (
            <Masonry breakpointCols={breakpointColumnsObj} className="flex w-auto -ml-6" columnClassName="pl-2 bg-clip-padding flex flex-col gap-2">
              {rssData.map((item, index) => {
                const authorName = item.email ? item.email.split('@')[0] : '匿名用户';

                return (
                  <article key={`${item.url}-${index}`} className="group relative bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-white/50 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 transition-[transform,box-shadow] duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.02)] hover:-translate-y-1 overflow-hidden break-inside-avoid">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-slate-100 dark:ring-slate-800 flex-shrink-0 bg-slate-50 dark:bg-slate-800">{item.image ? <img src={item.image} alt={authorName} className="w-full h-full object-cover" /> : <RandomAvatar className="w-full h-full" />}</div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{authorName}</span>
                          <div className="flex items-center text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 font-medium">
                            <HiOutlineClock className="mr-1 text-[13px]" />
                            {item.createTime ? dayFormat(item.createTime) : '近期'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-5">
                      <h3 className="text-lg font-bold leading-tight mb-3">
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-slate-900 dark:text-slate-100 no-underline group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-[color] duration-300 inline-flex items-baseline gap-1.5">
                          <span className="line-clamp-2">{item.title}</span>
                        </a>
                      </h3>

                      <div className="relative">
                        <ContentRenderer content={item.description} />
                        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-white/70 dark:from-slate-900/60 to-transparent pointer-events-none"></div>
                      </div>
                    </div>

                    <div className="flex items-center mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/80">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 text-[11px] rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-700">
                        <HiOutlineHashtag className="text-blue-500/80" />
                        {item.type || '未分类'}
                      </span>
                    </div>
                  </article>
                );
              })}
            </Masonry>
          ) : (
            <div className="py-20 flex justify-center items-center">
              <Empty info="鱼塘里暂时没有鱼儿游过~" />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
