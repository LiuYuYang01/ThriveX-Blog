'use client';

import { useRef, useState } from 'react';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { FiLock } from 'react-icons/fi';

import { Button } from '@/ThriveUI';
import { getDiaryBookAPI, lockDiaryAPI } from '@/api/diary';
import type { Diary, DiaryBook as DiaryBookData } from '@/types/app/diary';
import DiaryEntryCard from '../DiaryEntryCard';

import './index.scss';

interface Props {
  book: DiaryBookData;
}

interface DayGroup {
  date: string;
  entries: Diary[];
}

const WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
const MONTH_NAMES = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

/** 当月日记按日期归组，同一天多篇共用一个日期栏 */
function groupByDate(entries: Diary[]): DayGroup[] {
  const groups: DayGroup[] = [];
  for (const item of entries) {
    const last = groups[groups.length - 1];
    if (last?.date === item.diaryDate) {
      last.entries.push(item);
    } else {
      groups.push({ date: item.diaryDate, entries: [item] });
    }
  }
  return groups;
}

/** 日历格子：周一起始，空格用 null 占位 */
function buildCalendar(year: number, month: number) {
  const first = new Date(year, month - 1, 1);
  const offset = (first.getDay() + 6) % 7;
  const days = dayjs(first).daysInMonth();
  return [...Array.from({ length: offset }, () => null), ...Array.from({ length: days }, (_, i) => i + 1)];
}

