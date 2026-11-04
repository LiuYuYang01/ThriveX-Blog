'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { FiCalendar, FiList, FiLock } from 'react-icons/fi';
import { GrabfoldBook, type GrabfoldBookHandle, type PageRef } from 'grabfold/react';
import type { PageTurnSound } from 'grabfold/sound';

import { lockDiaryAPI } from '@/api/diary';
import { useAppConfig } from '@/components/AppConfigProvider';
import type { Diary } from '@/types/app/diary';
import { fallbackCoverRect, readCoverRect } from '../../coverRect';
import DiaryCoverFront from '../DiaryCover';
import DiaryCalendar from './DiaryCalendar';
import DiaryToc from './DiaryToc';
import {
  DiaryColophonSheet,
  DiaryEndpaper,
  DiaryEntrySheet,
  DiaryTitleSheet,
  DiaryVerso,
  splitDiaryContent,
} from './DiarySheet';

import './index.scss';

interface Props {
  pages: Diary[];
}

type Dir = 'next' | 'prev';
type Mode = 'spread' | 'single';

const SPREAD_MQ = '(min-width: 700px)';
const FLIP_MS = 680;
const CLOSE_FADE_MS = 160;
const CLOSE_MOVE_MS = 660;

const CN_DIGITS = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
const CN_MONTHS = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];

const cnYear = (year: number) =>
  String(year)
    .split('')
    .map((char) => CN_DIGITS[Number(char)] ?? char)
    .join('');

const seasonOf = (month: number) => {
  if (month >= 3 && month <= 5) return '春天';
  if (month >= 6 && month <= 8) return '夏天';
  if (month >= 9 && month <= 11) return '秋天';
  return '冬天';
};

/** 换布局时把阅读位置换算过去，读者不会丢页 */
const mapMode = (position: number, total: number, from: Mode, to: Mode) => {
  if (from === to) return position;
  if (to === 'single') {
    if (position < 0) return -1;
    if (position >= total) return total * 2;
    return position * 2;
  }
  if (position < 0) return -1;
  if (position >= total * 2) return total;
  return Math.floor(position / 2);
};

/* ---------- 纸的下缘被轻轻托起：弹簧-质点 + Verlet 积分 ----------
   和示例同一套算法：底边离散成 17 个质点，每个点被一根很软的弹簧拉向目标高度，
   相邻点之间再靠弯曲刚度牵连；每帧写回 clip-path，形状是真的在动。 */
