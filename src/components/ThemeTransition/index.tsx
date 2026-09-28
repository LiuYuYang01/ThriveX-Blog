'use client';

import { useEffect, useRef, useState } from 'react';
import { useConfigStore } from '@/stores';
import { subscribeThemeTransition } from '@/utils/themeTransition';
import './index.scss';

const MOVE_MS = 1150;
const FADE_MS = 420;
const SPRITE_SIZE = 640;

type Direction = 'to-dark' | 'to-light';
type RGB = [number, number, number];
type RGBA = [number, number, number, number];

function applyThemeClass(dark: boolean) {
  document.documentElement.classList.toggle('dark', dark);
}

function setSwitching(on: boolean) {
  document.documentElement.classList.toggle('theme-switching', on);
}

function clamp01(v: number) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

/** 二次贝塞尔取点，太阳/月亮沿此弧线升落 */
function bez(p0: [number, number], p1: [number, number], p2: [number, number], t: number): [number, number] {
  const m = 1 - t;
  return [
    m * m * p0[0] + 2 * m * t * p1[0] + t * t * p2[0],
    m * m * p0[1] + 2 * m * t * p1[1] + t * t * p2[1],
  ];
}

function lerpRGBA(a: RGBA, b: RGBA, t: number): RGBA {
  return [
    Math.round(lerp(a[0], b[0], t)),
    Math.round(lerp(a[1], b[1], t)),
    Math.round(lerp(a[2], b[2], t)),
    lerp(a[3], b[3], t),
  ];
}

function css(c: RGBA) {
  return `rgba(${c[0]},${c[1]},${c[2]},${c[3].toFixed(3)})`;
}

/** 天空色带，d: 0 白昼 → 1 星夜 */
const SKY_STOPS = [0, 0.34, 0.64, 0.85, 1];
const SKY_DAY: RGB[] = [
  [92, 160, 224],
  [150, 200, 240],
  [208, 232, 248],
  [255, 229, 191],
  [255, 206, 164],
];
const SKY_NIGHT: RGB[] = [
  [5, 8, 20],
  [11, 17, 40],
  [19, 28, 58],
  [34, 38, 76],
  [56, 44, 80],
];

interface Star {
  x: number;
  y: number;
  r: number;
  ph: number;
  sp: number;
  br: number;
}

/** 星空字段懒初始化，多次播放共用同一片星空 */
let starField: Star[] | null = null;
function getStars() {
  if (!starField) {
    starField = [];
    for (let i = 0; i < 140; i++) {
      starField.push({
        x: Math.random(),
        y: Math.pow(Math.random(), 1.5) * 0.82,
        r: 0.4 + Math.random() * 1.6,
        ph: Math.random() * Math.PI * 2,
        sp: 0.5 + Math.random() * 1.6,
        br: 0.3 + Math.random() * 0.7,
      });
    }
  }
  return starField;
}

function drawSky(ctx: CanvasRenderingContext2D, w: number, h: number, d: number) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  for (let i = 0; i < SKY_STOPS.length; i++) {
    const day = SKY_DAY[i];
    const night = SKY_NIGHT[i];
    const r = Math.round(lerp(day[0], night[0], d));
    const gg = Math.round(lerp(day[1], night[1], d));
    const b = Math.round(lerp(day[2], night[2], d));
    g.addColorStop(SKY_STOPS[i], `rgb(${r},${gg},${b})`);
  }
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