export default function DiaryBook({ book: initialBook }: Props) {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<number>(0);

  const [book, setBook] = useState(initialBook);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const { year, month, months, entries, total } = book;
  const years = months.reduce<number[]>((acc, item) => (acc.includes(item.year) ? acc : [...acc, item.year]), []);
  const counts = new Map(months.filter((item) => item.year === year).map((item) => [item.month, item.count]));
  const marked = new Set(entries.map((item) => Number(item.diaryDate.slice(-2))));
  const groups = groupByDate(entries);
  const today = dayjs();

  const load = async (nextYear: number, nextMonth: number) => {
    if (busy || (nextYear === year && nextMonth === month)) return;
    setBusy(true);
    setError('');
    try {
      const { code, data, message } = await getDiaryBookAPI({ year: nextYear, month: nextMonth });
      if (code === 200 && data) setBook(data);
      // 凭证过期：让服务端重新渲染回封面
      else if (code === 401) router.refresh();
      else setError(message ?? '这一页没翻开来');
    } catch {
      setError('网络不太平，稍后再试。');
    } finally {
      setBusy(false);
    }
  };

  const closeBook = async () => {
    try {
      await lockDiaryAPI();
      router.refresh();
    } catch {
      setError('合上失败了，稍后再试。');
    }
  };

  // 日历点到有字的那天，滚过去并轻闪一下
  const jumpTo = (day: number) => {
    const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const el = rootRef.current?.querySelector<HTMLElement>(`[data-diary-date="${date}"]`);
    if (!el) return;

    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
    if (reduce) return;

    window.clearTimeout(flashRef.current);
    el.classList.add('diary-day-flash');
    flashRef.current = window.setTimeout(() => el.classList.remove('diary-day-flash'), 1200);
  };

  return (
    <div ref={rootRef} className="diary-book min-h-screen bg-[#fbfbfd] px-4 pb-20 sm:px-6 lg:px-8 dark:bg-[#111318]">
      <div className="mx-auto w-full max-w-[1080px] pt-[88px] lg:pt-20">
        <header className="diary-masthead flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="m-0 text-[30px] font-bold leading-tight tracking-wide text-[#191919] dark:text-white">日记本</h1>
            <p className="mt-2 text-sm text-[var(--diary-muted)]">{months.length ? `一共 ${total} 篇，最近一页写在 ${months[0].year} 年 ${months[0].month} 月` : '还没有人写下第一页'}</p>
          </div>
          <Button variant="light" size="sm" onPress={() => void closeBook()} startContent={<FiLock className="text-sm" />}>
            合上本子
          </Button>
        </header>

        {!months.length ? (
          <div className="diary-sheet mt-8 rounded-xl border border-[var(--diary-paper-edge)] bg-[var(--diary-paper)] px-6 py-14 text-center">
            <p className="m-0 text-sm leading-7 text-[var(--diary-muted)]">本子还是空的。主理人在后台写完第一页，这里就会有字。</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[236px_minmax(0,1fr)] lg:gap-12">
            <aside className="lg:sticky lg:top-24 lg:self-start">
              {/* 窄屏：只列出真正有字的月份 */}
              <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:hidden">
                {months.map((item) => {
                  const active = item.year === year && item.month === month;
                  return (
                    <button key={`${item.year}-${item.month}`} type="button" onClick={() => void load(item.year, item.month)} className={`diary-chip ${active ? 'is-active' : ''}`}>
                      {item.year}年{item.month}月
                    </button>
                  );
                })}
              </div>

              <div className="hidden lg:block">
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  {years.map((item) => {
                    // months 已按月倒序，每个年份第一次出现的就是这一年最新的一册
                    const latest = months.find((entry) => entry.year === item);
                    return (
                      <button key={item} type="button" onClick={() => latest && void load(item, latest.month)} className={`diary-year ${item === year ? 'is-active' : ''}`}>
                        {item}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 grid grid-cols-3 gap-1.5">
                  {MONTH_NAMES.map((label, i) => {
                    const value = i + 1;
                    const count = counts.get(value) ?? 0;
                    const active = value === month;
                    if (!count) {
                      // 没写过字的月份只留名字，空着本身就是信息
                      return (
                        <div key={label} className="diary-month is-empty">
                          <span>{label}</span>
                        </div>
                      );
                    }
                    return (
                      <button key={label} type="button" onClick={() => void load(year, value)} className={`diary-month ${active ? 'is-active' : ''}`}>
                        <span>{label}</span>
                        <span className="diary-month-count">{count}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="diary-calendar mt-6 border-t border-[var(--diary-line)] pt-5">
                  <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-[var(--diary-muted)]">
                    {['一', '二', '三', '四', '五', '六', '日'].map((label) => (
                      <span key={label}>{label}</span>
                    ))}
                  </div>
                  <div className="mt-1 grid grid-cols-7 gap-1 text-center">
                    {buildCalendar(year, month).map((day, i) =>
                      day ? (
                        <button key={i} type="button" disabled={!marked.has(day)} onClick={() => jumpTo(day)} className={`diary-cal-day ${marked.has(day) ? 'is-marked' : ''} ${day === today.date() && today.year() === year && today.month() + 1 === month ? 'is-today' : ''}`}>
                          <span>{day}</span>
                          {marked.has(day) ? <span aria-hidden className="diary-cal-dot" /> : null}
                        </button>
                      ) : (
                        <span key={i} />
                      ),
                    )}
                  </div>
                  <p className="mt-3 text-[11px] text-[var(--diary-muted)]">红点是写过字的日子</p>
                </div>
              </div>

              <p className="mt-4 hidden text-[11px] leading-5 text-[var(--diary-muted)] lg:block">凭证七天内有效，换设备要重新答一次。</p>
            </aside>

            <section aria-busy={busy} className={busy ? 'opacity-60' : ''}>
              <div className="diary-sheet rounded-xl border border-[var(--diary-paper-edge)] bg-[var(--diary-paper)] px-4 py-1 sm:px-6 sm:py-2">
                <div className="flex items-baseline gap-3 pt-5">
                  <h2 className="m-0 text-[22px] font-bold tracking-wide text-[var(--diary-text)]">
                    {year} 年 {MONTH_NAMES[month - 1]}
                  </h2>
                  <span className="text-xs text-[var(--diary-muted)]">{entries.length} 篇</span>
                </div>

                <div aria-live="polite">{error ? <p className="m-0 mt-3 text-sm text-[var(--diary-seal)]">{error}</p> : null}</div>

                <ol className="mt-3">
                  {groups.map((group) => {
                    const date = dayjs(group.date);
                    return (
                      <li key={group.date} data-diary-date={group.date} className="grid grid-cols-[46px_minmax(0,1fr)] gap-3 border-t border-[var(--diary-line)] py-2 sm:grid-cols-[64px_minmax(0,1fr)] sm:gap-6">
                        <div className="diary-day-gutter pt-4 text-center">
                          <span className="block text-[26px] font-bold leading-none text-[var(--diary-text)] sm:text-[30px]">{date.format('D')}</span>
                          <span className="mt-1.5 block text-[11px] text-[var(--diary-muted)]">{WEEKDAYS[date.day()]}</span>
                        </div>
                        <div className="border-l border-[var(--diary-line)] pl-4 sm:pl-6">
                          <div className="divide-y divide-[var(--diary-line)]">
                            {group.entries.map((item) => (
                              <DiaryEntryCard key={item.id} diary={item} />
                            ))}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ol>

                <p className="py-6 text-center text-xs tracking-[0.2em] text-[var(--diary-muted)]">— 这个月写到这里 —</p>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