const createPaperEdge = () => {
  const N = 17;
  const LIFT = 12;
  const AIM = 0.095;
  const BEND = 0.24;
  const DAMP = 0.83;
  const SHAPE = Array.from({ length: N }, (_, i) => (i / (N - 1)) ** 1.5);
  const FLAT = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)';

  interface Rope {
    el: HTMLElement;
    dir: 1 | -1;
    y: Float32Array;
    was: Float32Array;
    aim: number;
  }

  const ropes = new Map<HTMLElement, Rope>();
  let frame = 0;
  let hovered: HTMLElement | null = null;

  const ropeOf = (el: HTMLElement) => {
    let rope = ropes.get(el);
    if (!rope) {
      rope = {
        el,
        dir: el.classList.contains('page--left') ? -1 : 1,
        y: new Float32Array(N),
        was: new Float32Array(N),
        aim: 0,
      };
      ropes.set(el, rope);
    }
    return rope;
  };

  const polygonFor = (y: Float32Array, dir: 1 | -1) => {
    const parts = ['0 0', '100% 0'];
    for (let i = N - 1; i >= 0; i -= 1) {
      const fromSpine = dir > 0 ? i : N - 1 - i;
      parts.push(`${((i / (N - 1)) * 100).toFixed(2)}% calc(100% - ${y[fromSpine].toFixed(2)}px)`);
    }
    return `polygon(${parts.join(',')})`;
  };

  const paint = (rope: Rope) => {
    const { y, dir } = rope;
    rope.el.style.clipPath = polygonFor(y, dir);
    rope.el.style.setProperty('--curl-shade', Math.min(1, y[N - 1] / (LIFT * 0.72)).toFixed(3));
  };

  const step = (rope: Rope) => {
    const { y, was } = rope;
    for (let i = 2; i < N; i += 1) {
      const drift = (y[i] - was[i]) * DAMP;
      was[i] = y[i];
      y[i] = Math.max(0, y[i] + drift + (SHAPE[i] * rope.aim - y[i]) * AIM);
    }
    for (let i = 2; i < N - 1; i += 1) {
      y[i] += ((y[i - 1] + y[i + 1]) / 2 - y[i]) * BEND;
    }

    let speed = 0;
    for (let i = 2; i < N; i += 1) {
      const delta = Math.abs(y[i] - was[i]);
      if (delta > speed) speed = delta;
    }
    paint(rope);

    if (Math.abs(rope.aim - y[N - 1]) < 0.12 && speed < 0.12) {
      if (rope.aim === 0) {
        y.fill(0);
        was.fill(0);
      } else {
        y[N - 1] = rope.aim;
      }
      paint(rope);
      return false;
    }
    return true;
  };

  const tick = () => {
    frame = 0;
    let busy = false;
    ropes.forEach((rope, el) => {
      if (!el.isConnected) {
        ropes.delete(el);
        return;
      }
      if (step(rope)) busy = true;
    });
    if (busy) frame = requestAnimationFrame(tick);
  };

  const wake = () => {
    if (!frame) frame = requestAnimationFrame(tick);
  };

  const aim = (el: HTMLElement | null) => {
    if (hovered === el) return;
    if (hovered) {
      const old = ropes.get(hovered);
      if (old) {
        old.aim = 0;
        wake();
      }
    }
    hovered = el;
    if (el) {
      ropeOf(el).aim = LIFT;
      wake();
    }
  };

  const freeze = () => {
    hovered = null;
    ropes.forEach((rope) => {
      rope.aim = 0;
      rope.y.fill(0);
      rope.was.fill(0);
      rope.el.style.clipPath = FLAT;
      rope.el.style.setProperty('--curl-shade', '0');
    });
  };

  const nearest = (node: EventTarget | null) =>
    node instanceof Element ? node.closest<HTMLElement>('.page--left, .page--right') : null;

  const canHover = window.matchMedia('(hover: hover)');
  const calm = window.matchMedia('(prefers-reduced-motion: reduce)');

  const onMove = (event: PointerEvent) => {
    if (!canHover.matches || calm.matches) return;
    const page = nearest(event.target);
    aim(page && !page.closest('.is-turning') ? page : null);
  };
  const onLeave = () => aim(null);
  const onBlur = () => aim(null);

  document.addEventListener('pointermove', onMove, { passive: true });
  document.addEventListener('pointerleave', onLeave);
  window.addEventListener('blur', onBlur);

  return {
    freeze,
    dispose() {
      cancelAnimationFrame(frame);
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('blur', onBlur);
      ropes.clear();
    },
  };
};