/** 星星随夜色淡入并闪烁 */
function drawStars(ctx: CanvasRenderingContext2D, w: number, h: number, d: number, time: number) {
  const a = clamp01((d - 0.1) / 0.55);
  if (a <= 0.01) return;
  ctx.save();
  ctx.fillStyle = '#ffffff';
  const stars = getStars();
  for (let i = 0; i < stars.length; i++) {
    const s = stars[i];
    const tw = 0.7 + 0.3 * Math.sin(time * 0.004 * s.sp + s.ph);
    ctx.globalAlpha = a * s.br * tw;
    ctx.beginPath();
    ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

const SUN_BODY_RATIO = 0.16;
const MOON_BODY_RATIO = 0.16;

/** 预绘太阳：本体 + 三层 lighter 光晕 */
function createSunSprite(size: number) {
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d')!;
  const cx = size / 2;
  const cy = size / 2;
  const bodyR = size * SUN_BODY_RATIO;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.globalCompositeOperation = 'lighter';

  let g = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.45);
  g.addColorStop(0.0, 'rgba(255, 178, 92, 0.075)');
  g.addColorStop(0.14, 'rgba(255, 166, 82, 0.052)');
  g.addColorStop(0.3, 'rgba(255, 154, 72, 0.032)');
  g.addColorStop(0.5, 'rgba(255, 142, 62, 0.017)');
  g.addColorStop(0.72, 'rgba(255, 128, 52, 0.006)');
  g.addColorStop(1.0, 'rgba(255, 112, 42, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);

  g = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.32);
  g.addColorStop(0.0, 'rgba(255, 208, 124, 0.13)');
  g.addColorStop(0.18, 'rgba(255, 198, 110, 0.085)');
  g.addColorStop(0.4, 'rgba(255, 186, 96, 0.045)');
  g.addColorStop(0.66, 'rgba(255, 172, 84, 0.014)');
  g.addColorStop(1.0, 'rgba(255, 158, 74, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);

  g = ctx.createRadialGradient(cx, cy, 0, cx, cy, bodyR * 2.8);
  g.addColorStop(0.0, 'rgba(255, 244, 190, 0.20)');
  g.addColorStop(0.22, 'rgba(255, 234, 160, 0.12)');
  g.addColorStop(0.46, 'rgba(255, 220, 128, 0.058)');
  g.addColorStop(0.7, 'rgba(255, 206, 108, 0.018)');
  g.addColorStop(1.0, 'rgba(255, 192, 92, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);

  ctx.globalCompositeOperation = 'source-over';

  const body = ctx.createRadialGradient(cx, cy, 0, cx, cy, bodyR);
  body.addColorStop(0.0, '#ffffff');
  body.addColorStop(0.28, '#fff7d4');
  body.addColorStop(0.58, '#ffe27c');
  body.addColorStop(0.82, '#ffbe38');
  body.addColorStop(1.0, '#ff9518');
  ctx.beginPath();
  ctx.arc(cx, cy, bodyR, 0, Math.PI * 2);
  ctx.fillStyle = body;
  ctx.fill();

  ctx.globalCompositeOperation = 'lighter';
  g = ctx.createRadialGradient(cx, cy, bodyR * 0.82, cx, cy, bodyR * 1.28);
  g.addColorStop(0.0, 'rgba(255, 250, 220, 0.22)');
  g.addColorStop(0.45, 'rgba(255, 240, 180, 0.08)');
  g.addColorStop(1.0, 'rgba(255, 230, 150, 0)');
  ctx.beginPath();
  ctx.arc(cx, cy, bodyR * 1.28, 0, Math.PI * 2);
  ctx.fillStyle = g;
  ctx.fill();

  return c;
}

/** 预绘月亮：本体边缘渐透明融入光晕，月海 + 球面自阴影均柔边，无亮环硬边 */
function createMoonSprite(size: number) {
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d')!;
  const cx = size / 2;
  const cy = size / 2;
  const bodyR = size * MOON_BODY_RATIO;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  ctx.globalCompositeOperation = 'lighter';

  let g = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.44);
  g.addColorStop(0.0, 'rgba(158, 188, 255, 0.085)');
  g.addColorStop(0.18, 'rgba(146, 178, 252, 0.058)');
  g.addColorStop(0.38, 'rgba(132, 164, 246, 0.032)');
  g.addColorStop(0.6, 'rgba(116, 150, 238, 0.014)');
  g.addColorStop(0.82, 'rgba(98, 132, 226, 0.004)');
  g.addColorStop(1.0, 'rgba(80, 110, 210, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);

  g = ctx.createRadialGradient(cx, cy, 0, cx, cy, bodyR * 2.6);
  g.addColorStop(0.0, 'rgba(224, 236, 255, 0.20)');
  g.addColorStop(0.22, 'rgba(214, 228, 254, 0.105)');
  g.addColorStop(0.46, 'rgba(200, 218, 250, 0.048)');
  g.addColorStop(0.72, 'rgba(184, 206, 246, 0.014)');
  g.addColorStop(1.0, 'rgba(164, 188, 245, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);

  ctx.globalCompositeOperation = 'source-over';

  const body = ctx.createRadialGradient(cx - bodyR * 0.28, cy - bodyR * 0.3, bodyR * 0.1, cx, cy, bodyR * 1.06);
  body.addColorStop(0.0, '#ffffff');
  body.addColorStop(0.28, '#f5f9fd');
  body.addColorStop(0.52, '#e6edf6');
  body.addColorStop(0.72, '#d4dee9');
  body.addColorStop(0.86, '#c4d0dd');
  body.addColorStop(0.95, 'rgba(190, 204, 218, 0.55)');
  body.addColorStop(1.0, 'rgba(180, 194, 210, 0)');
  ctx.beginPath();
  ctx.arc(cx, cy, bodyR * 1.06, 0, Math.PI * 2);
  ctx.fillStyle = body;
  ctx.fill();

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, bodyR, 0, Math.PI * 2);
  ctx.clip();

  const drawMaria = (x: number, y: number, r: number, opacity: number) => {
    const maria = ctx.createRadialGradient(x, y, 0, x, y, r);
    maria.addColorStop(0, `rgba(80, 95, 120, ${opacity})`);
    maria.addColorStop(0.6, `rgba(80, 95, 120, ${opacity * 0.5})`);
    maria.addColorStop(1, 'rgba(180, 190, 210, 0)');
    ctx.fillStyle = maria;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  };

  drawMaria(cx - bodyR * 0.2, cy - bodyR * 0.3, bodyR * 0.5, 0.7);
  drawMaria(cx + bodyR * 0.3, cy - bodyR * 0.1, bodyR * 0.4, 0.5);
  drawMaria(cx - bodyR * 0.1, cy + bodyR * 0.35, bodyR * 0.6, 0.6);
  drawMaria(cx + bodyR * 0.4, cy + bodyR * 0.25, bodyR * 0.3, 0.4);

  const shadow = ctx.createRadialGradient(cx - bodyR * 0.5, cy - bodyR * 0.5, bodyR * 0.3, cx, cy, bodyR * 1.15);
  shadow.addColorStop(0.0, 'rgba(0, 0, 0, 0)');
  shadow.addColorStop(0.55, 'rgba(15, 20, 35, 0.22)');
  shadow.addColorStop(0.85, 'rgba(10, 15, 30, 0.42)');
  shadow.addColorStop(1.0, 'rgba(10, 15, 30, 0)');
  ctx.fillStyle = shadow;
  ctx.fillRect(0, 0, size, size);

  ctx.restore();
  return c;
}

function drawSprite(
  ctx: CanvasRenderingContext2D,
  sprite: HTMLCanvasElement,
  x: number,
  y: number,
  radius: number,
  alpha: number,
  bodyRatio: number,
) {
  if (alpha <= 0.005) return;
  const s = radius / bodyRatio;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.drawImage(sprite, x - s / 2, y - s / 2, s, s);
  ctx.restore();
}

/** 太阳右上沉落、月亮左下升起的轨迹，d: 0 白昼 → 1 星夜 */
function drawCelestial(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  d: number,
  sunSprite: HTMLCanvasElement,
  moonSprite: HTMLCanvasElement,
) {
  const base = Math.min(w, h) * 0.075;
  const sunR = Math.max(14, Math.min(base, 52));
  const moonR = sunR * 0.86;

  const sun = bez([0.5 * w, 0.18 * h], [0.82 * w, 0.12 * h], [1.1 * w, 0.82 * h], d);
  const moon = bez([-0.1 * w, 0.82 * h], [0.18 * w, 0.12 * h], [0.5 * w, 0.18 * h], d);

  const sunA = clamp01(1 - d * 1.15);
  const moonA = clamp01((d - 0.1) / 0.55);

  drawSprite(ctx, moonSprite, moon[0], moon[1], moonR, moonA, MOON_BODY_RATIO);
  drawSprite(ctx, sunSprite, sun[0], sun[1], sunR, sunA, SUN_BODY_RATIO);
}

/** 远近两层山脊剪影 */
function ridgePts(w: number, baseY: number, amp: number, freq: number, phase: number, n: number) {
  const pts: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const y =
      baseY - Math.sin(t * Math.PI * freq + phase) * amp - Math.sin(t * Math.PI * freq * 2.6 + phase * 1.7) * amp * 0.35;
    pts.push([t * w, y]);
  }
  return pts;
}

function paintRidge(ctx: CanvasRenderingContext2D, w: number, h: number, pts: [number, number][], topColor: string, botColor: string) {
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length - 1; i++) {
    const xc = (pts[i][0] + pts[i + 1][0]) * 0.5;
    const yc = (pts[i][1] + pts[i + 1][1]) * 0.5;
    ctx.quadraticCurveTo(pts[i][0], pts[i][1], xc, yc);
  }
  const last = pts[pts.length - 1];
  ctx.lineTo(last[0], last[1]);
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();

  let minY = Infinity;
  for (let i = 0; i < pts.length; i++) if (pts[i][1] < minY) minY = pts[i][1];

  const g = ctx.createLinearGradient(0, minY, 0, h);
  g.addColorStop(0, topColor);
  g.addColorStop(1, botColor);
  ctx.fillStyle = g;
  ctx.fill();
}

function drawRidges(ctx: CanvasRenderingContext2D, w: number, h: number, d: number) {
  const farPts = ridgePts(w, h * 0.88, h * 0.036, 2.3, 0.9, 16);
  const nearPts = ridgePts(w, h * 0.955, h * 0.032, 3.2, 2.6, 16);

  const farTop = css(lerpRGBA([148, 178, 210, 0.5], [20, 26, 50, 0.88], d));
  const farBot = css(lerpRGBA([112, 146, 184, 0.8], [10, 14, 30, 0.96], d));
  const nearTop = css(lerpRGBA([104, 136, 172, 0.85], [10, 14, 30, 0.96], d));
  const nearBot = css(lerpRGBA([72, 104, 140, 0.95], [4, 6, 14, 1.0], d));

  paintRidge(ctx, w, h, farPts, farTop, farBot);
  paintRidge(ctx, w, h, nearPts, nearTop, nearBot);
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

    const sunSprite = createSunSprite(SPRITE_SIZE);
    const moonSprite = createMoonSprite(SPRITE_SIZE);

    // 按 DPR 渲染保证清晰度，最高 2 倍
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let currentD = toDark ? 0 : 1;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
    };
    resize();

    const render = (d: number, time: number) => {
      drawSky(ctx, w, h, d);
      drawStars(ctx, w, h, d, time);
      drawCelestial(ctx, w, h, d, sunSprite, moonSprite);
      drawRidges(ctx, w, h, d);
    };

    const start = performance.now();
    const total = MOVE_MS + FADE_MS;

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

    const onResize = () => {
      resize();
      render(currentD, performance.now());
    };
    window.addEventListener('resize', onResize);

    const frame = (now: number) => {
      if (stopped) return;

      const elapsed = now - start;
      if (!themeApplied && elapsed >= 50) applyTheme();

      const moveT = clamp01(elapsed / MOVE_MS);
      const e = easeInOutCubic(moveT);
      const d = toDark ? e : 1 - e;
      currentD = d;

      render(d, now);

      if (elapsed > MOVE_MS) {
        const ft = clamp01((elapsed - MOVE_MS) / FADE_MS);
        canvas.style.opacity = String(1 - smoothstep(ft));
      }

      if (elapsed < total) {
        raf = requestAnimationFrame(frame);
      } else {
        finish();
      }
    };

    // 先画初始天空，避免首帧闪黑
    render(currentD, start);
    canvas.style.opacity = '1';
    raf = requestAnimationFrame(frame);

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
