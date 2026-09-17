import Image from 'next/image';
import Link from 'next/link';
import dayjs from 'dayjs';
import { LuCalendar, LuClock3, LuEye, LuMessageCircle } from 'react-icons/lu';

import Ripple from '@/components/Ripple';
import Starry from '@/components/Starry';
import { ArticleLikeHero } from '../Like';
import { getArticleReadingMinutes, getArticleWordCount } from '@/utils/article';
import type { Article } from '@/types/app/article';

interface Props {
  article: Article;
  cover: string;
}

// 杂志编辑风文章头图
export default ({ article, cover }: Props) => {
  const cate = article.cateList?.[0];
  const tags = article.tagList ?? [];
  const wordCount = getArticleWordCount(article.content || article.description);
  const readingMinutes = getArticleReadingMinutes(wordCount);
  const createTime = dayjs(+(article.createTime || 0));

  return (
    <header id="article-hero" className="relative overflow-hidden bg-background">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden opacity-70 dark:opacity-90">
        <Starry />
      </div>

      {/* 渐变遮罩：底部与左侧融入页面背景 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-[#0d0f1a]/75 via-[#1a1830]/30 via-40% to-background dark:from-[#08090f]/80 dark:via-[#12101f]/35 dark:to-background"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-linear-to-r from-background/90 via-background/55 via-35% to-transparent lg:from-background/95 lg:via-background/70 lg:via-45%"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[32%] bg-linear-to-t from-background via-background/85 to-transparent"
      />

      {/* 主题色氛围光 */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-1/2 size-[520px] -translate-y-1/2 rounded-full bg-primary/[0.07] blur-3xl dark:bg-primary/10"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 hidden h-full w-1/2 bg-linear-to-l from-primary/5 via-primary/2 to-transparent lg:block dark:from-primary/8 dark:via-primary/3"
      />

      {/* 标题首字大水印 */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-16 left-[8%] hidden select-none font-bold leading-none text-primary/4.5 dark:text-primary/[0.07] lg:block"
        style={{ fontSize: 'clamp(10rem, 18vw, 16rem)' }}
      >
        {article.title?.charAt(0)}
      </div>

      <div className="relative grid lg:grid-cols-2 lg:min-h-[min(54vh,500px)]">
        <div className="relative z-10 flex flex-col justify-center px-4 pb-8 pt-28 sm:px-6 lg:px-10 lg:py-20 xl:px-14">
          <div className="mb-5 flex flex-wrap items-center gap-2">
            {cate ? (
              <Link
                href={`/cate/${cate.id}`}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/60 bg-white/35 px-3 py-1.5 text-[12px] font-medium text-neutral-800 shadow-[0_2px_16px_-4px_rgba(83,157,253,0.15)] backdrop-blur-lg transition-colors hover:bg-white/50 dark:border-white/15 dark:bg-white/10 dark:text-white/90 dark:shadow-none dark:hover:bg-white/15"
              >
                {cate.name}
              </Link>
            ) : null}
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag.id ?? tag.name}
                className="inline-flex items-center gap-1 rounded-full border border-white/60 bg-white/35 px-3 py-1.5 text-[12px] font-medium text-neutral-800 shadow-[0_2px_16px_-4px_rgba(83,157,253,0.15)] backdrop-blur-lg dark:border-white/15 dark:bg-white/10 dark:text-white/90 dark:shadow-none"
              >
                <span className="text-neutral-400 dark:text-white/50">#</span>
                {tag.name}
              </span>
            ))}
          </div>

          <h1 className="text-[clamp(1.85rem,4.5vw,3rem)] font-bold leading-[1.18] tracking-tight text-neutral-900 dark:text-neutral-50">
            {article.title}
          </h1>

          {article.description ? (
            <p className="mt-5 text-[15px] leading-[1.85] text-neutral-500 dark:text-neutral-400">
              {article.description}
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] tabular-nums text-neutral-500 dark:text-neutral-400">
            <span className="inline-flex items-center gap-1.5">
              <LuCalendar className="size-3.5 text-primary/70" />
              {createTime.format('YYYY-MM-DD HH:mm')}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <LuClock3 className="size-3.5 text-primary/70" />
              约 {readingMinutes} 分钟 · {wordCount} 字
            </span>
            <span className="inline-flex items-center gap-1.5">
              <LuEye className="size-3.5 text-primary/70" />
              {article.view ?? 0} 阅读
            </span>
            <span className="inline-flex items-center gap-1.5">
              <LuMessageCircle className="size-3.5 text-primary/70" />
              {article.comment ?? 0} 评论
            </span>
            <ArticleLikeHero className="mb-0 text-inherit" />
          </div>
        </div>

        {cover ? (
          <div className="relative hidden min-h-[min(46vh,440px)] lg:block">
            <Image
              src={cover}
              alt={article.title}
              fill
              priority
              className="object-cover object-center mask-[linear-gradient(to_left,#000_78%,transparent_100%)]"
              sizes="50vw"
              unoptimized
            />
          </div>
        ) : null}

        {/* 日期徽章 */}
        <div
          aria-hidden
          className="absolute bottom-16 left-1/2 z-20 hidden size-24 -translate-x-1/2 flex-col items-center justify-center rounded-full border border-neutral-900/10 bg-surface/95 text-center shadow-[0_8px_32px_-8px_rgba(83,157,253,0.18)] backdrop-blur-sm dark:border-white/10 dark:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.45)] lg:flex"
        >
          <span className="text-[9px] font-semibold tracking-[0.22em] text-neutral-400">ISSUE</span>
          <span className="text-lg font-bold tabular-nums text-neutral-800 dark:text-neutral-100">
            {createTime.format('MM.DD')}
          </span>
          <span className="text-[10px] tabular-nums text-neutral-400">{createTime.format('YYYY')}</span>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 -bottom-10 z-30">
        <Ripple />
      </div>
    </header>
  );
};
