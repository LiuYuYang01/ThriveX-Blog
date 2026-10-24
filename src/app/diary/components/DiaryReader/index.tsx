'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { FiCalendar, FiChevronLeft, FiChevronRight, FiLock } from 'react-icons/fi';

import { lockDiaryAPI } from '@/api/diary';
import type { Diary } from '@/types/app/diary';
import DiaryLamp from '../DiaryLamp';
import DiaryCalendar from './DiaryCalendar';
import DiarySheet from './DiarySheet';

import './index.scss';

interface Props {
  pages: Diary[];
}

type Dir = 'next' | 'prev';

// 页位：-1 表示这一页留白（本子最后一篇摊不开）
interface Slot {
  left: number;
  right: number;
}
interface Flip {
  front: number;
  back: number;
}
interface Session {
  dir: Dir;
  step: number;
  from: number;
  to: number;
  progress: number;
}
interface Drag {
  x0: number;
  y0: number;
  started: boolean;
}

const FLIP_BASE_MS = 200;
const FLIP_RANGE_MS = 400;
const SNAP = 0.38;
const DRAG_MIN = 10;
const MOBILE_MAX = 860;
const CLOSE_FOLD_MS = 620;
const CLOSE_SETTLE_MS = 420;

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

/** 桌面一页摊两页，摊开位置恒为偶数下标 */
const firstOfSpread = (index: number) => Math.floor(index / 2) * 2;

