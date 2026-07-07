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
import { HiOutlineClock, HiOutlineHashtag, HiOutlineArrowTopRightOnSquare } from 'react-icons/hi2';
import PageHeroHeader, { PageHeroGrid } from '@/components/PageHeroHeader';

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
      return <p className="text-[13px] leading-relaxed text-[#788190] dark:text-slate-400 text-justify line-clamp-4">{summary.text}</p>;
    }

    const cleanHTML = HTMLParser.sanitize(content, {
      allowedTags: ['p', 'br', 'strong', 'em', 'u', 'a', 'span', 'div'],
      allowedAttributes: ['href', 'target', 'rel'],
      maxLength: 150,
    });

    return <div className="text-[13px] leading-relaxed text-[#788190] dark:text-slate-400 text-justify line-clamp-4 prose prose-sm dark:prose-invert max-w-none prose-a:text-primary prose-a:no-underline">{parse(cleanHTML)}</div>;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(110deg,#fbfbfc_0%,#f7f8fa_58%,#fbfbfc_100%)] dark:bg-[linear-gradient(to_right,#232931_0%,#232931_100%)]">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <title>🐟 鱼塘 | Rss Feed</title>
      <meta name="description" content="汇聚好友与订阅的动态鱼塘" />

      <div className="relative min-h-screen bg-[linear-gradient(110deg,#fbfbfc_0%,#f7f8fa_58%,#fbfbfc_100%)] dark:bg-[linear-gradient(to_right,#232931_0%,#232931_100%)] pb-12 px-4 sm:px-6 lg:px-8">
        <PageHeroGrid />

        <div className="relative w-full max-w-[1920px] mx-auto">
          <PageHeroHeader title="鱼塘" subtitle="潜入信息的海洋，捕获最新鲜的动态" className="mb-8" />

          <div className="relative z-10">
          {rssData && rssData.length > 0 ? (
            <Masonry breakpointCols={breakpointColumnsObj} className="flex w-auto -ml-5" columnClassName="pl-5 bg-clip-padding flex flex-col gap-5">
              {rssData.map((item, index) => {
                const authorName = item.email ? item.email.split('@')[0] : '匿名用户';

                return (
                  <article key={`${item.url}-${index}`} className="group relative flex flex-col cursor-pointer rounded-xl border border-[#edf0f4] bg-white/85 px-5 py-5 shadow-[0_18px_55px_rgba(33,42,58,0.08)] dark:border-white/10 dark:bg-black-b dark:shadow-none sm:px-6 sm:py-6 overflow-hidden break-inside-avoid transition-[translate,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_22px_65px_rgba(33,42,58,0.14)] dark:hover:border-primary/20 dark:hover:shadow-[0_22px_65px_rgba(0,0,0,0.35)]">
                    <div className="flex items-center gap-3 pb-4 mb-4 border-b border-[#edf0f4] dark:border-white/5">
                      <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-[#f7f8fa] dark:bg-white/5">{item.image ? <img src={item.image} alt={authorName} className="w-full h-full object-cover" /> : <RandomAvatar className="w-full h-full" />}</div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-semibold text-[#161a22] dark:text-slate-100 line-clamp-1">{authorName}</span>
                        <div className="flex items-center text-[11px] text-[#8a94a3] dark:text-slate-500 mt-0.5">
                          <HiOutlineClock className="mr-1 text-xs shrink-0" />
                          {item.createTime ? dayFormat(item.createTime) : '近期'}
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 mb-4">
                      <h3 className="text-base sm:text-[17px] font-bold leading-snug mb-2.5">
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-[#161a22] dark:text-slate-100 no-underline inline-flex items-start gap-1.5 group-hover:text-primary">
                          <span className="line-clamp-2">{item.title}</span>
                          <HiOutlineArrowTopRightOnSquare className="w-3.5 h-3.5 mt-1 shrink-0 opacity-40 transition-opacity duration-300 ease-out group-hover:opacity-100" />
                        </a>
                      </h3>

                      <div className="relative">
                        <ContentRenderer content={item.description} />
                        <div className="absolute bottom-0 left-0 w-full h-10 bg-linear-to-t from-white/85 dark:from-black-b to-transparent pointer-events-none" />
                      </div>
                    </div>

                    <div className="flex items-center pt-3 border-t border-[#edf0f4] dark:border-white/5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#f7f8fa] text-[#788190] text-[11px] rounded-full font-medium dark:bg-white/5 dark:text-slate-400">
                        <HiOutlineHashtag className="text-xs" />
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
      </div>
    </>
  );
}
