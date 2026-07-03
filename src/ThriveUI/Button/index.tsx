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

function variantCls(variant: ButtonVariant, color: ButtonColor) {
  if (color === 'primary') {
    if (variant === 'light') return 'bg-primary/10 text-primary hover:bg-primary/15';
    if (variant === 'flat') return 'bg-primary/15 text-primary hover:bg-primary/20';
    return 'bg-primary text-white hover:bg-primary/90 shadow-[0_4px_14px_rgba(83,157,253,0.35)]';
  }
  if (variant === 'light') return 'bg-transparent text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800';
  return 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700';
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
        className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
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
