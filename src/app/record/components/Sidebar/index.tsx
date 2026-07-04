'use client';

import { useMemo } from 'react';
import dayjs from 'dayjs';
import { Record } from '@/types/app/record';
import { User } from '@/types/app/user';
import { moodScore } from '@/constants/mood';
import { computeRecordStats } from '../../utils';

interface Props {
  records: Record[];
  user: Pick<User, 'avatar' | 'name'> | null;
}

const WEEKDAYS = ['一', '二', '三', '四', '五', '六', '日'];

const panelClass =
  'rounded-[10px] border border-[#edf0f4] bg-white/85 p-5 shadow-[0_18px_55px_rgba(33,42,58,0.08)] dark:border-white/10 dark:bg-black-b dark:shadow-none';

export default function RecordSidebar({ records, user }: Props) {
  const monthKey = dayjs().format('YYYY-MM');
  const stats = useMemo(() => computeRecordStats(records), [records]);

  const moodByDate = useMemo(() => {
    const map = new Map<string, { mood: string; time: number }>();
    records.forEach((r) => {
      if (!r.mood || !r.createTime) return;
      const time = +r.createTime;
      const key = dayjs(time).format('YYYY-MM-DD');
      const prev = map.get(key);
      if (!prev || time > prev.time) map.set(key, { mood: r.mood, time });
    });
    return map;
  }, [records]);

  const moodPoints = useMemo(() => {
    return records
      .filter((r) => r.mood?.trim() && r.createTime)
      .sort((a, b) => +a.createTime! - +b.createTime!)
      .slice(-10)
      .map((r) => ({ emoji: r.mood!.trim(), score: moodScore(r.mood) }));
  }, [records]);

  const chartData = useMemo(() => {
    const w = 330;
    const h = 96;
    const bottom = 96;
    const padding = 9;

    if (moodPoints.length === 0) return null;

    if (moodPoints.length === 1) {
      const p = moodPoints[0];
      const x = w / 2;
      const y = bottom - (p.score / 5) * h;
      const points = [{ x, y, emoji: p.emoji, score: p.score }];
      const linePath = `M${padding} ${y} L${w - padding} ${y}`;
      const areaPath = `${linePath} L${w - padding} ${bottom} L${padding} ${bottom}Z`;
      return { points, linePath, areaPath, highlightIndex: 0 };
    }

    const step = (w - padding * 2) / (moodPoints.length - 1);
    const points = moodPoints.map((p, i) => ({
      x: padding + i * step,
      y: bottom - (p.score / 5) * h,
      emoji: p.emoji,
      score: p.score,
    }));
    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`).join(' ');
    const areaPath = `${linePath} L${points[points.length - 1].x} ${bottom} L${points[0].x} ${bottom}Z`;

    return { points, linePath, areaPath, highlightIndex: points.length - 1 };
  }, [moodPoints]);

  const emojiColor = (score: number) => {
    if (score >= 4) return '#f2a20e';
    if (score >= 3) return '#98a0ac';
    return '#8ea0bd';
  };

  const calendarCells = useMemo(() => {
    const month = dayjs();
    const start = month.startOf('month');
    const end = month.endOf('month');
    const offset = (start.day() + 6) % 7;
    const cells: { date: dayjs.Dayjs; muted: boolean }[] = [];

    for (let i = offset - 1; i >= 0; i--) {
      cells.push({ date: start.subtract(i + 1, 'day'), muted: true });
    }
    for (let d = 0; d < end.date(); d++) {
      cells.push({ date: start.add(d, 'day'), muted: false });
    }
    let next = end.add(1, 'day');
    while (cells.length % 7 !== 0) {
      cells.push({ date: next, muted: true });
      next = next.add(1, 'day');
    }
    return cells;
  }, [monthKey]);

  const avgScore = moodPoints.length
    ? (moodPoints.reduce((s, p) => s + p.score, 0) / moodPoints.length).toFixed(1)
    : null;

  return (
    <aside className="hidden gap-3 lg:grid">
      {user && (
        <section className={panelClass}>
          <div className="flex items-center gap-3">
            <img src={user.avatar} alt={user.name} className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/20" />
            <div className="min-w-0">
              <p className="m-0 truncate text-base font-semibold text-[#161a22] dark:text-slate-100">{user.name}</p>
              <p className="mt-1 text-xs text-[#8a94a3] dark:text-slate-500">记录生活的每一刻</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-[#f7f8fa] px-2 py-2.5 dark:bg-white/5">
              <p className="m-0 text-lg font-semibold text-[#161a22] dark:text-white">{stats.total}</p>
              <p className="mt-0.5 text-[11px] text-[#8a94a3]">条闪念</p>
            </div>
            <div className="rounded-xl bg-[#f7f8fa] px-2 py-2.5 dark:bg-white/5">
              <p className="m-0 text-lg font-semibold text-[#161a22] dark:text-white">{stats.thisMonth}</p>
              <p className="mt-0.5 text-[11px] text-[#8a94a3]">本月</p>
            </div>
            <div className="rounded-xl bg-[#f7f8fa] px-2 py-2.5 dark:bg-white/5">
              <p className="m-0 text-lg font-semibold text-[#161a22] dark:text-white">{avgScore ?? '—'}</p>
              <p className="mt-0.5 text-[11px] text-[#8a94a3]">均分</p>
            </div>
          </div>
        </section>
      )}

      <section className={panelClass}>
        <h2 className="m-0 text-center font-semibold text-[#161a22] dark:text-slate-100">每日心情</h2>
        <div className="mt-4 grid grid-cols-7 gap-y-3 text-center text-[13px]">
          {WEEKDAYS.map((d) => (
            <div key={d} className="text-[#9aa3b1] dark:text-slate-500">{d}</div>
          ))}
          {calendarCells.map((cell, i) => {
            const key = cell.date.format('YYYY-MM-DD');
            const mood = moodByDate.get(key)?.mood;

            return (
              <div key={i} className="mx-auto flex flex-col items-center gap-0.5">
                <span
                  className={`grid h-[24px] w-[24px] place-items-center text-[12px] ${
                    cell.muted ? 'text-[#9aa3b1] dark:text-slate-600' : 'text-[#242a35] dark:text-slate-300'
                  }`}
                >
                  {cell.date.date()}
                </span>
                <span className="h-[14px] text-[13px] leading-none">{mood ?? ''}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className={panelClass}>
        <div className="mb-3.5 flex items-center justify-between">
          <h2 className="m-0 text-base font-semibold text-[#161a22] dark:text-slate-100">心情图谱</h2>
        </div>
        {chartData ? (
          <>
            <svg className="h-[120px] w-full" viewBox="0 0 330 120" aria-label="心情图谱">
              <defs>
                <linearGradient id="recordMoodFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="#8db6ff" stopOpacity=".28" />
                  <stop offset="1" stopColor="#8db6ff" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={chartData.areaPath} fill="url(#recordMoodFill)" />
              <path d={chartData.linePath} fill="none" stroke="#98bbff" strokeWidth="2" />
              {chartData.points.map((p, i) => (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r="3"
                  className="fill-white stroke-[#98bbff] dark:fill-[#2a3140]"
                  strokeWidth="2"
                />
              ))}
              {(() => {
                const p = chartData.points[chartData.highlightIndex];
                return <circle cx={p.x} cy={p.y} r="6" fill="#7da9ff" />;
              })()}
              {chartData.points.map((p, i) => (
                <text key={`emoji-${i}`} x={p.x} y="110" fontSize="18" textAnchor="middle" fill={emojiColor(p.score)}>
                  {p.emoji}
                </text>
              ))}
            </svg>
            <div className="mt-1 text-[13px] text-[#8a94a3] dark:text-slate-500">
              记录心情的每一天 <span className="text-base">🌈</span>
            </div>
          </>
        ) : (
          <p className="mt-1 text-sm text-[#8a94a3] dark:text-slate-500">发布带心情的闪念后，这里会展示趋势</p>
        )}
      </section>
    </aside>
  );
}
