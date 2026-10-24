'use client';

import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface Props {
  // 日期 -> 当天第一篇日记的页码
  marked: Map<string, number>;
  activeDates: string[];
  month: string;
  onJump: (index: number) => void;
}

const WEEK = ['一', '二', '三', '四', '五', '六', '日'];

export default function DiaryCalendar({ marked, activeDates, month, onJump }: Props) {
  const months = useMemo(() => [...marked.keys()].map((date) => date.slice(0, 7)).sort(), [marked]);
  const [cursor, setCursor] = useState(() => (months.includes(month) ? month : (months[months.length - 1] ?? month)));

  // 翻到别的月份时日历跟过去；自己点箭头浏览时，只要不翻页就停在原处
  useEffect(() => {
    if (months.includes(month)) setCursor(month);
  }, [month, months]);

  const [year, m] = cursor.split('-').map(Number);
  const cells = useMemo(() => {
    const offset = (new Date(year, m - 1, 1).getDay() + 6) % 7;
    const count = new Date(year, m, 0).getDate();
    return [...Array.from({ length: offset }, () => null), ...Array.from({ length: count }, (_, i) => i + 1)];
  }, [year, m]);

  const shift = (step: number) => setCursor(dayjs(`${cursor}-01`).add(step, 'month').format('YYYY-MM'));
  const atFirst = !months.length || cursor <= months[0];
  const atLast = !months.length || cursor >= months[months.length - 1];
  const today = dayjs().format('YYYY-MM-DD');
  const written = months.includes(cursor) ? [...marked.keys()].filter((date) => date.slice(0, 7) === cursor).length : 0;

  return (
    <>
      <div className="diary-rail-head">
        <h3 className="diary-rail-title">日历</h3>
        <span className="diary-rail-note">{written} 篇</span>
      </div>

      <div className="diary-cal-bar">
        <button type="button" className="diary-cal-step" onClick={() => shift(-1)} disabled={atFirst} aria-label="上个月">
          <FiChevronLeft className="size-4" />
        </button>
        <span className="diary-cal-label">{dayjs(`${cursor}-01`).format('YYYY年M月')}</span>
        <button type="button" className="diary-cal-step" onClick={() => shift(1)} disabled={atLast} aria-label="下个月">
          <FiChevronRight className="size-4" />
        </button>
      </div>

      <div className="diary-cal-grid">
        {WEEK.map((label) => (
          <span key={label} className="diary-cal-week">
            {label}
          </span>
        ))}
        {cells.map((day, i) => {
          if (!day) return <span key={`x${i}`} />;
          const date = `${cursor}-${String(day).padStart(2, '0')}`;
          const page = marked.get(date);
          const isCurrent = activeDates.includes(date);
          const cls = ['diary-cal-day', page !== undefined ? 'is-written' : '', isCurrent ? 'is-current' : '', date === today ? 'is-today' : ''].filter(Boolean).join(' ');

          if (page === undefined) {
            return (
              <span key={date} className={cls}>
                {day}
              </span>
            );
          }
          return (
            <button key={date} type="button" className={cls} onClick={() => onJump(page)}>
              {day}
              <span aria-hidden className="diary-cal-dot" />
            </button>
          );
        })}
      </div>

      <p className="diary-cal-hint">有的一天写了几篇，点进去从当天第一篇读起。</p>
    </>
  );
}
