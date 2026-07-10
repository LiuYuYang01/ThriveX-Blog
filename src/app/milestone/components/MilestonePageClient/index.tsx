'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import PhotoPreview, { type PhotoItem } from '@/ThriveUI/PhotoPreview';
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

const rootClass = "milestone-page fixed inset-0 z-60 h-screen w-screen overflow-hidden bg-[#06060f] font-['Noto_Serif_SC',serif] text-[#e8e4dc] selection:bg-[rgba(232,160,48,0.3)] selection:text-white";

const orbClass = 'pointer-events-none fixed z-1 rounded-full opacity-20 blur-[80px]';
const starsClass = 'stars pointer-events-none fixed left-0 top-0 z-1 size-px will-change-transform';
const timelineDotClass = 'timeline-dot absolute z-20 opacity-0';
const glassCardClass = 'glass-card visible absolute z-25 w-[300px] overflow-hidden rounded-[18px] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.075),rgba(255,255,255,0.026))] opacity-0 shadow-[0_4px_24px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-3xl backdrop-saturate-[1.25] will-change-transform transition-[transform,box-shadow] duration-700 ease-out hover:!-translate-y-[7px] hover:!scale-[1.018] hover:shadow-[0_24px_70px_rgba(0,0,0,0.45),0_0_48px_rgba(232,160,48,0.12),inset_0_1px_0_rgba(255,255,255,0.1)]';

