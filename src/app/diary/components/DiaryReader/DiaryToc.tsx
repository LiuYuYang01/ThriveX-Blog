'use client';

import { useEffect, useMemo, useRef } from 'react';
import dayjs from 'dayjs';

import type { Diary } from '@/types/app/diary';

interface Props {
  pages: Diary[];
  years: number[];
  yearFilter: number | 'all';
  activeIndex: number;
  onJump: (index: number) => void;
  onYearChange: (year: number | 'all') => void;
}

const CN_DIGITS = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
const CN_MONTHS = ['', '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
const WEEK = ['日', '一', '二', '三', '四', '五', '六'];

interface TocEntry {
  index: number;
  title: string;
}

interface TocDay {
  date: string;
  entries: TocEntry[];
}

interface TocMonth {
  month: number;
  name: string;
  total: number;
  days: TocDay[];
}

interface TocYear {
  year: number;
  total: number;
  months: TocMonth[];
}

const cnYear = (year: number) =>
  String(year)
    .split('')
    .map((char) => CN_DIGITS[Number(char)] ?? char)
    .join('');

// 和本地笔记的存放方式一致：年 / 月 / 日，按真实日期分组
const buildTree = (pages: Diary[]): TocYear[] => {
  const years: TocYear[] = [];

  pages.forEach((page, index) => {
    const date = dayjs(page.diaryDate);
    const yearNo = date.year();
    const monthNo = date.month() + 1;
    const dateKey = date.format('YYYY-MM-DD');

    let year = years[years.length - 1];
    if (!year || year.year !== yearNo) {
      year = { year: yearNo, total: 0, months: [] };
      years.push(year);
    }
    year.total += 1;

    let month = year.months[year.months.length - 1];
    if (!month || month.month !== monthNo) {
      month = { month: monthNo, name: CN_MONTHS[monthNo], total: 0, days: [] };
      year.months.push(month);
    }
    month.total += 1;

    let day = month.days[month.days.length - 1];
    if (!day || day.date !== dateKey) {
      day = { date: dateKey, entries: [] };
      month.days.push(day);
    }

    // 标题是可选字段，没有就留空，不拿正文凑标题
    day.entries.push({
      index,
      title: page.title?.trim() || '',
    });
  });

  return years;
};

export default function DiaryToc({ pages, years, yearFilter, activeIndex, onJump, onYearChange }: Props) {
  const tree = useMemo(() => buildTree(pages), [pages]);

  const activeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    // 翻回目录时把当前这篇滚进可视区
    const frame = requestAnimationFrame(() => activeRef.current?.scrollIntoView({ block: 'nearest' }));
    return () => cancelAnimationFrame(frame);
  }, [activeIndex]);

  return (
    <div className="page page--contents" id="diary-toc" aria-label="日记目录" data-no-turn data-grabfold-no-peek>
      <div className="contents-sheet">
        <header className="contents-head">
          <h2 className="contents-title">目次</h2>

          <div className="contents-tabs" role="tablist" aria-label="按年份查看">
            <button
              type="button"
              role="tab"
              aria-selected={yearFilter === 'all'}
              className={`contents-tab ${yearFilter === 'all' ? 'is-active' : ''}`}
              onClick={() => onYearChange('all')}
            >
              全部
            </button>
            {years.map((year) => (
              <button
                key={year}
                type="button"
                role="tab"
                aria-selected={yearFilter === year}
                className={`contents-tab ${yearFilter === year ? 'is-active' : ''}`}
                onClick={() => onYearChange(year)}
              >
                {year}
              </button>
            ))}
          </div>
        </header>

        <nav className="contents-body" aria-label="按年份折叠的目录">
          {tree.map((year) => (
            <section key={year.year} className="contents-year">
              <header className="contents-year-head">
                <h3 className="contents-year-name">{cnYear(year.year)}年</h3>
                <span className="contents-year-count">{year.total} 篇</span>
              </header>

              {year.months.map((month) => (
                <div key={`${year.year}-${month.month}`} className="contents-month">
                  <div className="contents-month-head">
                    <span className="contents-month-name">{month.name}</span>
                    <span className="contents-month-rule" />
                    <span className="contents-month-count">{String(month.total).padStart(2, '0')}</span>
                  </div>

                  {month.days.map((day) => {
                    const date = dayjs(day.date);
                    return day.entries.map((entry, order) => {
                      const isActive = entry.index === activeIndex;
                      return (
                        <button
                          key={`${day.date}-${entry.index}`}
                          ref={isActive ? activeRef : undefined}
                          type="button"
                          className={`contents-row ${isActive ? 'is-active' : ''}`}
                          onClick={() => onJump(entry.index)}
                          title={entry.title || undefined}
                        >
                          <span className="contents-date">{order === 0 ? date.format('MM.DD') : ''}</span>
                          <span className="contents-week">{order === 0 ? `周${WEEK[date.day()]}` : ''}</span>
                          {entry.title ? <span className="contents-entry">{entry.title}</span> : null}
                          <span className="contents-leader" />
                          <span className="contents-page">{String(entry.index * 2 + 1).padStart(2, '0')}</span>
                        </button>
                      );
                    });
                  })}
                </div>
              ))}
            </section>
          ))}
        </nav>
      </div>
    </div>
  );
}
