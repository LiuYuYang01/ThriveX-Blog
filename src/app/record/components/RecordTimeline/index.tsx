'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import dayjs, { type Dayjs } from 'dayjs';

import { getRecordListAPI } from '@/api/record';
import Empty from '@/components/Empty';
import PageHeroHeader, { PageHeroGrid } from '@/components/PageHeroHeader';
import RandomAvatar from '@/components/RandomAvatar';
import { useAppConfig } from '@/components/AppConfigProvider';
import { Record } from '@/types/app/record';
import RecordCard from '../RecordCard';

interface Props {
  initialList: Record[];
  total: number;
  initialPages: number;
  pageSize: number;
  focusId: number | null;
}

interface DayGroup {
  key: string;
  date: Dayjs;
  records: Record[];
}

interface MonthGroup {
  key: string;
  label: string;
  count: number;
  days: DayGroup[];
}

const WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

/** 日期分组标签：今天 / 昨天 / 9月7日 / 2024年12月31日 */
function getDayLabelParts(date: Dayjs) {
  const now = dayjs();
  const weekday = WEEKDAYS[date.day()];
  if (date.isSame(now, 'day')) return { main: '今天', sub: weekday, highlight: true };
  if (date.isSame(now.subtract(1, 'day'), 'day')) return { main: '昨天', sub: weekday, highlight: true };
  if (date.isSame(now, 'year')) return { main: date.format('M月D日'), sub: weekday, highlight: false };
  return { main: date.format('YYYY年M月D日'), sub: weekday, highlight: false };
}

/** 按天分组（列表已按时间倒序） */
function groupByDay(list: Record[]): DayGroup[] {
  const groups: DayGroup[] = [];
  for (const item of list) {
    const date = dayjs(+(item.createTime ?? 0));
    const key = date.format('YYYY-MM-DD');
    const last = groups[groups.length - 1];
    if (last && last.key === key) {
      last.records.push(item);
    } else {
      groups.push({ key, date, records: [item] });
    }
  }
  return groups;
}

/** 按月聚合天分组，用于月份分隔 */
function groupByMonth(days: DayGroup[]): MonthGroup[] {
  const months: MonthGroup[] = [];
  for (const day of days) {
    const key = day.date.format('YYYY-MM');
    const last = months[months.length - 1];
    if (last && last.key === key) {
      last.days.push(day);
      last.count += day.records.length;
    } else {
      months.push({ key, label: day.date.format('YYYY 年 M 月'), count: day.records.length, days: [day] });
    }
  }
  return months;
}

