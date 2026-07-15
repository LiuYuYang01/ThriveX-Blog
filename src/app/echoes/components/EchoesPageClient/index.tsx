'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import Masonry from 'react-masonry-css';
import { HiOutlineArrowTopRightOnSquare, HiOutlineClock } from 'react-icons/hi2';
import { IoMdArrowDown } from 'react-icons/io';

import { getCommentListAPI } from '@/api/comment';
import Empty from '@/components/Empty';
import PageHeroHeader, { PageHeroGrid } from '@/components/PageHeroHeader';
import RandomAvatar from '@/components/RandomAvatar';
import { Comment } from '@/types/app/comment';
import { dayFormat } from '@/utils';

const breakpointColumnsObj = {
  default: 4,
  1600: 3,
  1024: 2,
  768: 1,
};

interface EchoesPageClientProps {
  initialList: Comment[];
  initialTotal: number;
  initialPages: number;
  pageSize: number;
}

const toneStyles = [
  'from-[#fff6ec] via-[#fffdfa] to-white dark:from-[#2b2118] dark:via-[#1d1920] dark:to-[#17171b]',
  'from-[#edf7ff] via-[#fbfdff] to-white dark:from-[#1b2430] dark:via-[#171a24] dark:to-[#17171b]',
  'from-[#f3efff] via-[#fdfcff] to-white dark:from-[#251d31] dark:via-[#1b1824] dark:to-[#17171b]',
  'from-[#eefbf4] via-[#fcfffd] to-white dark:from-[#1a2a23] dark:via-[#171d1a] dark:to-[#17171b]',
];

export default function EchoesPageClient({
  initialList,
  initialTotal,
  initialPages,
  pageSize,
}: EchoesPageClientProps) {
  const [list, setList] = useState(initialList);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialPages > 1);
  const pageRef = useRef(1);

  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const nextPage = pageRef.current + 1;
      const { data } = await getCommentListAPI({ pageNum: nextPage, pageSize });
      const nextList = data?.result ?? [];

      if (nextList.length) {
        setList((prev) => [...prev, ...nextList]);
        setTotal(data.total ?? total);
        pageRef.current = nextPage;
        setHasMore(nextPage < (data.pages ?? 1));
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('加载评论失败:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fbfbfd] px-4 pb-16 sm:px-6 lg:px-8 dark:bg-[#111318]">
      <PageHeroGrid />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_top_left,rgba(120,119,198,0.16),transparent_34%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.14),transparent_28%),radial-gradient(circle_at_50%_38%,rgba(251,191,36,0.12),transparent_30%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(120,119,198,0.18),transparent_34%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.14),transparent_28%),radial-gradient(circle_at_50%_38%,rgba(16,185,129,0.12),transparent_30%)]" />

      <div className="relative mx-auto flex w-full max-w-[1600px] flex-col gap-8">
        <PageHeroHeader title="一些互动" subtitle="" className="mb-0" />

        <div className="relative z-10">
          {list.length > 0 ? (
            <>
              <Masonry
                breakpointCols={breakpointColumnsObj}
                className="-ml-5 flex w-auto"
                columnClassName="flex flex-col gap-5 bg-clip-padding pl-5"
              >
                {list.map((item, index) => (
                  <article
                    key={item.id}
                    className={`group relative overflow-hidden rounded-[24px] border border-white/70 bg-linear-to-br ${toneStyles[index % toneStyles.length]} p-5 shadow-[0_18px_48px_rgba(15,23,42,0.08)] sm:p-6 dark:border-white/8 dark:shadow-[0_22px_52px_rgba(0,0,0,0.24)]`}
                  >
                    <div className="absolute right-0 top-0 h-24 w-24 bg-[radial-gradient(circle,rgba(255,255,255,0.9),transparent_68%)] opacity-70 dark:bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent_68%)]" />

                    <div className="relative flex flex-col gap-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="h-11 w-11 shrink-0 overflow-hidden rounded-2xl border border-white/70 bg-white/80 dark:border-white/8 dark:bg-white/8">
                            {item.avatar ? (
                              <img src={item.avatar} alt={item.name} className="h-full w-full object-cover" />
                            ) : (
                              <RandomAvatar seed={String(item.id ?? item.name)} className="h-full w-full" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="line-clamp-1 text-sm font-semibold text-[#111827] dark:text-white">
                              {item.name || '匿名用户'}
                            </div>
                            <div className="mt-1 flex items-center text-[11px] text-[#7c8798] dark:text-slate-500">
                              <HiOutlineClock className="mr-1 shrink-0 text-xs" />
                              {item.createTime ? dayFormat(item.createTime) : '近期'}
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-[14px] leading-7 text-[#344054] whitespace-pre-wrap wrap-break-word dark:text-slate-300">
                        {item.content}
                      </p>

                      {item.articleId ? (
                        <div className="flex justify-end border-t border-black/6 pt-4 dark:border-white/6">
                          <Link
                            href={`/article/${item.articleId}`}
                            target="_blank"
                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-black/4 px-3 py-1.5 text-[12px] font-medium text-[#111827] hover:bg-black/6 hover:text-primary dark:bg-white/6 dark:text-white dark:hover:bg-white/10"
                          >
                            <span>查看原文</span>
                            <HiOutlineArrowTopRightOnSquare className="h-3.5 w-3.5 shrink-0" />
                          </Link>
                        </div>
                      ) : null}
                    </div>
                  </article>
                ))}
              </Masonry>

              {hasMore ? (
                <div className="mt-14 flex justify-center">
                  <button
                    type="button"
                    onClick={loadMore}
                    disabled={loading}
                    className="group inline-flex cursor-pointer items-center rounded-full p-1.5 backdrop-blur-sm transition-transform duration-200 hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span className="inline-flex items-center gap-3 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-[transform,filter] duration-200 group-hover:scale-[1.01] group-hover:brightness-110 dark:bg-white dark:text-[#111827] dark:group-hover:brightness-95">
                      <span>{loading ? '加载中...' : '查看更多'}</span>
                      {!loading && (
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/14 transition-transform duration-200 group-hover:scale-110 dark:bg-[#111827]/10">
                          <IoMdArrowDown className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                        </span>
                      )}
                    </span>
                  </button>
                </div>
              ) : (
                <p className="mt-14 text-center text-sm text-[#8a94a3] dark:text-slate-500">所有回响都已经展开</p>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center py-20">
              <Empty info="还没有回响飘过来~" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
