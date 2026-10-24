'use client';

import { useEffect, useMemo, useRef } from 'react';
import dayjs from 'dayjs';
import { FiX } from 'react-icons/fi';

import type { Diary } from '@/types/app/diary';

interface Props {
  pages: Diary[];
  active: number[];
  onJump: (index: number) => void;
  onClose: () => void;
}

interface Group {
  key: string;
  label: string;
  items: { index: number; diary: Diary }[];
}

export default function DiaryIndex({ pages, active, onJump, onClose }: Props) {
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
  const currentRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const list = listRef.current;
    const item = currentRef.current;
    if (!list || !item) return;
    list.scrollTop = item.offsetTop - list.clientHeight / 2 + item.offsetHeight / 2;
  }, []);

  return (
    <>
      <div className="diary-panel-head">
        <h3 className="diary-panel-title">目录</h3>
        <span className="diary-panel-note">{pages.length} 页</span>
        <button type="button" className="diary-panel-close" onClick={onClose} aria-label="关闭目录">
          <FiX className="size-4" />
        </button>
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
                    <button type="button" ref={isCurrent ? currentRef : undefined} className={`diary-index-row ${isCurrent ? 'is-current' : ''}`} onClick={() => onJump(index)}>
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