function formatEventDate(value: number) {
  return new Date(value).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.');
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

function buildStarsShadow(count = 100, opacity = 0.25) {
  const w = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const h = typeof window !== 'undefined' ? window.innerHeight : 800;
  const shadows: string[] = [];

  for (let i = 0; i < count; i++) {
    const ox = Math.round(Math.random() * w);
    const oy = Math.round(Math.random() * h);
    const op = (Math.random() * opacity + 0.05).toFixed(2);
    shadows.push(`${ox}px ${oy}px 1px rgba(255,255,255,${op})`);
  }

  return shadows.join(',');
}

export default function MilestonePageClient({ list }: MilestonePageClientProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);
  const starsNearRef = useRef<HTMLDivElement>(null);
  const auroraRef = useRef<HTMLDivElement>(null);
  const [viewportH, setViewportH] = useState(800);
  const [hintHidden, setHintHidden] = useState(false);
  const [starsShadow, setStarsShadow] = useState('');
  const [starsNearShadow, setStarsNearShadow] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const dragState = useRef({ isDown: false, startX: 0, scrollLeft: 0 });

  const events = useMemo(() => [...list].sort((a, b) => a.eventDate - b.eventDate || a.id - b.id), [list]);
  const previewPhotos = useMemo<PhotoItem[]>(() => events.filter((event) => event.image).map((event) => ({ id: `${event.id}`, url: event.image!, alt: event.title })), [events]);

  const openPreview = useCallback(
    (id: number) => {
      const index = previewPhotos.findIndex((photo) => photo.id === `${id}`);
      if (index < 0) return;
      setPreviewIndex(index);
      setPreviewOpen(true);
    },
    [previewPhotos],
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
    setStarsNearShadow(buildStarsShadow(45, 0.45));
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
  }, [previewOpen]);

  const onScroll = useCallback(() => {
    const sc = scrollRef.current;
    if (!sc) return;
    const sl = sc.scrollLeft;
    if (starsRef.current) {
      starsRef.current.style.transform = `translateX(${-sl * 0.05}px)`;
    }
    if (starsNearRef.current) {
      starsNearRef.current.style.transform = `translateX(${-sl * 0.16}px)`;
    }
    if (auroraRef.current) {
      auroraRef.current.style.transform = `translate3d(${-sl * 0.08}px,0,0) rotate(-8deg)`;
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
      if (previewOpen) return;
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
  }, [onScroll, previewOpen]);

  return (
    <div className={rootClass}>
      <div className="bg-mesh fixed inset-0 z-0" />
      <div className={`${orbClass} orb-1 left-[-100px] top-[-80px] size-[350px] bg-[rgba(100,50,200,0.5)]`} />
      <div className={`${orbClass} orb-2 bottom-[-60px] right-[-40px] size-[280px] bg-[rgba(30,70,180,0.4)]`} />
      <div className={`${orbClass} orb-3 left-[55%] top-[35%] size-[200px] bg-[rgba(200,120,40,0.25)]`} />
      <div ref={starsRef} className={starsClass} style={{ boxShadow: starsShadow }} />
      <div ref={starsNearRef} className={`${starsClass} stars-near z-4 opacity-70 drop-shadow-[0_0_6px_rgba(232,160,48,0.45)]`} style={{ boxShadow: starsNearShadow }} />
      <div ref={auroraRef} className="aurora-ribbon pointer-events-none fixed left-[-12vw] top-[18%] z-2 h-[42vh] w-[135vw] rotate-[-8deg] opacity-30 blur-3xl will-change-transform" />
      <div className="pointer-events-none fixed inset-0 z-2 bg-[radial-gradient(ellipse_at_50%_50%,transparent_35%,rgba(0,0,0,0.45)_100%)]" />
      <div className="grain pointer-events-none fixed inset-0 z-3 bg-size-[200px] bg-repeat opacity-[0.03]" />

      <header className={`page-header pointer-events-none fixed left-[42px] top-[34px] z-100 opacity-0 transition-[transform,opacity] duration-500 ease-out ${hintHidden ? 'translate-y-[-10px] scale-[0.92] opacity-40' : ''}`}>
        <div className="mb-2 font-['DM_Mono',monospace] text-[11px] tracking-[0.32em] text-[rgba(232,160,48,0.58)]">LIFE MILESTONES</div>
        <h1 className="font-['Noto_Serif_SC',serif] text-[clamp(34px,5vw,68px)] font-bold tracking-[0.08em] text-[#f6efe3] [text-shadow:0_0_28px_rgba(232,160,48,0.22)]">人生里程碑</h1>
        <p className="mt-2.5 max-w-[340px] text-[13px] leading-[1.8] tracking-[0.08em] text-[rgba(232,224,210,0.46)]">沿着时间的轨迹，回看每一个闪光瞬间</p>
        <div className="mt-2.5 h-px w-9 bg-[linear-gradient(to_right,rgba(232,160,48,0.4),transparent)]" />
      </header>

      {events.length === 0 ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center font-['DM_Mono',monospace] text-[13px] tracking-widest text-white/35">请在后台添加里程碑事件</div>
      ) : (
        <div ref={scrollRef} className="scroll-container relative z-10 h-screen w-screen cursor-grab overflow-x-auto overflow-y-hidden [-ms-overflow-style:none] scrollbar-none active:cursor-grabbing">
          <div className="relative h-screen min-h-[600px]" style={{ width: totalW }}>
            <svg className="pointer-events-none absolute left-0 top-0 overflow-visible" width={totalW} height={viewportH} style={{ width: totalW, height: '100%' }}>
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
              <path d={wavePath} className="wave-comet" />
            </svg>

            {layoutItems.map((item) => (
              <div key={item.event.id}>
                <div
                  className="pointer-events-none absolute z-5 select-none font-['Playfair_Display',serif] text-[64px] font-normal italic text-white/2.5 -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: item.x,
                    top: item.isAbove ? item.waveY + 70 : item.waveY - 70,
                  }}
                >
                  {extractYear(item.event.eventDate)}
                </div>

                <div className={timelineDotClass} style={{ left: item.x, top: item.waveY, animationDelay: `${item.delay}s` }}>
                  <div className="absolute left-[18px] top-[-28px] font-['DM_Mono',monospace] text-[10px] tracking-[0.12em] text-[rgba(255,236,170,0.5)] [text-shadow:0_0_20px_rgba(232,160,48,0.55)]">{String(item.index + 1).padStart(2, '0')}</div>
                  <div className="dot-orbit absolute inset-[-22px] rounded-full border border-[rgba(232,160,48,0.18)] border-b-transparent border-l-[rgba(255,236,170,0.75)]" />
                  <div className="size-3 rounded-full bg-[linear-gradient(135deg,#f0c060,#d89828)] shadow-[0_0_15px_rgba(232,160,48,0.5),0_0_30px_rgba(232,160,48,0.15)]" />
                  <div className="dot-ring absolute inset-[-8px] rounded-full border-[1.5px] border-[rgba(232,160,48,0.2)]" />
                  <div className="dot-ring-outer absolute inset-[-16px] rounded-full border border-[rgba(232,160,48,0.08)]" />
                </div>

                <div
                  className={`connector absolute z-15 w-px opacity-0 ${item.isAbove ? 'from-above' : 'from-below'}`}
                  style={{
                    left: item.x,
                    top: item.connTop,
                    height: item.connHeight,
                    animationDelay: `${item.delay + 0.1}s`,
                  }}
                />

                <div
                  className={`${glassCardClass} ${item.isAbove ? 'slide-down' : 'slide-up'}`}
                  style={{
                    left: item.x - CARD_W / 2,
                    top: item.cardTop,
                    width: CARD_W,
                    animationDelay: `${item.delay + 0.2}s`,
                  }}
                >
                  <div className="card-image-wrap relative -mb-px overflow-hidden">
                    {item.event.image ? (
                      <button type="button" className="group relative block w-full cursor-pointer overflow-hidden border-0 bg-transparent p-0 outline-0 appearance-none" onClick={() => openPreview(item.event.id)} aria-label={`预览${item.event.title}`}>
                        <img className="card-image block h-[140px] w-full object-cover transition-transform duration-850 ease-out will-change-transform group-hover:scale-[1.04]" src={item.event.image} alt={item.event.title} loading="lazy" />
                        <span className="absolute inset-0 z-3 grid translate-y-2 place-items-center bg-[rgba(6,6,15,0.36)] text-xs tracking-[0.18em] text-white/85 opacity-0 transition-[opacity,transform] duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">点击预览</span>
                      </button>
                    ) : (
                      <div className="card-image h-[140px] w-full bg-[linear-gradient(135deg,rgba(50,30,80,0.4),rgba(30,40,70,0.4))]" />
                    )}
                  </div>
                  <div className="relative z-2 bg-[rgba(14,12,28,0.72)] px-4 pb-3 pt-[15px]">
                    <div className="mb-1 font-['DM_Mono',monospace] text-[10.5px] tracking-[0.12em] text-[rgba(232,160,48,0.65)]">{formatEventDate(item.event.eventDate)}</div>
                    <div className="mb-1.5 font-['Noto_Serif_SC',serif] text-base font-semibold leading-[1.35] text-[#f0ece4]">{item.event.title}</div>
                    <div className="mb-2.5 line-clamp-2 overflow-hidden text-xs leading-[1.75] text-[rgba(228,224,216,0.5)]">{item.event.description}</div>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-[5px]">
                        {(item.event.tags ?? []).map((tag) => (
                          <span key={tag} className="rounded-[20px] border border-white/10 bg-white/4 px-[7px] py-0.5 font-['DM_Mono',monospace] text-[9.5px] tracking-wider text-white/40">
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

      <div className={`fixed bottom-6 left-1/2 z-100 flex -translate-x-1/2 items-center gap-2 font-['DM_Mono',monospace] text-[10.5px] tracking-[0.15em] text-white/20 transition-opacity duration-1000 pointer-events-none ${hintHidden ? 'opacity-0' : ''}`}>
        <span className="arr">←</span>
        <span>拖拽探索</span>
        <span className="arr">→</span>
      </div>

      <PhotoPreview open={previewOpen} photos={previewPhotos} index={previewIndex} onClose={() => setPreviewOpen(false)} onIndexChange={setPreviewIndex} />
    </div>
  );
}
