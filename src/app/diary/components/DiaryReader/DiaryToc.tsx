'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { FiChevronRight, FiX } from 'react-icons/fi';

import type { Diary } from '@/types/app/diary';

interface Props {
  pages: Diary[];
  years: number[];
  yearFilter: number | 'all';
  activeIndex: number;
  onJump: (index: number) => void;
  onYearChange: (year: number | 'all') => void;
  onClose: () => void;
}

const CN_MONTHS = ['', '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
const WEEK = ['日', '一', '二', '三', '四', '五', '六'];

interface TocEntry {
  index: number;
  title: string;
}

interface TocDay {
  day: number;
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

// 和本地笔记的存放方式一致：年 / 月 / MMDD，目录也按这三级折叠
const buildTree = (pages: Diary[]): TocYear[] => {
  const years: TocYear[] = [];

  pages.forEach((page, index) => {
    const date = dayjs(page.diaryDate);
    const yearNo = date.year();
    const monthNo = date.month() + 1;
    const dayNo = date.day();

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
    if (!day || day.day !== dayNo) {
      day = { day: dayNo, date: page.diaryDate, entries: [] };
      month.days.push(day);
    }

    const plain = page.content.replace(/[#>*`_~\-[\]()!]/g, ' ').replace(/\s+/g, ' ').trim();
    day.entries.push({
      index,
      title: page.title?.trim() || plain.slice(0, 18) || '无题',
    });
  });

  return years;
};

export default function DiaryToc({ pages, years, yearFilter, activeIndex, onJump, onYearChange, onClose }: Props) {
  const tree = useMemo(() => buildTree(pages), [pages]);

  const active = activeIndex >= 0 && activeIndex < pages.length ? pages[activeIndex] : null;
  const activeDate = active?.diaryDate ?? null;
  const activeYear = active ? dayjs(active.diaryDate).year() : null;
  const activeMonth = active ? `${activeYear}-${dayjs(active.diaryDate).month() + 1}` : null;

  const [openYears, setOpenYears] = useState<Set<number>>(() => new Set(activeYear != null ? [activeYear] : tree[0] ? [tree[0].year] : []));
  const [openMonths, setOpenMonths] = useState<Set<string>>(() => new Set(activeMonth ? [activeMonth] : []));
  const [openDays, setOpenDays] = useState<Set<string>>(() => new Set(active ? [active.diaryDate] : []));

  // 翻页后目录自动展开到当前这篇所在的位置
  useEffect(() => {
    if (activeYear == null || !activeMonth || !activeDate) return;
    setOpenYears((prev) => (prev.has(activeYear) ? prev : new Set(prev).add(activeYear)));
    setOpenMonths((prev) => (prev.has(activeMonth) ? prev : new Set(prev).add(activeMonth)));
    setOpenDays((prev) => (prev.has(activeDate) ? prev : new Set(prev).add(activeDate)));
  }, [activeYear, activeMonth, activeDate]);

  const activeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    // 展开当前日期后等一帧，再把这一篇滚进目录可视区
    const frame = requestAnimationFrame(() => activeRef.current?.scrollIntoView({ block: 'nearest' }));
    return () => cancelAnimationFrame(frame);
  }, [activeIndex]);

  const toggleYear = (year: number) =>
    setOpenYears((prev) => {
      const next = new Set(prev);
      if (next.has(year)) next.delete(year);
      else next.add(year);
      return next;
    });

  const toggleMonth = (key: string) =>
    setOpenMonths((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const toggleDay = (key: string) =>
    setOpenDays((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  return (
    <aside id="diary-toc" className="diary-toc" aria-label="日记目录">
      <header className="diary-toc-head">
        <h2 className="diary-toc-title">目录</h2>
        <span className="diary-toc-note">{pages.length} 篇</span>
        <button type="button" className="diary-toc-close" onClick={onClose} aria-label="收起目录">
          <FiX className="size-4" />
        </button>
      </header>

      <div className="diary-toc-years" role="tablist" aria-label="按年份查看">
        <button
          type="button"
          role="tab"
          aria-selected={yearFilter === 'all'}
          className={`diary-toc-year-tab ${yearFilter === 'all' ? 'is-active' : ''}`}
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
            title={`${year} 年`}
            className={`diary-toc-year-tab ${yearFilter === year ? 'is-active' : ''}`}
            onClick={() => onYearChange(year)}
          >
            {year}
          </button>
        ))}
      </div>

      <nav className="diary-toc-body">
        {tree.map((year) => (
          <section key={year.year} className="diary-toc-year">
            <button
              type="button"
              className="diary-toc-fold is-year"
              onClick={() => toggleYear(year.year)}
              aria-expanded={openYears.has(year.year)}
            >
              <FiChevronRight size={12} className={`diary-toc-caret ${openYears.has(year.year) ? 'is-open' : ''}`} />
              <span>{year.year}</span>
              <span className="diary-toc-count">{year.total}</span>
            </button>

            {openYears.has(year.year)
              ? year.months.map((month) => {
                  const monthKey = `${year.year}-${month.month}`;
                  return (
                    <div key={monthKey} className="diary-toc-month">
                      <button
                        type="button"
                        className="diary-toc-fold is-month"
                        onClick={() => toggleMonth(monthKey)}
                        aria-expanded={openMonths.has(monthKey)}
                      >
                        <FiChevronRight size={11} className={`diary-toc-caret ${openMonths.has(monthKey) ? 'is-open' : ''}`} />
                        <span>{month.name}</span>
                        <span className="diary-toc-count">{month.total}</span>
                      </button>

                      {openMonths.has(monthKey)
                        ? month.days.map((day) => {
                            const date = dayjs(day.date);
                            const isOpen = openDays.has(day.date);
                            return (
                              <div key={day.date} className="diary-toc-day">
                                <button
                                  type="button"
                                  className="diary-toc-fold is-day"
                                  onClick={() => toggleDay(day.date)}
                                  aria-expanded={isOpen}
                                >
                                  <FiChevronRight size={10} className={`diary-toc-caret ${isOpen ? 'is-open' : ''}`} />
                                  <span className="diary-toc-day-no">{date.format('MMDD')}</span>
                                  <span className="diary-toc-day-week">周{WEEK[date.day()]}</span>
                                  <span className="diary-toc-count">{day.entries.length}</span>
                                </button>

                                {isOpen ? (
                                  <div className="diary-toc-entries">
                                    {day.entries.map((entry) => (
                                      <button
                                        key={`${day.date}-${entry.index}`}
                                        ref={entry.index === activeIndex ? activeRef : undefined}
                                        type="button"
                                        className={`diary-toc-entry ${entry.index === activeIndex ? 'is-active' : ''}`}
                                        onClick={() => onJump(entry.index)}
                                        title={entry.title}
                                      >
                                        <span className="diary-toc-entry-title">{entry.title}</span>
                                        <span className="diary-toc-entry-no">{String(entry.index + 1).padStart(2, '0')}</span>
                                      </button>
                                    ))}
                                  </div>
                                ) : null}
                              </div>
                            );
                          })
                        : null}
                    </div>
                  );
                })
              : null}
          </section>
        ))}
      </nav>
    </aside>
  );
}
