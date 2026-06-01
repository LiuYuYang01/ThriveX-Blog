'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Article } from '@/types/app/article';

import { Accordion, AccordionItem, Spinner } from '@heroui/react';

import archiving from './svg/archiving.svg';
import { AiOutlineEye } from 'react-icons/ai';
import dayjs from 'dayjs';

interface MonthData {
  total: number;
  list: Article[];
  wordCount: number;
}

interface YearData {
  year: number;
  total: number;
  month: Record<number, MonthData>;
  wordCount: number;
}

const Title = ({ data }: { data: YearData }) => {
  return (
    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
      <span className="text-xl font-bold text-slate-800 dark:text-slate-100">
        {data.year} 年 {data.wordCount / 1000 > 50}
      </span>
      <span className="text-sm text-slate-500 dark:text-slate-400">
        共 <span className="font-semibold text-primary">{data.total}</span> 篇 · 约{' '}
        <span className="font-semibold text-primary">{(data.wordCount / 1000).toFixed(2)}K</span> 字
      </span>
    </div>
  );
};

export default ({ list }: { list: Article[] }) => {
  const [result, setResult] = useState<YearData[]>([]);
  const getArticleList = async () => {
    const result = groupByYearAndMonth(list);
    // 从早到晚排序
    result.sort((a, b) => b.year - a.year);
    setResult(result);
  };

  // 将文章进行分组
  function groupByYearAndMonth(data: Article[]): YearData[] {
    const groupedData: Record<number, YearData> = {};

    data.forEach((item) => {
      const date = new Date(+item.createTime!);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const wordCount = item.content ? item.content.length : 0;

      if (!groupedData[year]) {
        groupedData[year] = { year, total: 0, month: {}, wordCount: 0 };
      }

      if (!groupedData[year].month[month]) {
        groupedData[year].month[month] = { total: 0, list: [], wordCount: 0 };
      }

      groupedData[year].month[month].list.push(item);
      groupedData[year].month[month].total++;
      groupedData[year].total++;
      groupedData[year].wordCount += wordCount;
      groupedData[year].month[month].wordCount += wordCount;
    });

    return Object.values(groupedData);
  }

  useEffect(() => {
    getArticleList();
  }, [list]);

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-yellow-500/10 dark:bg-yellow-500/20">
          <Image src={archiving.src} alt="归档" width={28} height={28} className="opacity-90" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">文章归纳</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">按时间线归档的文章列表</p>
        </div>
      </div>

      {result.length ? (
        <Accordion
          className="[&>hr]:!bg-slate-200 dark:[&>hr]:!bg-slate-600/50 !px-0 [&_[data-hover=true]]:!bg-transparent"
          itemClasses={{
            base: 'py-4',
            title: 'text-base font-medium',
            trigger: 'px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50',
            content: 'px-4 pb-4',
          }}
          motionProps={{
            variants: {
              enter: {
                y: 0,
                opacity: 1,
                height: 'auto',
                transition: {
                  height: {
                    type: 'spring',
                    stiffness: 500,
                    damping: 30,
                    duration: 1,
                  },
                  opacity: {
                    ease: 'easeInOut',
                    duration: 1,
                  },
                },
              },
              exit: {
                y: -10,
                opacity: 0,
                height: 0,
                transition: {
                  height: {
                    ease: 'easeInOut',
                    duration: 0.25,
                  },
                  opacity: {
                    ease: 'easeInOut',
                    duration: 0.3,
                  },
                },
              },
            },
          }}
        >
          {result.map((item, index) => (
            <AccordionItem key={index} aria-label={item.year + '年'} title={<Title data={item} />}>
              <div className="space-y-6 pl-2">
                {Object.keys(item.month).map((month, monthIdx) => (
                  <div key={monthIdx} className="relative pl-6">
                    <div className="absolute left-0 top-1.5 w-px h-[calc(100%-0.5rem)] bg-gradient-to-b from-primary/60 to-slate-200 dark:to-slate-600" />
                    <div className="absolute -left-1 top-1.5 w-2.5 h-2.5 rounded-full bg-primary shadow-sm ring-2 ring-white dark:ring-black-b" />
                    <div className="rounded-xl bg-slate-50/80 dark:bg-slate-800/30 p-4 border border-slate-100 dark:border-slate-700/50">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                          {month}月 {item.month[+month].wordCount / 1000 > 10}
                        </span>
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          {item.month[+month].total} 篇 · {(item.month[+month].wordCount / 1000).toFixed(2)}K 字
                        </span>
                      </div>
                      <ul className="space-y-1">
                        {item.month[+month].list.map((article: Article, artIdx) => (
                          <li key={artIdx}>
                            <Link
                              href={`/article/${article.id}`}
                              target="_blank"
                              className="group flex items-center justify-between gap-4 py-2 px-3 mx-3 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-gray-100/80 dark:hover:bg-slate-700/50 hover:text-primary"
                            >
                              <span className="flex-1 truncate">
                                <span className="text-slate-400 dark:text-slate-500 text-sm tabular-nums mr-2">
                                  {dayjs(+article.createTime!).format('MM-DD')}
                                </span>
                                {article.title}
                              </span>
                              <span className="hidden sm:flex items-center gap-1 text-xs text-slate-400 group-hover:text-slate-500 shrink-0">
                                <AiOutlineEye className="text-sm" />
                                {article.view}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className="flex justify-center w-full py-16">
          <Spinner />
        </div>
      )}
    </section>
  );
};
