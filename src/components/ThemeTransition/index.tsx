'use client';

import { useEffect, useRef, useState } from 'react';
import { useConfigStore } from '@/stores';
import { subscribeThemeTransition } from '@/utils/themeTransition';
import './index.scss';

const DURATION_MS = 1000;
const EXIT_MS = 260;

type Direction = 'to-dark' | 'to-light';

function applyThemeClass(dark: boolean) {
  document.documentElement.classList.toggle('dark', dark);
}

function setSwitching(on: boolean) {
  document.documentElement.classList.toggle('theme-switching', on);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** t: 0 左下 → 0.5 顶心 → 1 右下 */
function arcPos(t: number, w: number, h: number) {
  return {
    x: w * t,
    y: h * 0.18 + (t - 0.5) * (t - 0.5) * h * 2.4,
  };
}

/** 绘制昼夜天空渐变，t: 0 白天 → 1 黑夜 */
function drawSky(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  const day = [
    [110, 175, 230],
    [160, 210, 245],
    [210, 232, 250],
    [255, 232, 200],
  ] as const;
  const night = [
    [8, 12, 28],
    [14, 20, 42],
    [24, 30, 58],
    [42, 28, 62],
  ] as const;

  const g = ctx.createLinearGradient(0, 0, 0, h);
  const stops = [0, 0.35, 0.7, 1];
  for (let i = 0; i < 4; i++) {
    const r = (day[i][0] + (night[i][0] - day[i][0]) * t) | 0;
    const gCh = (day[i][1] + (night[i][1] - day[i][1]) * t) | 0;
    const b = (day[i][2] + (night[i][2] - day[i][2]) * t) | 0;
    g.addColorStop(stops[i], `rgb(${r},${gCh},${b})`);
  }
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

/** 预绘太阳：仅球体，无光晕 */
function createSunSprite(size: number) {
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d')!;
  const cx = size / 2;
  const cy = size / 2;
  const bodyR = size * 0.32;

  const body = ctx.createRadialGradient(cx - bodyR * 0.25, cy - bodyR * 0.3, bodyR * 0.05, cx, cy, bodyR);
  body.addColorStop(0, '#fffef5');
  body.addColorStop(0.25, '#fff1a8');
  body.addColorStop(0.65, '#ffd25a');
  body.addColorStop(1, '#ffa824');
  ctx.beginPath();
  ctx.arc(cx, cy, bodyR, 0, Math.PI * 2);
  ctx.fillStyle = body;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx - bodyR * 0.28, cy - bodyR * 0.3, bodyR * 0.18, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
  ctx.fill();

  return c;
}

/** 预绘月亮：球体 + 陨石坑，无光晕 */
function createMoonSprite(size: number) {
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d')!;
  const cx = size / 2;
  const cy = size / 2;
  const bodyR = size * 0.32;

  const body = ctx.createRadialGradient(cx - bodyR * 0.35, cy - bodyR * 0.35, bodyR * 0.12, cx, cy, bodyR);
  body.addColorStop(0, '#f8fafc');
  body.addColorStop(0.55, '#dbe4f0');
  body.addColorStop(1, '#9aabc0');
  ctx.beginPath();
  ctx.arc(cx, cy, bodyR, 0, Math.PI * 2);
  ctx.fillStyle = body;
  ctx.fill();

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, bodyR, 0, Math.PI * 2);
  ctx.clip();

  const shade = ctx.createRadialGradient(cx + bodyR * 0.55, cy, bodyR * 0.2, cx + bodyR * 0.2, cy, bodyR * 1.1);
  shade.addColorStop(0, 'rgba(80, 100, 130, 0.35)');
  shade.addColorStop(1, 'rgba(80, 100, 130, 0)');
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, size, size);

  const craters: [number, number, number][] = [
    [-0.15, -0.2, 0.14],
    [0.2, -0.05, 0.1],
    [-0.05, 0.25, 0.12],
    [0.28, 0.22, 0.08],
    [-0.32, 0.08, 0.07],
  ];
  for (const [ox, oy, sr] of craters) {
    const x = cx + ox * bodyR;
    const y = cy + oy * bodyR;
    const cr = sr * bodyR;
    ctx.beginPath();
    ctx.arc(x, y, cr, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(120, 140, 165, 0.35)';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x - cr * 0.25, y - cr * 0.25, cr * 0.55, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.fill();
  }
  ctx.restore();

  return c;
}

function drawSprite(
  ctx: CanvasRenderingContext2D,
  sprite: HTMLCanvasElement,
  x: number,
  y: number,
  size: number,
  alpha: number,
) {
  if (alpha <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.drawImage(sprite, x - size / 2, y - size / 2, size, size);
  ctx.restore();
}

export default function ThemeTransition() {
  const setIsDark = useConfigStore((s) => s.setIsDark);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const runningRef = useRef(false);
  const directionRef = useRef<Direction>('to-dark');
  const targetDarkRef = useRef(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const sync = () => {
      applyThemeClass(useConfigStore.getState().isDark);
    };

    if (useConfigStore.persist.hasHydrated()) {
      sync();
      return;
    }

    return useConfigStore.persist.onFinishHydration(sync);
  }, []);

  useEffect(() => {
    return subscribeThemeTransition((nextDark) => {
      if (runningRef.current) return;
      if (useConfigStore.getState().isDark === nextDark) return;

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setIsDark(nextDark);
        applyThemeClass(nextDark);
        return;
      }

      runningRef.current = true;
      targetDarkRef.current = nextDark;
      directionRef.current = nextDark ? 'to-dark' : 'to-light';
      setSwitching(true);
      setActive(true);
    });
  }, [setIsDark]);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
    if (!ctx) return;

    const toDark = directionRef.current === 'to-dark';
    const targetDark = targetDarkRef.current;
    let themeApplied = false;
    let raf = 0;
    let stopped = false;

    const starX: number[] = [];
    const starY: number[] = [];
    const starS: number[] = [];
    for (let i = 0; i < 12; i++) {
      starX.push(Math.random());
      starY.push(Math.random() * 0.5);
      starS.push(Math.random() > 0.7 ? 2.5 : 1.5);
    }

    const spriteSize = 256;
    const sunSprite = createSunSprite(spriteSize);
    const moonSprite = createMoonSprite(spriteSize);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const start = performance.now();
    const total = DURATION_MS + EXIT_MS;

    const applyTheme = () => {
      if (themeApplied) return;
      themeApplied = true;
      setIsDark(targetDark);
      applyThemeClass(targetDark);
    };

    const finish = () => {
      applyTheme();
      runningRef.current = false;
      setSwitching(false);
      setActive(false);
    };

    const frame = (now: number) => {
      if (stopped) return;

      const elapsed = now - start;
      const w = canvas.width;
      const h = canvas.height;
      const size = Math.min(w * 0.18, 120);

      if (!themeApplied && elapsed >= 50) applyTheme();

      const moveT = Math.min(1, elapsed / DURATION_MS);
      const e = easeInOutCubic(moveT);
      const exitT = elapsed <= DURATION_MS ? 0 : Math.min(1, (elapsed - DURATION_MS) / EXIT_MS);
      canvas.style.opacity = exitT > 0 ? String(1 - exitT) : '1';

      drawSky(ctx, w, h, toDark ? e : 1 - e);

      const starA = toDark ? e : 1 - e;
      if (starA > 0.02) {
        ctx.globalAlpha = starA;
        ctx.fillStyle = '#fff';
        for (let i = 0; i < starX.length; i++) {
          ctx.fillRect(starX[i] * w, starY[i] * h, starS[i], starS[i]);
        }
        ctx.globalAlpha = 1;
      }

      const setPos = arcPos(lerp(0.5, 1, e), w, h);
      const risePos = arcPos(lerp(0, 0.5, e), w, h);
      const setA = 1 - e * 0.92;
      const riseA = Math.min(1, e * 1.25);

      if (toDark) {
        drawSprite(ctx, sunSprite, setPos.x, setPos.y, size, setA);
        drawSprite(ctx, moonSprite, risePos.x, risePos.y, size * 0.9, riseA);
      } else {
        drawSprite(ctx, moonSprite, setPos.x, setPos.y, size * 0.9, setA);
        drawSprite(ctx, sunSprite, risePos.x, risePos.y, size, riseA);
      }

      if (elapsed < total) {
        raf = requestAnimationFrame(frame);
      } else {
        finish();
      }
    };

    drawSky(ctx, canvas.width, canvas.height, toDark ? 0 : 1);
    canvas.style.opacity = '1';
    raf = requestAnimationFrame(frame);

    const onResize = () => resize();
    window.addEventListener('resize', onResize);

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      runningRef.current = false;
      setSwitching(false);
      applyThemeClass(useConfigStore.getState().isDark);
    };
  }, [active, setIsDark]);

  if (!active) return null;

  return <canvas ref={canvasRef} className="theme-transition" aria-hidden="true" />;
}