export default function DiaryReader({ pages }: Props) {
  const router = useRouter();
  const { author } = useAppConfig();

  const bookRef = useRef<GrabfoldBookHandle>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const castRef = useRef<HTMLDivElement>(null);
  const flipRef = useRef<HTMLDivElement>(null);
  const pagerRef = useRef<HTMLDivElement>(null);
  const handoffRef = useRef<HTMLDivElement>(null);
  const liveRef = useRef<HTMLDivElement>(null);
  const calRef = useRef<HTMLDivElement>(null);
  const calBtnRef = useRef<HTMLButtonElement>(null);
  const paperEdgeRef = useRef<ReturnType<typeof createPaperEdge> | null>(null);

  const closingRef = useRef(false);
  const reduceRef = useRef(false);
  const pendingTurn = useRef<Dir | null>(null);
  const closeRef = useRef<() => void>(() => {});

  const [mode, setMode] = useState<Mode>('spread');
  const modeRef = useRef<Mode>('spread');
  const [position, setPosition] = useState(0);
  const positionRef = useRef(0);
  const [closing, setClosing] = useState(false);
  const [calOpen, setCalOpen] = useState(false);
  const [tocOpen, setTocOpen] = useState(true);
  const [yearFilter, setYearFilter] = useState<number | 'all'>('all');
  const [notice, setNotice] = useState('');
  const [sound, setSound] = useState<PageTurnSound | null>(null);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  // 整本日记里出现过的年份，用来切换「全部 / 指定年份」
  const years = useMemo(() => {
    const list: number[] = [];
    pages.forEach((item) => {
      const year = dayjs(item.diaryDate).year();
      if (!list.includes(year)) list.push(year);
    });
    return list;
  }, [pages]);

  const viewPages = useMemo(
    () => (yearFilter === 'all' ? pages : pages.filter((item) => dayjs(item.diaryDate).year() === yearFilter)),
    [pages, yearFilter],
  );
  const total = viewPages.length;

  const leaves = useMemo(() => viewPages.map((item) => splitDiaryContent(item.content)), [viewPages]);

  const titleMeta = useMemo(() => {
    if (!viewPages.length) return '';
    if (yearFilter !== 'all') return `${cnYear(yearFilter)}年`;
    const date = dayjs(viewPages[0].diaryDate);
    return `${cnYear(date.year())}年 ${CN_MONTHS[date.month() + 1]}月`;
  }, [viewPages, yearFilter]);

  const colophonNote = useMemo(() => {
    if (!viewPages.length) return '';
    const date = dayjs(viewPages[viewPages.length - 1].diaryDate);
    return `${total} 篇旧日手札，写于${cnYear(date.year())}年的${seasonOf(date.month() + 1)}。`;
  }, [viewPages, total]);

  // 窄屏目录改成抽屉，默认收起，不和书页抢地方
  useEffect(() => {
    if (!window.matchMedia('(min-width: 900px)').matches) setTocOpen(false);
  }, []);

  // 书页对开时平整，鼠标靠近书沿时露出一角
  useEffect(() => {
    const edge = createPaperEdge();
    paperEdgeRef.current = edge;
    return () => {
      edge.dispose();
      paperEdgeRef.current = null;
    };
  }, []);

  // 翻页声跟示例一样，第一次手势之后才会真的响
  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const [soundModule, takesModule] = await Promise.all([import('grabfold/sound'), import('grabfold/sounds')]);
        if (!alive) return;
        const turnSound = soundModule.createPageTurnSound({
          takes: takesModule.defaultPageTurnTakes,
          boardTakes: takesModule.defaultBoardTurnTakes,
          volume: 0.32,
        });
        void turnSound.preload();
        setSound(turnSound);
      } catch {
        // 没有声音也能翻页
      }
    };
    void load();
    return () => {
      alive = false;
    };
  }, []);

  const updateCover = useCallback(() => {
    const frame = frameRef.current;
    const stage = stageRef.current;
    const book = bookRef.current?.book;
    if (!frame || !stage || !book) return;

    const frameRect = frame.getBoundingClientRect();
    const bookRect = book.bookElement.getBoundingClientRect();
    if (bookRect.width < 40) return;

    const bleedX = 17;
    const bleedTop = 15;
    const bleedBottom = 19;
    const box = {
      left: bookRect.left - frameRect.left - bleedX,
      top: bookRect.top - frameRect.top - bleedTop,
      width: bookRect.width + bleedX * 2,
      height: bookRect.height + bleedTop + bleedBottom,
    };

    for (const el of [coverRef.current, castRef.current]) {
      if (!el) continue;
      el.style.left = `${box.left}px`;
      el.style.top = `${box.top}px`;
      el.style.width = `${box.width}px`;
      el.style.height = `${box.height}px`;
    }

    const pager = pagerRef.current;
    if (pager) {
      const stageRect = stage.getBoundingClientRect();
      const top = Math.min(bookRect.bottom - stageRect.top + 30, stageRect.height - 18);
      pager.style.top = `${Math.round(top)}px`;
      pager.style.bottom = 'auto';
    }
  }, []);

  // 视口、字体、书本尺寸变化都要把书壳重新贴回纸边上
  useEffect(() => {
    const id = requestAnimationFrame(updateCover);
    return () => cancelAnimationFrame(id);
  }, [position, mode, yearFilter, updateCover]);

  // 目录开合、字体到位、视口变化都会让书本重新量尺寸：
  // 跟引擎的 resize 事件把书壳与投影重新贴回纸边，第一页才不会是光秃秃的纸
  useEffect(() => {
    const book = bookRef.current?.book;
    if (!book) return;
    return book.on('resize', () => {
      requestAnimationFrame(updateCover);
    });
  }, [mode, yearFilter, updateCover]);

  useEffect(() => {
    const onResize = () => updateCover();
    window.addEventListener('resize', onResize);
    document.fonts?.ready.then(updateCover).catch(() => {});
    return () => window.removeEventListener('resize', onResize);
  }, [updateCover]);

  // 窄屏单页 / 宽屏对开：和示例一样在断点处重建书本，位置跟着读者走
  useEffect(() => {
    const mql = window.matchMedia(SPREAD_MQ);
    reduceRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const next = mql.matches ? 'spread' : 'single';
    if (modeRef.current !== next) {
      setPosition((prev) => mapMode(prev, total, modeRef.current, next));
      modeRef.current = next;
      setMode(next);
    }

    const onChange = (event: MediaQueryListEvent) => {
      const target = event.matches ? 'spread' : 'single';
      if (modeRef.current === target) return;
      setPosition((prev) => mapMode(prev, total, modeRef.current, target));
      modeRef.current = target;
      setMode(target);
    };
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [total]);

  // 日历点外面或按 Esc 收起
  useEffect(() => {
    if (!calOpen) return;
    const onDown = (event: PointerEvent) => {
      if (!calRef.current?.contains(event.target as Node)) setCalOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
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

  // 连着点两下时，第二次留到这一页落定再翻
  const requestTurn = useCallback(
    (dir: Dir) => {
      if (closingRef.current) return;
      const book = bookRef.current;
      if (!book) return;
      if (book.book?.isTurning) {
        pendingTurn.current = dir;
        return;
      }
      // 已经是最后一页，再往后翻就是把本子合上
      const engine = book.book;
      const atEnd = engine ? (modeRef.current === 'spread' ? engine.position >= total : engine.position >= total * 2) : false;
      if (dir === 'next' && atEnd) {
        closeRef.current();
        return;
      }
      pendingTurn.current = null;
      void (dir === 'next' ? book.next() : book.prev());
    },
    [total],
  );

  const handleTurnStart = useCallback(() => {
    flipRef.current?.classList.add('is-turning');
    paperEdgeRef.current?.freeze();
  }, []);

  const handleTurn = useCallback(() => {
    flipRef.current?.classList.remove('is-turning');
    const queued = pendingTurn.current;
    pendingTurn.current = null;
    if (queued) requestTurn(queued);
    requestAnimationFrame(updateCover);
  }, [requestTurn, updateCover]);

  const handlePositionChange = useCallback(
    (next: number) => {
      setPosition(next);
      requestAnimationFrame(updateCover);
    },
    [updateCover],
  );

  // 点击左右半边翻页；拖动交给引擎
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    let tapStart: { x: number; y: number; time: number; id: number } | null = null;

    const interactive = (target: EventTarget | null) =>
      target instanceof Element && !!target.closest('button, a, input, textarea, select, label, [data-no-turn]');

    const onDown = (event: PointerEvent) => {
      if (closingRef.current) return;
      // 鼠标的 isPrimary 在部分环境里是 false，只拦掉多指触摸里的次要点
      if (event.pointerType !== 'mouse' && !event.isPrimary) return;
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      if (interactive(event.target)) return;
      tapStart = { x: event.clientX, y: event.clientY, time: performance.now(), id: event.pointerId };
    };

    const onUp = (event: PointerEvent) => {
      const start = tapStart;
      tapStart = null;
      if (!start || start.id !== event.pointerId) return;
      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      // 最后一页向前拖纸：引擎已经无处可翻，这里直接合上本子
      const engine = bookRef.current?.book;
      const atEnd = engine ? (modeRef.current === 'spread' ? engine.position >= total : engine.position >= total * 2) : false;
      if (atEnd && dx < -40 && Math.abs(dx) > Math.abs(dy)) {
        requestTurn('next');
        return;
      }
      if (Math.hypot(dx, dy) > 8) return;
      if (performance.now() - start.time > 900) return;
      if (String(window.getSelection ? window.getSelection() : '').trim()) return;
      if (closingRef.current) return;
      const target = bookRef.current?.book?.bookElement ?? flipRef.current;
      if (!target) return;
      const rect = target.getBoundingClientRect();
      requestTurn(event.clientX >= rect.left + rect.width / 2 ? 'next' : 'prev');
    };

    frame.addEventListener('pointerdown', onDown, true);
    frame.addEventListener('pointerup', onUp, true);
    return () => {
      frame.removeEventListener('pointerdown', onDown, true);
      frame.removeEventListener('pointerup', onUp, true);
    };
  }, [requestTurn, total]);

  // 滚轮 / 触控板：一格一页，一次两指滑动只翻一页，惯性余波不连翻
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    let wheelSum = 0;
    let wheelSign = 0;
    let wheelUntil = 0;

    const onWheel = (event: WheelEvent) => {
      if (closingRef.current || !bookRef.current) return;
      const target = event.target instanceof Element ? event.target : null;
      const body = target?.closest<HTMLElement>('.body');
      // 正文太长、已经能滚动时，滚轮先让给正文
      if (body && body.scrollHeight > body.clientHeight + 1 && Math.abs(event.deltaY) >= Math.abs(event.deltaX)) return;

      event.preventDefault();
      const now = performance.now();
      if (now < wheelUntil) {
        if (Math.abs(event.deltaY) < 60 && Math.abs(event.deltaX) < 60) wheelUntil = now + 190;
        return;
      }

      const delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
      const sign = Math.sign(delta);
      if (!sign) return;

      const notch = event.deltaMode !== 0 || Math.abs(delta) >= 90;
      if (notch) {
        wheelSum = 0;
        wheelUntil = now + 150;
        requestTurn(delta > 0 ? 'next' : 'prev');
        return;
      }

      if (sign !== wheelSign) {
        wheelSum = 0;
        wheelSign = sign;
      }
      wheelSum += delta;
      if (Math.abs(wheelSum) < 52) return;
      wheelSum = 0;
      wheelUntil = now + 190;
      requestTurn(sign > 0 ? 'next' : 'prev');
    };

    frame.addEventListener('wheel', onWheel, { passive: false });
    return () => frame.removeEventListener('wheel', onWheel);
  }, [requestTurn]);

  // 键盘翻页：Home / End 直接到扉页与尾页
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!bookRef.current || closingRef.current) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;
      if (target?.closest('button, a')) return;

      if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        event.preventDefault();
        requestTurn('prev');
      } else if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') {
        event.preventDefault();
        requestTurn('next');
      } else if (event.key === 'Home') {
        event.preventDefault();
        void bookRef.current.turnTo(modeRef.current === 'spread' ? -1 : -2);
      } else if (event.key === 'End') {
        event.preventDefault();
        void bookRef.current.turnTo(modeRef.current === 'spread' ? total : total * 2 + 1);
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [requestTurn, total]);

  const first = mode === 'spread' ? -1 : -2;
  const last = mode === 'spread' ? total : total * 2 + 1;
  const canPrev = position > first;
  const canNext = position < last;

  useEffect(() => {
    frameRef.current?.classList.toggle('is-turnable', canPrev || canNext);
  }, [canPrev, canNext]);

  const logical = useMemo(() => {
    if (!total || position < 0) return -1;
    if (mode === 'spread') return position >= total ? total : position;
    if (position >= total * 2) return total;
    return Math.floor(position / 2);
  }, [mode, position, total]);

  const current = logical >= 0 && logical < total ? viewPages[logical] : null;
  const monthKey = current
    ? dayjs(current.diaryDate).format('YYYY-MM')
    : total
      ? dayjs(viewPages[0].diaryDate).format('YYYY-MM')
      : '';
  const activeDates = current ? [current.diaryDate] : [];
  const edge = logical < 0 || logical >= total;
  const pageLabel = logical < 0 ? '序' : logical >= total ? '终' : String(logical + 1).padStart(2, '0');

  const marked = useMemo(() => {
    const map = new Map<string, number>();
    viewPages.forEach((item, index) => {
      if (!map.has(item.diaryDate)) map.set(item.diaryDate, index);
    });
    return map;
  }, [viewPages]);

  useEffect(() => {
    const message = !total
      ? '日记本还是空的'
      : logical < 0
        ? '扉页，旧日手札'
        : logical >= total
          ? '尾页，本册读完了'
          : `正在阅读：${viewPages[logical].title || dayjs(viewPages[logical].diaryDate).format('YYYY年M月D日')}，第 ${logical + 1} 篇，共 ${total} 篇`;
    const timer = window.setTimeout(() => {
      if (liveRef.current) liveRef.current.textContent = message;
    }, 220);
    return () => window.clearTimeout(timer);
  }, [logical, total, viewPages]);

  const singleLeaf = (index: number) => {
    if (index === 0) return <DiaryTitleSheet meta={titleMeta} />;
    if (index >= total * 2 + 1) return <DiaryColophonSheet count={total} note={colophonNote} />;
    const entry = Math.floor((index - 1) / 2);
    return (
      <DiaryEntrySheet
        diary={viewPages[entry]}
        side={index % 2 === 1 ? 'left' : 'right'}
        index={entry}
        content={leaves[entry][index % 2 === 1 ? 0 : 1]}
      />
    );
  };

  const renderPage = (page: PageRef) => {
    if (page.kind === 'cover') return page.face === 'inside' ? <DiaryEndpaper /> : null;

    if (mode === 'single') {
      if (page.kind === 'back') return <DiaryVerso />;
      return singleLeaf(page.sheet);
    }

    if (page.kind === 'front') {
      if (page.sheet === 0) return <DiaryTitleSheet meta={titleMeta} />;
      if (page.sheet > total) return <DiaryEndpaper />;
      const entry = page.sheet - 1;
      return <DiaryEntrySheet diary={viewPages[entry]} side="right" index={entry} content={leaves[entry][1]} />;
    }

    if (page.sheet >= total) return <DiaryColophonSheet count={total} note={colophonNote} />;
    return <DiaryEntrySheet diary={viewPages[page.sheet]} side="left" index={page.sheet} content={leaves[page.sheet][0]} />;
  };

  const jumpToIndex = (index: number) => {
    const target = modeRef.current === 'spread' ? index : index * 2;
    if (target !== positionRef.current) void bookRef.current?.turnTo(target);
    setCalOpen(false);
    // 窄屏点完目录就收起，把页面让给书
    if (!window.matchMedia('(min-width: 900px)').matches) setTocOpen(false);
  };

  // 切换年份后整本书只保留该年的日记，从第一篇重新翻开
  const changeYear = (value: number | 'all') => {
    if (value === yearFilter) return;
    setYearFilter(value);
    setCalOpen(false);
    setPosition(0);
    positionRef.current = 0;
    if (!window.matchMedia('(min-width: 900px)').matches) setTocOpen(false);
  };

  const restoreBook = () => {
    frameRef.current?.getAnimations().forEach((animation) => animation.cancel());
    const overlay = handoffRef.current;
    if (overlay) {
      overlay.getAnimations().forEach((animation) => animation.cancel());
      overlay.style.visibility = 'hidden';
    }
    closingRef.current = false;
    setClosing(false);
    setNotice('日记本没合上，稍后再试一次。');
  };

  // 合上之后把硬壳交给浮层，沿直线滑回开门时封面停着的桌面位置
  const handOff = async (locked: Promise<boolean>) => {
    const overlay = handoffRef.current;
    const cover = coverRef.current;
    const saved = readCoverRect() ?? fallbackCoverRect();

    if (!overlay || !cover) {
      if (await locked) router.refresh();
      else restoreBook();
      return;
    }

    if (window.scrollY !== saved.scrollY) window.scrollTo(0, saved.scrollY);
    const rect = cover.getBoundingClientRect();
    const start =
      modeRef.current === 'single'
        ? { left: rect.left, top: rect.top, width: rect.width, height: rect.height }
        : { left: rect.left + rect.width / 2, top: rect.top, width: rect.width / 2, height: rect.height };
    const end = {
      left: saved.left - window.scrollX,
      top: saved.top - window.scrollY,
      width: saved.width,
      height: saved.height,
    };

    overlay.style.left = `${start.left}px`;
    overlay.style.top = `${start.top}px`;
    overlay.style.width = `${start.width}px`;
    overlay.style.height = `${start.height}px`;
    overlay.style.visibility = 'visible';

    overlay.animate([{ opacity: 0 }, { opacity: 1 }], { duration: CLOSE_FADE_MS, easing: 'linear', fill: 'both' });
    frameRef.current?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: CLOSE_FADE_MS, easing: 'linear', fill: 'both' });

    const slide = overlay.animate(
      [
        { left: `${start.left}px`, top: `${start.top}px`, width: `${start.width}px`, height: `${start.height}px` },
        { left: `${end.left}px`, top: `${end.top}px`, width: `${end.width}px`, height: `${end.height}px` },
      ],
      { duration: CLOSE_MOVE_MS, easing: 'cubic-bezier(0.38, 0.06, 0.2, 1)', fill: 'both' },
    );

    const [ok] = await Promise.all([locked, slide.finished.catch(() => undefined)]);
    if (ok) router.refresh();
    else restoreBook();
  };

  const closeBook = () => {
    if (closingRef.current) return;
    closingRef.current = true;
    setCalOpen(false);
    setNotice('');
    setClosing(true);

    const locked = lockDiaryAPI().then(
      () => true,
      () => false,
    );
    if (reduceRef.current) {
      void locked.then((ok) => {
        if (ok) router.refresh();
        else restoreBook();
      });
      return;
    }
    void handOff(locked);
  };

  // requestTurn 比 closeBook 先定义，用 ref 把最新的合上动作交给它
  useEffect(() => {
    closeRef.current = closeBook;
  });

  return (
    <section className={`diary-reader diary-scene ${closing ? 'is-shutting' : ''}`}>
      {total ? (
        <>
          <header className="diary-tools">
            <button
              type="button"
              className="diary-tool"
              onClick={() => setTocOpen((open) => !open)}
              disabled={closing}
              aria-label={tocOpen ? '收起目录' : '打开目录'}
              aria-expanded={tocOpen}
              aria-controls="diary-toc"
            >
              <FiList className="size-4" />
              <span>目录</span>
            </button>

            <button type="button" className="diary-tool" onClick={closeBook} disabled={closing} aria-label="合上日记本">
              <FiLock className="size-4" />
              <span>合上日记本</span>
            </button>

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
                  <DiaryCalendar marked={marked} activeDates={activeDates} month={monthKey} onJump={jumpToIndex} onClose={() => setCalOpen(false)} />
                </div>
              ) : null}
            </div>
          </header>

          <div className="diary-stage">
            {tocOpen ? (
              <DiaryToc
                pages={viewPages}
                years={years}
                yearFilter={yearFilter}
                activeIndex={logical}
                onJump={jumpToIndex}
                onYearChange={changeYear}
                onClose={() => setTocOpen(false)}
              />
            ) : null}

            <div className="book-stage" ref={stageRef}>
              <div className="book-frame" ref={frameRef}>
                <div className="book-cast" ref={castRef} aria-hidden="true" />
                <div className="book-cover" ref={coverRef} aria-hidden="true" />

                <GrabfoldBook
                  key={`${mode}-${yearFilter}`}
                  ref={bookRef}
                  className="flipbook"
                  sheets={mode === 'spread' ? total + 1 : total * 2 + 2}
                  covers="inside"
                  hard={() => true}
                  pageRatio={450 / 680}
                  fit="contain"
                  layout={mode}
                  position={position}
                  duration={FLIP_MS}
                  commitAt={0.18}
                  thickness={9}
                  shadow={0.46}
                  gutter={0.13}
                  lift={22}
                  center
                  keyboard={false}
                  grabBlock={false}
                  label="日记本"
                  sound={sound}
                  renderPage={renderPage}
                  onTurnStart={handleTurnStart}
                  onTurn={handleTurn}
                  onPositionChange={handlePositionChange}
                />
              </div>

              <div ref={pagerRef} className={`pager ${edge ? 'is-edge' : ''}`}>
                <span className={`entry-number ${edge ? 'is-word' : ''}`}>{pageLabel}</span>
                <span className="pager-sep">/</span>
                <span className="entry-total">{String(total).padStart(2, '0')}</span>
              </div>
            </div>

            <div className="a11y-turn">
              <button type="button" onClick={() => requestTurn('prev')} disabled={!canPrev} aria-keyshortcuts="ArrowLeft PageUp">
                上一篇
              </button>
              <button type="button" onClick={() => requestTurn('next')} disabled={closing || (!canNext && logical < total)} aria-keyshortcuts="ArrowRight PageDown">
                下一篇
              </button>
            </div>

            <div ref={liveRef} className="sr-only" aria-live="polite" />
          </div>

          <div ref={handoffRef} aria-hidden className="diary-handoff">
            <DiaryCoverFront author={author?.name} />
          </div>
        </>) : (
        <div className="diary-stage">
          <p className="diary-blank">本子还是空的。主理人在后台写下第一页，这里就有字了。</p>
        </div>
      )}

      <p aria-live="polite" className="diary-notice">
        {notice}
      </p>
    </section>
  );
}
