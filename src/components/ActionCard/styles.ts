import { cn } from '@/lib/utils';

export type ActionCardTone = 'rose' | 'blue';

const toneStyles: Record<ActionCardTone, { card: string; divider: string }> = {
  rose: {
    card: cn(
      'border-rose-100/90 bg-gradient-to-br from-rose-50/80 via-white to-orange-50/40',
      'shadow-[0_4px_20px_-4px_rgba(244,63,94,0.15)]',
      'dark:border-rose-500/15 dark:from-rose-500/8 dark:via-white/[0.02] dark:to-orange-500/5 dark:shadow-none',
    ),
    divider: 'via-rose-200/80 dark:via-rose-500/25',
  },
  blue: {
    card: cn(
      'border-slate-200/90 bg-gradient-to-br from-slate-50/90 via-white to-blue-50/40',
      'shadow-[0_4px_20px_-4px_rgba(83,157,253,0.12)]',
      'hover:border-primary/30 hover:shadow-[0_4px_24px_-4px_rgba(83,157,253,0.22)]',
      'dark:border-white/10 dark:from-white/[0.03] dark:via-transparent dark:to-primary/5 dark:shadow-none',
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
    'mx-3 w-px shrink-0 self-stretch min-h-[3.25rem] bg-gradient-to-b from-transparent to-transparent',
    toneStyles[tone].divider,
  );
}

export const actionIconWrapClass = 'relative flex shrink-0 items-center justify-center p-1';

export const actionTextColClass = 'flex min-w-[4rem] flex-col justify-center';

export const actionLabelClass = 'mt-1 text-[11px] font-medium tracking-wide text-slate-400 dark:text-slate-500';

export const actionPrimaryClass = 'text-xl font-extrabold leading-none text-slate-800 dark:text-slate-100';

export const actionCountClass = 'tabular-nums text-[1.75rem] font-black leading-none tracking-tight text-rose-500 dark:text-rose-400';
