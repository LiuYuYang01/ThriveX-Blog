import { cn } from '@/lib/utils';

/** ActionBar 简约模式：单行胶囊容器 */
export const actionBarPillClass = cn(
  'inline-flex items-center rounded-full border border-gray-200 bg-white p-1',
  'shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)]',
  'dark:border-gray-800 dark:bg-black-b dark:shadow-none',
);

export const actionBarDividerClass = 'h-5 w-px bg-gray-100 dark:bg-white/10';

/** ActionBar 简约模式：整项 hover / active 触发动画 */
export const actionMinimalItemClass =
  'group/action relative inline-flex cursor-pointer select-none items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-bold text-slate-600 dark:text-slate-300';

export const actionMinimalIconClass =
  'shrink-0 transition-[scale] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/action:scale-110 group-active/action:scale-90';

export const actionMinimalCountClass =
  'transition-[scale] duration-200 ease-out group-hover/action:scale-110 group-active/action:scale-95';

export type ActionCardTone = 'rose' | 'blue';

const toneStyles: Record<ActionCardTone, { card: string; divider: string }> = {
  rose: {
    card: cn(
      'border-rose-100/90 bg-linear-to-br from-rose-50/80 via-white to-orange-50/40',
      'shadow-[0_4px_20px_-4px_rgba(244,63,94,0.15)]',
      'dark:border-rose-500/15 dark:from-rose-500/8 dark:via-white/2 dark:to-orange-500/5 dark:shadow-none',
    ),
    divider: 'via-rose-200/80 dark:via-rose-500/25',
  },
  blue: {
    card: cn(
      'border-slate-200/90 bg-linear-to-br from-slate-50/90 via-white to-blue-50/40',
      'shadow-[0_4px_20px_-4px_rgba(83,157,253,0.12)]',
      'hover:border-primary/30 hover:shadow-[0_4px_24px_-4px_rgba(83,157,253,0.22)]',
      'dark:border-white/10 dark:from-white/3 dark:via-transparent dark:to-primary/5 dark:shadow-none',
    ),
    divider: 'via-blue-200/70 dark:via-primary/25',
  },
};

export function actionCardClass(tone: ActionCardTone, className?: string) {
  return cn(
    'relative flex h-[5.625rem] items-center overflow-visible rounded-2xl border px-5',
    toneStyles[tone].card,
    className,
  );
}

export function actionCardDividerClass(tone: ActionCardTone) {
  return cn(
    'mx-3 w-px shrink-0 self-stretch min-h-[3.25rem] bg-linear-to-b from-transparent to-transparent',
    toneStyles[tone].divider,
  );
}

export const actionIconWrapClass = 'relative flex shrink-0 items-center justify-center p-1';

export const actionTextColClass = 'flex min-w-[4rem] flex-col justify-center';

export const actionLabelClass = 'mt-1 text-[11px] font-medium tracking-wide text-slate-400 dark:text-slate-500';

export const actionPrimaryClass = 'text-xl font-extrabold leading-none text-slate-800 dark:text-slate-100';

export const actionCountClass = 'tabular-nums text-[1.75rem] font-black leading-none tracking-tight text-rose-500 dark:text-rose-400';