export default function DiaryReader({ pages }: Props) {
  const router = useRouter();
  const total = pages.length;

  const bookRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const calRef = useRef<HTMLDivElement>(null);
  const calBtnRef = useRef<HTMLButtonElement>(null);
  const session = useRef<Session | null>(null);
  const drag = useRef<Drag | null>(null);
  const raf = useRef(0);
  const indexRef = useRef(0);
  const mobileRef = useRef(false);
  const reduceRef = useRef(false);
  const closingRef = useRef(false);

  const [mobile, setMobile] = useState(false);
  const [index, setIndex] = useState(() => firstOfSpread(Math.max(0, total - 1)));
  // 翻页途中被纸盖住的底层页；为 null 时按 index 正常排版
  const [slot, setSlot] = useState<Slot | null>(null);
  const [flip, setFlip] = useState<Flip | null>(null);
  const [closing, setClosing] = useState(false);
  const [calOpen, setCalOpen] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    mobileRef.current = mobile;
  }, [mobile]);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width:${MOBILE_MAX}px)`);
    const sync = () => setMobile(mql.matches);
    reduceRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    sync();
    mql.addEventListener('change', sync);
    return () => mql.removeEventListener('change', sync);
  }, []);

  // 台历只是偶尔翻一下：点外面或按 Esc 就收起
  useEffect(() => {
    if (!calOpen) return;
    const onDown = (e: PointerEvent) => {
      if (!calRef.current?.contains(e.target as Node)) setCalOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setCalOpen(false);
      calBtnRef.current?.focus();
    };
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [calOpen]);

  // 跨断点时把视线交回同一篇日记；纸还在半空就立刻落平
  useEffect(() => {
    if (!total) return;
    cancelAnimationFrame(raf.current);
    session.current = null;
    setFlip(null);
    setSlot(null);
    setIndex((prev) => (mobile ? Math.min(firstOfSpread(prev) + 1, total - 1) : firstOfSpread(prev)));
  }, [mobile, total]);

  const at = (n: number) => (n >= 0 && n < total ? n : -1);

  const reachable = (dir: Dir, i: number, m: boolean) => {
    if (m) return dir === 'next' ? i < total - 1 : i > 0;
    return dir === 'next' ? i + 2 < total : i > 0;
  };

  const apply = (p: number) => {
    const s = session.current;
    if (!s || !paperRef.current) return;
    paperRef.current.style.transform = `rotateY(${s.from + (s.to - s.from) * p}deg)`;
    // 纸立起来的那一刻折痕最深，阴影与旋转逐帧同步
    const shade = (Math.sin(p * Math.PI) * 0.55).toFixed(3);
    frontRef.current?.style.setProperty('--fs', shade);
    backRef.current?.style.setProperty('--bs', shade);
    s.progress = p;
  };

  const begin = (dir: Dir) => {
    const i = indexRef.current;
    const m = mobileRef.current;
    if (m) {
      const j = at(dir === 'next' ? i + 1 : i - 1);
      setFlip({ front: i, back: j });
      setSlot({ left: j, right: -1 });
      session.current = { dir, step: dir === 'next' ? 1 : -1, from: 0, to: dir === 'next' ? -180 : 180, progress: 0 };
      return;
    }
    if (dir === 'next') {
      setFlip({ front: at(i + 1), back: at(i + 2) });
      setSlot({ left: at(i), right: at(i + 3) });
      session.current = { dir, step: 2, from: 0, to: -180, progress: 0 };
      return;
    }
    setFlip({ front: at(i - 1), back: at(i) });
    setSlot({ left: at(i - 2), right: at(i + 1) });
    session.current = { dir, step: -2, from: -180, to: 0, progress: 0 };
  };

  const land = (step: number | null) => {
    cancelAnimationFrame(raf.current);
    session.current = null;
    setFlip(null);
    setSlot(null);
    if (step !== null) setIndex((prev) => prev + step);
  };

  const run = (from: number, to: number, ease: (t: number) => number) =>
    new Promise<void>((resolve) => {
      if (!session.current) {
        resolve();
        return;
      }
      const duration = FLIP_BASE_MS + Math.abs(to - from) * FLIP_RANGE_MS;
      const start = performance.now();
      const frame = (now: number) => {
        if (!session.current) {
          resolve();
          return;
        }
        const t = Math.min(1, (now - start) / duration);
        apply(from + (to - from) * ease(t));
        if (t < 1) raf.current = requestAnimationFrame(frame);
        else resolve();
      };
      raf.current = requestAnimationFrame(frame);
    });

  const go = (dir: Dir) => {
    if (closingRef.current || session.current || !reachable(dir, indexRef.current, mobileRef.current)) return;
    const m = mobileRef.current;
    const step = dir === 'next' ? (m ? 1 : 2) : m ? -1 : -2;
    if (reduceRef.current) {
      setIndex((prev) => prev + step);
      return;
    }
    begin(dir);
    run(0, 1, easeInOutCubic).then(() => land(session.current?.step ?? null));
  };

  const jump = (target: number) => {
    if (closingRef.current || session.current || target < 0 || target >= total) return;
    land(null);
    setIndex(mobileRef.current ? target : firstOfSpread(target));
    revealBook();
  };

  const jumpFromCalendar = (target: number) => {
    jump(target);
    setCalOpen(false);
  };

  // 日历落到书本下面时，跳完页、合上本子都得把视线送回纸上
  const revealBook = () => {
    const book = bookRef.current;
    if (!book) return;
    const rect = book.getBoundingClientRect();
    if (rect.top >= 0 && rect.bottom <= window.innerHeight) return;
    book.scrollIntoView({ block: 'center', behavior: reduceRef.current ? 'auto' : 'smooth' });
  };

  // 拖纸角：横向拖过阈值才算翻页，进度直接跟着手指走
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button > 0 || closingRef.current || session.current || total < 2) return;
    const target = e.target as HTMLElement | null;
    if (target?.closest('button, a, img, input')) return;
    drag.current = { x0: e.clientX, y0: e.clientY, started: false };
  };

  const startDrag = (dx: number, dy: number): Dir | null => {
    if (Math.abs(dx) < DRAG_MIN || Math.abs(dx) < Math.abs(dy)) return null;
    const m = mobileRef.current;
    if (m) return dx < 0 ? 'next' : 'prev';
    const rect = bookRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const inRight = (drag.current?.x0 ?? 0) - rect.left > rect.width / 2;
    if (dx < 0 && inRight) return 'next';
    if (dx > 0 && !inRight) return 'prev';
    return null;
  };

  // 只依赖 ref，挂一次即可
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const d = drag.current;
      if (!d) return;
      const dx = e.clientX - d.x0;
      const dy = e.clientY - d.y0;
      if (!d.started) {
        const dir = startDrag(dx, dy);
        if (!dir) return;
        if (!reachable(dir, indexRef.current, mobileRef.current)) {
          drag.current = null;
          return;
        }
        begin(dir);
        d.started = true;
      }
      const s = session.current;
      const rect = bookRef.current?.getBoundingClientRect();
      if (!s || !rect) return;
      const base = (mobileRef.current ? rect.width : rect.width / 2) * 0.85;
      const p = s.dir === 'next' ? (d.x0 - e.clientX) / base : (e.clientX - d.x0) / base;
      apply(Math.min(1, Math.max(0, p)));
    };

    const settle = (clientX: number | null) => {
      const d = drag.current;
      drag.current = null;
      if (!d) return;
      const s = session.current;

      if (!d.started) {
        if (clientX === null || s) return;
        // 只是点了一下：选中文字时不翻页
        if (window.getSelection()?.toString()) return;
        const rect = bookRef.current?.getBoundingClientRect();
        if (!rect) return;
        go(clientX - rect.left > rect.width / 2 ? 'next' : 'prev');
        return;
      }
      if (!s) return;
      const target = s.progress > SNAP ? 1 : 0;
      run(s.progress, target, easeOutCubic).then(() => {
        if (session.current !== s) return;
        if (target === 1) land(s.step);
        else land(null);
      });
    };

    const onUp = (e: PointerEvent) => settle(e.clientX);
    const onCancel = () => settle(null);

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onCancel);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onCancel);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const el = e.target as HTMLElement | null;
      if (el?.tagName === 'INPUT' || el?.tagName === 'TEXTAREA' || el?.isContentEditable) return;
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        go('next');
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        go('prev');
      } else if (e.key === 'Home') {
        e.preventDefault();
        jump(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        jump(total - 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [total]);

  // 合上日记本：先跑完合上的动画，锁请求在动画期间并行发出
  const closeBook = () => {
    if (closingRef.current) return;
    closingRef.current = true;
    setCalOpen(false);
    setClosing(true);
    revealBook();
    const locked = lockDiaryAPI().then(
      () => true,
      () => false,
    );
    window.setTimeout(
      async () => {
        if (await locked) {
          router.refresh();
          return;
        }
        closingRef.current = false;
        setClosing(false);
        setNotice('日记本没合上，稍后再试一次。');
      },
      reduceRef.current ? 0 : CLOSE_FOLD_MS + CLOSE_SETTLE_MS,
    );
  };

  const marked = useMemo(() => {
    const map = new Map<string, number>();
    pages.forEach((item, i) => {
      if (!map.has(item.diaryDate)) map.set(item.diaryDate, i);
    });
    return map;
  }, [pages]);

  const spread: Slot = slot ?? { left: index, right: mobile || at(index + 1) < 0 ? -1 : at(index + 1) };
  // 页码/月份按逻辑位置算，翻页途中被提前换掉的底层页不参与
  const logical: Slot = { left: index, right: mobile || at(index + 1) < 0 ? -1 : at(index + 1) };
  const newest = logical.right >= 0 ? logical.right : logical.left;
  const activeDates = [logical.left, logical.right].filter((n) => n >= 0).map((n) => pages[n].diaryDate);
  const monthKey = total ? dayjs(pages[newest].diaryDate).format('YYYY-MM') : '';
  const canPrev = !flip && !closing && reachable('prev', index, mobile);
  const canNext = !flip && !closing && reachable('next', index, mobile);
  const pager = mobile || logical.right < 0 ? `${index + 1} / ${total}` : `${logical.left + 1} – ${logical.right + 1} / ${total}`;

  const sheet = (n: number) => <DiarySheet diary={n >= 0 ? pages[n] : undefined} num={n >= 0 ? n + 1 : undefined} />;

  return (
    <section className={`diary-reader diary-scene ${closing ? 'is-shutting' : ''}`}>
      <DiaryLamp />

      <header className="diary-bar diary-bar-top">
        <button type="button" className="diary-tool" onClick={closeBook} aria-label="合上日记本" disabled={closing}>
          <FiLock className="size-4" />
          <span>合上日记本</span>
        </button>

        {total ? (
          <div className="diary-cal-slot" ref={calRef}>
            <button
              ref={calBtnRef}
              type="button"
              className="diary-tool"
              onClick={() => setCalOpen((open) => !open)}
              disabled={closing}
              aria-expanded={calOpen}
              aria-controls="diary-calendar"
            >
              <FiCalendar className="size-4" />
              <span>日历</span>
            </button>

            {calOpen ? (
              <div id="diary-calendar" className="diary-cal-pop" aria-label="日记日历">
                <DiaryCalendar marked={marked} activeDates={activeDates} month={monthKey} onJump={jumpFromCalendar} onClose={() => setCalOpen(false)} />
              </div>
            ) : null}
          </div>
        ) : null}
      </header>

      <div className="diary-stage">
        {total ? (
          <div ref={bookRef} className={`diary-book ${closing ? 'is-closing' : ''}`} onPointerDown={onPointerDown}>
            <div className="diary-leaf diary-leaf-left">{sheet(spread.left)}</div>
            <div className="diary-leaf diary-leaf-right">{sheet(spread.right)}</div>

            {flip ? (
              <div className="diary-paper" ref={paperRef}>
                <div className="diary-paper-face diary-paper-front" ref={frontRef}>
                  {sheet(flip.front)}
                </div>
                <div className="diary-paper-face diary-paper-back" ref={backRef}>
                  {sheet(flip.back)}
                </div>
              </div>
            ) : null}

            {closing ? (
              <div aria-hidden className="diary-lid">
                <div className="diary-lid-face diary-lid-page">{sheet(spread.left)}</div>
                <div className="diary-lid-face diary-lid-cover">
                  <span className="diary-lid-slip">日记本</span>
                  <span className="diary-lid-seal">慎独</span>
                </div>
              </div>
            ) : null}

            <span aria-hidden className="diary-spine" />
            <span aria-hidden className="diary-ribbon" />
          </div>
        ) : (
          <p className="diary-blank">本子还是空的。主理人在后台写下第一页，这里就有字了。</p>
        )}
      </div>

      {total ? (
        <footer className="diary-bar diary-bar-foot">
          <button type="button" className="diary-turn" onClick={() => go('prev')} disabled={!canPrev} aria-label="上一页">
            <FiChevronLeft className="size-5" />
          </button>
          <p className="diary-pager">{pager}</p>
          <button type="button" className="diary-turn" onClick={() => go('next')} disabled={!canNext} aria-label="下一页">
            <FiChevronRight className="size-5" />
          </button>
        </footer>
      ) : null}

      <p aria-live="polite" className="diary-notice">
        {notice}
      </p>
    </section>
  );
}
