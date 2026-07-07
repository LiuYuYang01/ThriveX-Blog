'use client';

import { useCallback, useRef, useState } from 'react';
import { RiHeartFill } from 'react-icons/ri';
import { cn } from '@/lib/utils';
import {
  actionCardClass,
  actionCardDividerClass,
  actionIconWrapClass,
  actionLabelClass,
  actionMinimalButtonClass,
  actionMinimalCountClass,
  actionMinimalIconClass,
  actionMinimalItemClass,
  actionPillClass,
  actionTextColClass,
} from '@/components/ActionCard/styles';
import './index.scss';

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
  'like-btn relative z-[2] flex items-center justify-center rounded-full cursor-pointer border-0 outline-hidden transition-[scale] duration-[120ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] bg-linear-to-br from-rose-400 via-rose-500 to-rose-600 active:scale-[0.88]';

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
  showHint?: boolean;
  minimal?: boolean;
  className?: string;
}

export default function LikeButtonCore({
  count,
  onLike,
  size = 'lg',
  variant = 'default',
  showHint = true,
  minimal = false,
  className,
}: Props) {
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
  const btnSize = isHero ? 'sm' : minimal ? 'md' : size;
  const isLarge = size === 'lg' && !minimal;

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
    minimal && 'bg-none bg-rose-500 shadow-md shadow-rose-500/30 group-hover:shadow-lg group-hover:shadow-rose-500/40',
    popping && 'like-btn--popping',
    comboShaking && !isHero && 'like-btn--combo-shake',
    isHero && 'like-btn--hero bg-[#e11e63]',
  );

  const iconClass = cn('text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]', ICON_SIZE[isHero ? 'sm' : size]);

  const countClass = cn(
    'tabular-nums font-black leading-none text-rose-500 transition-colors dark:text-rose-400',
    isLarge ? 'text-[1.75rem] tracking-tight' : 'text-xl',
    countBump && 'like-count--bump',
  );

  const hintText =
    combo >= 5 ? '停不下来了吧 😆' : combo >= 3 ? '继续点，作者会看到的~' : '点击为作者加油 ❤️';

  const ariaLabel = `点赞，当前 ${count} 次${combo >= 2 ? `，连击 ${combo}` : ''}`;

  const likeEffects = (
    <>
      {showGlow && (
        <span
          className="like-glow pointer-events-none absolute -inset-2 z-0 rounded-full bg-[radial-gradient(circle,rgba(244,63,94,0.35)_0%,transparent_70%)]"
          aria-hidden
        />
      )}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="like-ripple pointer-events-none absolute inset-0 z-1 rounded-full border-2 border-rose-500/55"
          aria-hidden
        />
      ))}
      {particles.map((p) => (
        <span
          key={p.id}
          className={cn(
            'like-particle pointer-events-none absolute z-30 font-bold',
            p.type === 'heart' ? 'text-base text-rose-500' : 'text-sm text-orange-400',
          )}
          style={{ '--tx': `${p.tx}px`, '--ty': `${p.ty}px`, '--rot': `${p.rot}deg` } as React.CSSProperties}
          aria-hidden
        >
          {p.type === 'heart' ? '♥' : '+1'}
        </span>
      ))}
    </>
  );

  const heartCircle = (
    <span className={cn(btnClass, minimal && 'pointer-events-none')}>
      <RiHeartFill className={iconClass} />
    </span>
  );

  const likeButton = (
    <div className={cn(actionIconWrapClass, !isLarge && !minimal && 'p-0.5', minimal && 'p-0')}>
      {likeEffects}
      <button type="button" onClick={handleLike} className={btnClass} aria-label={ariaLabel}>
        <RiHeartFill className={iconClass} />
      </button>
    </div>
  );

  if (isHero) {
    return (
      <div className={cn('relative mb-2 inline-flex select-none flex-row items-center gap-1', className)}>
        {likeButton}
        <span className="text-inherit">{count}</span>
      </div>
    );
  }

  if (minimal) {
    return (
      <div className={cn(actionMinimalItemClass, className)}>
        {combo >= 2 && (
          <span
            key={combo}
            className="like-combo-badge pointer-events-none absolute -top-2.5 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-full bg-linear-to-r from-orange-500 to-red-500 px-2 py-0.5 text-[10px] font-bold text-white"
          >
            ×{combo}
          </span>
        )}
        <button
          type="button"
          onClick={handleLike}
          className={cn(actionPillClass, actionMinimalButtonClass, 'relative')}
          aria-label={ariaLabel}
        >
          <span className={cn(actionIconWrapClass, actionMinimalIconClass, 'relative p-0')}>
            {likeEffects}
            {heartCircle}
          </span>
        </button>
        <span
          className={cn(
            'mt-1 min-w-8 rounded-full px-2 py-0.5 text-center text-xs font-bold leading-none text-rose-600 tabular-nums',
            actionMinimalCountClass,
            countBump && 'like-count--bump',
          )}
        >
          {count}
        </span>
      </div>
    );
  }

  const card = (
    <div
      className={cn(
        isLarge
          ? actionCardClass('rose')
          : cn(
            'relative flex h-auto items-center overflow-visible rounded-2xl border border-rose-100/90 bg-linear-to-br from-rose-50/80 via-white to-orange-50/40 px-3 py-2',
            'shadow-[0_4px_20px_-4px_rgba(244,63,94,0.15)] dark:border-rose-500/15 dark:from-rose-500/8 dark:via-white/2 dark:to-orange-500/5 dark:shadow-none',
          ),
        className,
      )}
    >
      {combo >= 2 && isLarge && (
        <span
          key={combo}
          className="like-combo-badge pointer-events-none absolute -top-3 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full bg-linear-to-r from-orange-500 to-red-500 px-2.5 py-0.5 text-[0.7rem] font-bold text-white"
        >
          连击 ×{combo} {comboMsg}
        </span>
      )}

      {likeButton}

      <div
        className={cn(
          isLarge ? actionCardDividerClass('rose') : 'mx-2.5 min-h-10 w-px shrink-0 self-stretch bg-linear-to-b from-transparent via-rose-200/80 to-transparent dark:via-rose-500/25',
        )}
        aria-hidden
      />

      <div className={cn(isLarge ? actionTextColClass : 'flex min-w-10 flex-col justify-center')}>
        <span className={countClass}>{count}</span>
        <span className={actionLabelClass}>{count === 0 ? '点个赞吧' : '次赞'}</span>
      </div>
    </div>
  );

  if (!showHint || !isLarge) {
    return <div className="relative inline-flex select-none">{card}</div>;
  }

  return (
    <div className="relative inline-flex select-none flex-col items-center">
      {card}
      <p className="mt-2.5 max-w-[220px] text-center text-xs leading-relaxed text-slate-400 dark:text-slate-500">
        {hintText}
      </p>
    </div>
  );
}
