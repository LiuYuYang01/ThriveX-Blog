'use client';

import { useCallback, useRef, useState } from 'react';
import { RiHeartFill } from 'react-icons/ri';
import { cn } from '@/lib/utils';

interface Particle {
  id: number;
  type: 'heart' | 'plus';
  tx: number;
  ty: number;
  rot: number;
}

interface Ripple {
  id: number;
}

const COMBO_RESET_MS = 900;
const COMBO_MESSAGES = ['Nice!', '加油!', '太棒了!', '🔥', '666', '❤️‍🔥'];

const BTN_BASE =
  'relative z-[2] flex items-center justify-center rounded-full cursor-pointer border-0 outline-none transition-transform duration-[120ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] bg-gradient-to-br from-rose-400 via-rose-500 to-rose-600 shadow-like-btn hover:shadow-like-btn-hover active:scale-[0.88]';

const BTN_SIZE = {
  sm: 'w-5 h-5 p-0',
  md: 'w-11 h-11',
  lg: 'w-[3.75rem] h-[3.75rem]',
} as const;

const ICON_SIZE = {
  sm: 'w-[0.65rem] h-[0.65rem]',
  md: 'w-5 h-5',
  lg: 'w-7 h-7',
} as const;

interface Props {
  count: number;
  onLike: () => void;
  size?: 'md' | 'lg';
  variant?: 'default' | 'hero';
  className?: string;
}

