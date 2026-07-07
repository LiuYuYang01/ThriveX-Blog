'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

type ButtonVariant = 'solid' | 'light' | 'flat' | 'shadow';
type ButtonColor = 'primary' | 'default';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
  loading?: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
  isIconOnly?: boolean;
  startContent?: ReactNode;
  endContent?: ReactNode;
  onPress?: () => void;
}

const sizeCls: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
};

const iconSizeCls: Record<ButtonSize, string> = {
  sm: 'h-8 w-8 min-w-8 p-0',
  md: 'h-10 w-10 min-w-10 p-0',
  lg: 'h-12 w-12 min-w-12 p-0',
};

const primaryGrad = 'bg-linear-to-br from-primary to-[#3d87f0]';

function variantCls(variant: ButtonVariant, color: ButtonColor) {
  if (color === 'primary') {
    if (variant === 'light')
      return 'border border-primary/15 bg-primary/10 text-primary hover:border-primary/25 hover:bg-primary/15';
    if (variant === 'flat') return 'bg-primary/12 text-primary hover:bg-primary/20';
    if (variant === 'shadow')
      return `${primaryGrad} text-white shadow-[0_6px_20px_-4px_rgba(83,157,253,0.45)] hover:opacity-95`;
    return `${primaryGrad} text-white shadow-[0_4px_14px_rgba(83,157,253,0.38)] hover:opacity-95`;
  }

  if (variant === 'light')
    return 'bg-transparent text-slate-600 hover:bg-primary/8 hover:text-primary dark:text-slate-300 dark:hover:bg-primary/10 dark:hover:text-primary';
  if (variant === 'flat')
    return 'bg-slate-100/80 text-slate-700 hover:bg-primary/10 hover:text-primary dark:bg-white/8 dark:text-slate-200 dark:hover:bg-primary/12 dark:hover:text-primary';
  if (variant === 'shadow')
    return 'border border-slate-200/70 bg-linear-to-br from-white via-white to-blue-50/45 text-slate-600 shadow-[0_4px_12px_-2px_rgba(83,157,253,0.12)] hover:border-primary/30 hover:text-primary dark:border-white/10 dark:from-[#323e50] dark:via-[#2c333e] dark:to-primary/8 dark:text-slate-300 dark:hover:border-primary/30 dark:hover:text-primary';
  return 'border border-slate-200/70 bg-linear-to-br from-slate-50/90 via-white to-blue-50/35 text-slate-700 shadow-[0_2px_8px_rgba(83,157,253,0.08)] hover:border-primary/20 hover:text-primary dark:border-white/10 dark:from-white/5 dark:via-[#2c333e] dark:to-primary/6 dark:text-slate-200 dark:hover:border-primary/25 dark:hover:text-primary';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'solid',
      color = 'default',
      size = 'md',
      loading,
      isLoading,
      isDisabled,
      isIconOnly,
      startContent,
      endContent,
      className = '',
      children,
      disabled,
      onClick,
      onPress,
      type = 'button',
      ...props
    },
    ref,
  ) => {
    const busy = loading || isLoading;
    const off = isDisabled || disabled || busy;

    return (
      <button
        ref={ref}
        type={type}
        disabled={off}
        onClick={(e) => {
          onClick?.(e);
          onPress?.();
        }}
        className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl font-medium transition-[color,background-color,border-color,opacity] duration-150 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 ${
          isIconOnly ? iconSizeCls[size] : sizeCls[size]
        } ${variantCls(variant, color)} ${className}`}
        {...props}
      >
        {busy ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          startContent
        )}
        {!isIconOnly ? children : children}
        {!busy ? endContent : null}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
