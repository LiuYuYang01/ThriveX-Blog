'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { Milestone } from '@/types/app/milestone';

const SIDE_PAD = 400;
const CARD_SP = 560;
const CARD_W = 300;
const WAVE_AMP = 60;
const CONN_GAP = 45;
const WAVE_PERIOD = 1120;
const CARD_H_ESTIMATE = 260;

const WK = (2 * Math.PI) / WAVE_PERIOD;
const WPHI = Math.PI / 2 - WK * SIDE_PAD;

function formatEventDate(value: number) {
  return new Date(value)
    .toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
    .replace(/\//g, '.');
}

function extractYear(value: number) {
  return String(new Date(value).getFullYear());
}

interface MilestonePageClientProps {
  list: Milestone[];
}

interface LayoutItem {
  event: Milestone;
  index: number;
  x: number;
  waveY: number;
  isAbove: boolean;
  delay: number;
  cardTop: number;
  connTop: number;
  connHeight: number;
}

function buildWavePath(totalW: number, centerY: number, offsetY = 0) {
  const pts = 300;
  let d = '';
  for (let i = 0; i <= pts; i++) {
    const x = (totalW / pts) * i;
    const y = centerY + WAVE_AMP * Math.sin(WK * x + WPHI) + offsetY;
    d += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
  }
  return d;
}

function buildStarsShadow() {
  const w = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const h = typeof window !== 'undefined' ? window.innerHeight : 800;
  const shadows: string[] = [];
  for (let i = 0; i < 100; i++) {
    const ox = Math.round(Math.random() * w);
    const oy = Math.round(Math.random() * h);
    const op = (Math.random() * 0.25 + 0.05).toFixed(2);
    shadows.push(`${ox}px ${oy}px 0 1px rgba(255,255,255,${op})`);
  }
  return shadows.join(',');
}

export default function MilestonePageClient({ list }: MilestonePageClientProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);
  const [viewportH, setViewportH] = useState(800);
  const [hintHidden, setHintHidden] = useState(false);
  const [starsShadow, setStarsShadow] = useState('');
  const dragState = useRef({ isDown: false, startX: 0, scrollLeft: 0 });

  const events = useMemo(
    () => [...list].sort((a, b) => a.eventDate - b.eventDate || a.id - b.id),
    [list],
  );

  const centerY = Math.max(viewportH, 600) / 2;
  const totalW = events.length > 0 ? SIDE_PAD * 2 + CARD_SP * (events.length - 1) : 1200;
  const wavePath = useMemo(() => buildWavePath(totalW, centerY), [totalW, centerY]);
  const waveEchoPath = useMemo(() => buildWavePath(totalW, centerY, 3), [totalW, centerY]);

  const layoutItems = useMemo<LayoutItem[]>(() => {
    const waveY = (x: number) => centerY + WAVE_AMP * Math.sin(WK * x + WPHI);

    return events.map((event, index) => {
      const x = SIDE_PAD + CARD_SP * index;
      const dy = waveY(x);
      const isAbove = index % 2 === 0;
      const delay = 1.5 + index * 0.35;

      let cardTop: number;
      let connTop: number;
      let connHeight: number;

      if (isAbove) {
        cardTop = dy - CONN_GAP - CARD_H_ESTIMATE;
        connTop = cardTop + CARD_H_ESTIMATE;
        connHeight = CONN_GAP;
      } else {
        cardTop = dy + CONN_GAP;
        connTop = dy;
        connHeight = CONN_GAP;
      }

      return { event, index, x, waveY: dy, isAbove, delay, cardTop, connTop, connHeight };
    });
  }, [events, centerY]);

  useEffect(() => {
    setStarsShadow(buildStarsShadow());
    const onResize = () => setViewportH(Math.max(window.innerHeight, 600));
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const onScroll = useCallback(() => {
    const sc = scrollRef.current;
    if (!sc) return;
    const sl = sc.scrollLeft;
    if (starsRef.current) {
      starsRef.current.style.transform = `translateX(${-sl * 0.05}px)`;
    }
    if (!hintHidden && sl > 60) {
      setHintHidden(true);
    }
  }, [hintHidden]);

  useEffect(() => {
    const sc = scrollRef.current;
    if (!sc) return;

    const onMouseDown = (e: MouseEvent) => {
      dragState.current = { isDown: true, startX: e.pageX, scrollLeft: sc.scrollLeft };
      sc.classList.add('is-dragging');
    };
    const onMouseUp = () => {
      dragState.current.isDown = false;
      sc.classList.remove('is-dragging');
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!dragState.current.isDown) return;
      e.preventDefault();
      sc.scrollLeft = dragState.current.scrollLeft - (e.pageX - dragState.current.startX) * 1.5;
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      sc.scrollLeft += (e.deltaY || e.deltaX) * 1.5;
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        sc.scrollLeft += 300;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        sc.scrollLeft -= 300;
      }
    };

    sc.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);
    sc.addEventListener('wheel', onWheel, { passive: false });
    sc.addEventListener('scroll', onScroll);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      sc.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mousemove', onMouseMove);
      sc.removeEventListener('wheel', onWheel);
      sc.removeEventListener('scroll', onScroll);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onScroll]);

  return (
    <div className="milestone-page">
      <div className="bg-mesh" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div ref={starsRef} className="stars" style={{ boxShadow: starsShadow }} />
      <div className="vignette" />
      <div className="grain" />

      <header className="page-header">
        <h1>人生里程碑</h1>
      </header>

      {events.length === 0 ? (
        <div className="empty-state">请在后台添加里程碑事件</div>
      ) : (
        <div ref={scrollRef} className="scroll-container">
          <div className="timeline-track" style={{ width: totalW }}>
            <svg
              className="wave-svg"
              width={totalW}
              height={viewportH}
              style={{ width: totalW, height: '100%' }}
            >
              <defs>
                <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(232,160,48,.06)" />
                  <stop offset="15%" stopColor="rgba(232,160,48,.5)" />
                  <stop offset="50%" stopColor="rgba(240,180,60,.7)" />
                  <stop offset="85%" stopColor="rgba(232,160,48,.5)" />
                  <stop offset="100%" stopColor="rgba(232,160,48,.06)" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="g" />
                  <feMerge>
                    <feMergeNode in="g" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <path d={wavePath} className="wave-glow" />
              <path d={wavePath} className="wave-main" />
              <path d={waveEchoPath} className="wave-echo" />
            </svg>

            {layoutItems.map((item) => (
              <div key={item.event.id}>
                <div
                  className="year-label"
                  style={{
                    left: item.x,
                    top: item.isAbove ? item.waveY + 70 : item.waveY - 70,
                  }}
                >
                  {extractYear(item.event.eventDate)}
                </div>

                <div
                  className="timeline-dot"
                  style={{ left: item.x, top: item.waveY, animationDelay: `${item.delay}s` }}
                >
                  <div className="dot-core" />
                  <div className="dot-ring" />
                  <div className="dot-ring-outer" />
                </div>

                <div
                  className={`connector ${item.isAbove ? 'from-above' : 'from-below'}`}
                  style={{
                    left: item.x,
                    top: item.connTop,
                    height: item.connHeight,
                    animationDelay: `${item.delay + 0.1}s`,
                  }}
                />

                <div
                  className={`glass-card visible ${item.isAbove ? 'slide-down' : 'slide-up'}`}
                  style={{
                    left: item.x - CARD_W / 2,
                    top: item.cardTop,
                    width: CARD_W,
                    animationDelay: `${item.delay + 0.2}s`,
                  }}
                >
                  <div className="card-image-wrap">
                    {item.event.image ? (
                      <img
                        className="card-image"
                        src={item.event.image}
                        alt={item.event.title}
                        loading="lazy"
                      />
                    ) : (
                      <div className="card-image" />
                    )}
                  </div>
                  <div className="card-body">
                    <div className="card-date">{formatEventDate(item.event.eventDate)}</div>
                    <div className="card-title">{item.event.title}</div>
                    <div className="card-desc">{item.event.description}</div>
                    <div className="card-footer">
                      <div className="card-tags">
                        {(item.event.tags ?? []).map((tag) => (
                          <span key={tag} className="tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={`scroll-hint${hintHidden ? ' hidden' : ''}`}>
        <span className="arr">←</span>
        <span>拖拽探索</span>
        <span className="arr">→</span>
      </div>
    </div>
  );
}