export default function LikeButtonCore({ count, onLike, size = 'lg', variant = 'default', className }: Props) {
  const [popping, setPopping] = useState(false);
  const [comboShaking, setComboShaking] = useState(false);
  const [countBump, setCountBump] = useState(false);
  const [combo, setCombo] = useState(0);
  const [comboMsg, setComboMsg] = useState('');
  const [particles, setParticles] = useState<Particle[]>([]);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [showGlow, setShowGlow] = useState(false);

  const particleIdRef = useRef(0);
  const rippleIdRef = useRef(0);
  const comboRef = useRef(0);
  const comboTimerRef = useRef<number>(null);

  const isHero = variant === 'hero';
  const btnSize = isHero ? 'sm' : size;
  const isLarge = size === 'lg';

  const spawnParticles = useCallback((intensity: number) => {
    const particleCount = Math.min(intensity >= 5 ? 4 : intensity >= 3 ? 3 : 2, 4);
    const newParticles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.8;
      const dist = 36 + Math.random() * 28;
      newParticles.push({
        id: ++particleIdRef.current,
        type: Math.random() > 0.4 ? 'heart' : 'plus',
        tx: Math.cos(angle) * dist,
        ty: Math.sin(angle) * dist - 20,
        rot: (Math.random() - 0.5) * 40,
      });
    }

    setParticles((prev) => [...prev.slice(-10), ...newParticles]);
    window.setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.some((n) => n.id === p.id)));
    }, 750);
  }, []);

  const spawnRipple = useCallback(() => {
    const id = ++rippleIdRef.current;
    setRipples((prev) => [...prev, { id }]);
    window.setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 650);
  }, []);

  const handleLike = () => {
    onLike();

    setPopping(true);
    setCountBump(true);

    if (!isHero) {
      setShowGlow(true);
      spawnRipple();
    }

    comboRef.current += 1;
    const currentCombo = comboRef.current;
    setCombo(currentCombo);

    if (currentCombo >= 2) {
      setComboShaking(true);
      setComboMsg(COMBO_MESSAGES[(currentCombo - 2) % COMBO_MESSAGES.length]);
    }

    if (!isHero) {
      spawnParticles(currentCombo);
    }

    if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
    comboTimerRef.current = window.setTimeout(() => {
      comboRef.current = 0;
      setCombo(0);
      setComboMsg('');
    }, COMBO_RESET_MS);

    window.setTimeout(() => setPopping(false), 380);
    window.setTimeout(() => setCountBump(false), 350);
    window.setTimeout(() => setComboShaking(false), 280);
    window.setTimeout(() => setShowGlow(false), 600);
  };

  const btnClass = cn(
    BTN_BASE,
    BTN_SIZE[btnSize],
    popping && 'animate-like-heart-pop',
    comboShaking && !isHero && 'animate-like-combo-shake shadow-like-btn-combo',
    isHero && 'bg-[#e11e63] shadow-like-hero hover:shadow-like-hero',
  );

  const iconClass = cn('text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]', ICON_SIZE[isHero ? 'sm' : size]);

  const countClass = cn(
    'tabular-nums font-black leading-none text-rose-500 dark:text-rose-400',
    isLarge ? 'text-4xl tracking-tight' : 'text-xl',
    countBump && 'animate-like-number-bump',
  );

  const hintText =
    combo >= 5 ? '停不下来了吧 😆' : combo >= 3 ? '继续点，作者会看到的~' : '点击为作者加油 ❤️';

  const likeButton = (
    <div className={cn('relative flex shrink-0 items-center justify-center', isLarge ? 'p-1' : 'p-0.5')}>
      {showGlow && (
        <span
          className="pointer-events-none absolute -inset-2 z-0 animate-like-glow-pulse rounded-full bg-[radial-gradient(circle,rgba(244,63,94,0.35)_0%,transparent_70%)]"
          aria-hidden
        />
      )}

      {ripples.map((r) => (
        <span
          key={r.id}
          className="pointer-events-none absolute inset-0 z-[1] animate-like-ripple rounded-full border-2 border-rose-500/55"
          aria-hidden
        />
      ))}

      {particles.map((p) => (
        <span
          key={p.id}
          className={cn(
            'pointer-events-none absolute z-30 animate-like-particle-float font-bold',
            p.type === 'heart' ? 'text-base text-rose-500' : 'text-sm text-orange-400',
          )}
          style={{ '--tx': `${p.tx}px`, '--ty': `${p.ty}px`, '--rot': `${p.rot}deg` } as React.CSSProperties}
          aria-hidden
        >
          {p.type === 'heart' ? '♥' : '+1'}
        </span>
      ))}

      <button
        type="button"
        onClick={handleLike}
        className={btnClass}
        aria-label={`点赞，当前 ${count} 次${combo >= 2 ? `，连击 ${combo}` : ''}`}
      >
        <RiHeartFill className={iconClass} />
      </button>
    </div>
  );

  return (
    <div
      className={cn(
        'relative inline-flex select-none',
        isHero ? 'mb-2 flex-row items-center gap-1' : 'flex-col items-center',
        className,
      )}
    >
      {isHero ? (
        <>
          {likeButton}
          <span className="text-inherit">点赞：{count}</span>
        </>
      ) : (
        <>
          <div
            className={cn(
              'relative flex items-center overflow-visible',
              'rounded-2xl border border-rose-100/90 bg-gradient-to-br from-rose-50/80 via-white to-orange-50/40',
              'shadow-[0_4px_20px_-4px_rgba(244,63,94,0.15)]',
              'dark:border-rose-500/15 dark:from-rose-500/8 dark:via-white/[0.02] dark:to-orange-500/5 dark:shadow-none',
              isLarge ? 'px-5 py-3.5' : 'px-3 py-2',
            )}
          >
            {combo >= 2 && (
              <span
                key={combo}
                className="pointer-events-none absolute -top-3 left-1/2 z-20 -translate-x-1/2 animate-like-combo-pop whitespace-nowrap rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-2.5 py-0.5 text-[0.7rem] font-bold text-white shadow-like-combo"
              >
                连击 ×{combo} {comboMsg}
              </span>
            )}

            {likeButton}

            <div
              className={cn(
                'mx-3 w-px shrink-0 self-stretch bg-gradient-to-b from-transparent via-rose-200/80 to-transparent dark:via-rose-500/25',
                isLarge ? 'min-h-[3.25rem]' : 'min-h-[2.5rem] mx-2.5',
              )}
              aria-hidden
            />

            <div className={cn('flex flex-col justify-center', isLarge ? 'min-w-[4rem] pr-0.5' : 'min-w-[2.5rem]')}>
              <span className={countClass}>{count}</span>
              <span className="mt-1 text-[11px] font-medium tracking-wide text-slate-400 dark:text-slate-500">
                {count === 0 ? '点个赞吧' : '次赞'}
              </span>
            </div>
          </div>

          {isLarge && (
            <p className="mt-2.5 max-w-[220px] text-center text-xs leading-relaxed text-slate-400 dark:text-slate-500">
              {hintText}
            </p>
          )}
        </>
      )}
    </div>
  );
}
