export const FIELD_FOCUS_CLS =
  'focus:border-primary focus:shadow-[inset_0_0_0_1px_var(--color-primary)] dark:focus:border-primary';

export const FIELD_ACTIVE_CLS =
  'border-primary shadow-[inset_0_0_0_1px_var(--color-primary)]';

export const FIELD_BASE_CLS =
  `rounded-lg border border-neutral-200 bg-white text-sm text-foreground transition-[border-color,box-shadow] duration-200 placeholder:text-neutral-400 focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-600 dark:bg-neutral-800/60 dark:placeholder:text-neutral-500 ${FIELD_FOCUS_CLS}`;

export const FIELD_CONTROL_CLS = `w-full min-h-10 px-3 py-2.5 ${FIELD_BASE_CLS}`;

export const FIELD_INVALID_CLS =
  'border-red-500 shadow-[inset_0_0_0_1px_var(--color-red-500)] focus:border-red-500! focus:shadow-[inset_0_0_0_1px_var(--color-red-500)]! dark:border-red-500';

export const FIELD_SELECT_TRIGGER_CLS = `${FIELD_CONTROL_CLS} flex cursor-pointer items-center justify-between gap-2 text-left`;

export function fieldClassName(options?: {
  className?: string;
  error?: boolean;
}) {
  return [FIELD_CONTROL_CLS, options?.error && FIELD_INVALID_CLS, options?.className]
    .filter(Boolean)
    .join(' ');
}
