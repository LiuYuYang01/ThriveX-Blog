'use client';

import { useEffect, useMemo, useRef } from 'react';
import dayjs from 'dayjs';

import type { Diary } from '@/types/app/diary';

interface Props {
  pages: Diary[];
  active: number[];
  onJump: (index: number) => void;
}

interface Group {
  key: string;
  label: string;
  items: { index: number; diary: Diary }[];
}

export default function DiaryIndex({ pages, active, onJump }: Props) {
  const groups = useMemo<Group[]>(() => {
    const map = new Map<string, Group>();
    pages.forEach((diary, index) => {
      const key = diary.diaryDate.slice(0, 7);
      const group = map.get(key) ?? { key, label: dayjs(diary.diaryDate).format('YYYY年M月'), items: [] };
      group.items.push({ index, diary });
      map.set(key, group);
    });
    // 最新的一册排在最前，翻开目录就看见自己此刻停在哪一页
    return [...map.values()].reverse().map((group) => ({ ...group, items: [...group.items].reverse() }));
  }, [pages]);

  const listRef = useRef<HTMLDivElement>(null);
  const current = active.length ? Math.max(...active) : -1;

  // 目录常驻在书本左侧，翻页时把当前那一篇带回视线中间
  useEffect(() => {
    const list = listRef.current;
    const item = list?.querySelector<HTMLElement>(`[data-page="${current}"]`);
    if (!list || !item) return;
    list.scrollTop = item.offsetTop - list.clientHeight / 2 + item.offsetHeight / 2;
  }, [current]);

  return (
    <>
      <div className="diary-rail-head">
        <h3 className="diary-rail-title">目录</h3>
        <span className="diary-rail-note">{pages.length} 页</span>
      </div>

      <div ref={listRef} className="diary-index-list">
        {groups.map((group) => (
          <section key={group.key} className="diary-index-group">
            <h4 className="diary-index-month">
              <span>{group.label}</span>
              <span className="diary-index-count">{group.items.length} 篇</span>
            </h4>
            <ol className="diary-index-items">
              {group.items.map(({ index, diary }) => {
                const isCurrent = active.includes(index);
                return (
                  <li key={diary.id}>
                    <button type="button" data-page={index} className={`diary-index-row ${isCurrent ? 'is-current' : ''}`} onClick={() => onJump(index)}>
                      <span className="diary-index-day">{dayjs(diary.diaryDate).format('D')}</span>
                      <span className="diary-index-name">{diary.title || '无题'}</span>
                      <span className="diary-index-num">{index + 1}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>
    </>
  );
}
