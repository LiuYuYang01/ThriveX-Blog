'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import dayjs, { type Dayjs } from 'dayjs';

import { getRecordListAPI } from '@/api/record';
import Empty from '@/components/Empty';
import { PageHeroGrid } from '@/components/PageHeroHeader';
import RandomAvatar from '@/components/RandomAvatar';
import { useAppConfig } from '@/components/AppConfigProvider';
import { getStableImage, parseThemeCovers } from '@/utils/cover';
import { Record } from '@/types/app/record';
import RecordCard from '../RecordCard';

interface Props {
  initialList: Record[];
  initialPages: number;
  pageSize: number;
  focusId: number | null;
}

interface DayGroup {
  key: string;
  date: Dayjs;
  records: Record[];
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

export default function RecordTimeline({ initialList, initialPages, pageSize, focusId }: Props) {
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
  const bgCover =
    theme?.record_cover?.trim() || getStableImage(undefined, theme?.covers, 'record-cover') || parseThemeCovers(theme?.covers)[0] || '';

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

  const dayGroups = groupByDay(list);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fbfbfd] px-4 pb-16 sm:px-6 lg:px-8 dark:bg-[#111318]">
      <PageHeroGrid />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.13),transparent_32%),radial-gradient(circle_at_top_right,rgba(244,114,182,0.1),transparent_30%),radial-gradient(circle_at_50%_38%,rgba(139,92,246,0.1),transparent_30%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.14),transparent_32%),radial-gradient(circle_at_top_right,rgba(244,114,182,0.1),transparent_30%),radial-gradient(circle_at_50%_38%,rgba(139,92,246,0.12),transparent_30%)]" />

      <div className="relative mx-auto w-full max-w-[760px]">
        <h1 className="sr-only">闪念</h1>

        {/* 封面横幅 + 站长信息 */}
        <div className="mt-20">
          <div className="relative h-64 overflow-hidden rounded-3xl sm:h-80">
            {bgCover ? (
              <img src={bgCover} alt="" className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <div className="absolute inset-0 bg-linear-to-br from-amber-200/60 via-rose-200/50 to-violet-200/60 dark:from-[#2b2436] dark:via-[#232a3a] dark:to-[#2b2436]" />
            )}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(17,24,39,0.18))]" />
          </div>

          <div className="relative z-10 -mt-10 flex flex-col items-center">
            <span className="flex size-20 items-center justify-center overflow-hidden rounded-full shadow-[0_8px_24px_rgba(15,23,42,0.15)] ring-4 ring-[#fbfbfd] dark:ring-[#111318]">
              {recordAvatar ? (
                <img src={recordAvatar} alt={recordName} className="h-full w-full object-cover" />
              ) : (
                <RandomAvatar seed={recordName} className="h-full w-full" />
              )}
            </span>
            <p className="m-0 mt-3 text-xl font-bold text-[#191919] dark:text-white">{recordName}</p>
            {recordInfo ? (
              <p className="m-0 mt-1 text-sm text-[#8a94a3] dark:text-slate-400">{recordInfo}</p>
            ) : null}
          </div>
        </div>

        {list.length > 0 ? (
          <div ref={timelineRef} className="relative mt-9">
            <ol className="relative flex flex-col gap-8">
              {/* 时间轴主线 */}
              <span
                aria-hidden
                className="absolute top-2 bottom-2 left-[6px] w-px bg-linear-to-b from-transparent via-black/12 to-transparent md:left-[112px] dark:via-white/12"
              />

              {dayGroups.map((day) => {
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
                            <RecordCard key={item.id} record={item} highlighted={focusId === item.id} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>

            {hasMore && <div ref={sentinelRef} className="h-px" />}
            {loading && <p className="py-5 text-center text-xs text-[#b6bdca] dark:text-slate-600">加载中…</p>}
            {!hasMore && (
              <p className="py-5 text-center text-xs tracking-widest text-[#c8cdd6] dark:text-slate-600">
                — 已经到底啦 —
              </p>
            )}
          </div>
        ) : (
          <div className="mt-9 flex items-center justify-center py-16">
            <Empty info="暂无闪念~" />
          </div>
        )}
      </div>
    </div>
  );
}