export default function RecordTimeline({ initialList, total, initialPages, pageSize, focusId }: Props) {
  const { author, theme } = useAppConfig();

  const [list, setList] = useState<Record[]>(initialList);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialPages > 1);
  const pageRef = useRef(1);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const flashedRef = useRef(false);

  const recordName = theme?.record_name?.trim() || author?.name || '我';
  const recordAvatar = theme?.record_avatar?.trim() || author?.avatar || '';
  const recordInfo = theme?.record_info?.trim();

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const nextPage = pageRef.current + 1;
      const { data } = await getRecordListAPI({ pageNum: nextPage, pageSize });
      const nextList = data?.result ?? [];
      if (nextList.length) {
        setList((prev) => [...prev, ...nextList]);
        pageRef.current = nextPage;
        setHasMore(nextPage < (data?.pages ?? 1));
      } else {
        setHasMore(false);
      }
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, pageSize]);

  // 无限滚动
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => entries[0].isIntersecting && void loadMore(),
      { rootMargin: '480px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  // 从侧栏轮播卡带 id 进入时，定位并高亮对应闪念
  useEffect(() => {
    if (!focusId || flashedRef.current || !list.length) return;
    const el = timelineRef.current?.querySelector<HTMLElement>(`[data-record-id="${focusId}"]`);
    if (!el) return;
    flashedRef.current = true;
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('record-item-flash');
      window.setTimeout(() => el.classList.remove('record-item-flash'), 1200);
    });
  }, [focusId, list]);

  const months = groupByMonth(groupByDay(list));

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fbfbfd] px-4 pb-16 sm:px-6 lg:px-8 dark:bg-[#111318]">
      <PageHeroGrid />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.13),transparent_32%),radial-gradient(circle_at_top_right,rgba(244,114,182,0.1),transparent_30%),radial-gradient(circle_at_50%_38%,rgba(139,92,246,0.1),transparent_30%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.14),transparent_32%),radial-gradient(circle_at_top_right,rgba(244,114,182,0.1),transparent_30%),radial-gradient(circle_at_50%_38%,rgba(139,92,246,0.12),transparent_30%)]" />

      <div className="relative mx-auto w-full max-w-[760px]">
        <PageHeroHeader title="闪念" subtitle={recordInfo || '记录生活，遇见美好'} className="mb-0" />

        {/* 站长署名 */}
        <div className="relative z-10 mt-2 mb-10 flex items-center justify-center gap-2">
          <span className="flex size-7 items-center justify-center overflow-hidden rounded-full ring-2 ring-white dark:ring-[#1a212b]">
            {recordAvatar ? (
              <img src={recordAvatar} alt={recordName} className="h-full w-full object-cover" />
            ) : (
              <RandomAvatar seed={recordName} className="h-full w-full" />
            )}
          </span>
          <span className="text-sm text-[#5c6470] dark:text-slate-400">{recordName}</span>
          <span className="text-xs text-[#c0c7d2] dark:text-slate-600">· 共 {total} 条</span>
        </div>

        {list.length > 0 ? (
          <div ref={timelineRef} className="relative">
            {/* 时间轴主线 */}
            <span
              aria-hidden
              className="absolute top-1 bottom-1 left-[6px] w-px bg-linear-to-b from-transparent via-black/12 to-transparent md:left-[112px] dark:via-white/12"
            />

            {months.map((month) => (
              <section key={month.key} className="relative">
                <div className="sticky top-[60px] z-20 -mx-2 px-2 py-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-black/5 bg-white/88 px-3.5 py-1.5 text-xs font-medium tracking-[0.12em] text-[#7b8494] shadow-[0_4px_16px_rgba(15,23,42,0.05)] backdrop-blur-md dark:border-white/10 dark:bg-[#1a212b]/88 dark:text-slate-400">
                    {month.label}
                    <span className="tracking-normal text-[#bfc6d1] dark:text-slate-600">{month.count} 条</span>
                  </span>
                </div>

                <ol className="flex flex-col gap-9 pb-9">
                  {month.days.map((day) => {
                    const label = getDayLabelParts(day.date);
                    return (
                      <li key={day.key} className="relative">
                        {/* 轴点 */}
                        <span
                          aria-hidden
                          className="absolute top-6 left-0 size-3 rounded-full bg-amber-400 ring-4 ring-[#fbfbfd] md:left-[106px] dark:ring-[#111318]"
                        />
                        <div className="md:grid md:grid-cols-[112px_1fr]">
                          <div className="hidden pt-5 pr-8 text-right md:block">
                            <p
                              className={`m-0 text-sm ${label.highlight ? 'font-semibold text-[#191919] dark:text-white' : 'font-medium text-[#5b6472] dark:text-slate-400'}`}
                            >
                              {label.main}
                            </p>
                            <p className="m-0 mt-0.5 text-[11px] text-[#aab1bd] dark:text-slate-600">{label.sub}</p>
                          </div>
                          <div className="pl-8 md:pl-7">
                            <p className="m-0 mb-3 flex items-baseline gap-1.5 text-xs md:hidden">
                              <span
                                className={`font-medium ${label.highlight ? 'text-[#191919] dark:text-white' : 'text-[#5b6472] dark:text-slate-400'}`}
                              >
                                {label.main}
                              </span>
                              <span className="text-[11px] text-[#aab1bd] dark:text-slate-600">{label.sub}</span>
                            </p>
                            <div className="space-y-4">
                              {day.records.map((item) => (
                                <RecordCard
                                  key={item.id}
                                  record={item}
                                  highlighted={focusId === item.id}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </section>
            ))}

            {hasMore && <div ref={sentinelRef} className="h-px" />}
            {loading && <p className="py-5 text-center text-xs text-[#b6bdca] dark:text-slate-600">加载中…</p>}
            {!hasMore && (
              <p className="py-5 text-center text-xs tracking-widest text-[#c8cdd6] dark:text-slate-600">
                — 已经到底啦 —
              </p>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center py-16">
            <Empty info="暂无闪念~" />
          </div>
        )}
      </div>
    </div>
  );
}
