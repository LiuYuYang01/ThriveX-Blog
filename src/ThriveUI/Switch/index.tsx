'use client';

import { type ReactNode } from 'react';

export interface SwitchProps {
  isSelected?: boolean;
  defaultSelected?: boolean;
  onValueChange?: (value: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  thumbIcon?: (props: { isSelected: boolean }) => ReactNode;
  disabled?: boolean;
}

const trackSize = { sm: 'h-5 w-9', md: 'h-6 w-11', lg: 'h-7 w-12' };
const thumbSize = { sm: 'h-4 w-4', md: 'h-5 w-5', lg: 'h-6 w-6' };
const thumbOn = { sm: 'translate-x-4', md: 'translate-x-5', lg: 'translate-x-5' };

export function Switch({
  isSelected = false,
  onValueChange,
  size = 'md',
  className = '',
  thumbIcon,
  disabled,
}: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isSelected}
      aria-label="主题切换"
      disabled={disabled}
      onClick={() => onValueChange?.(!isSelected)}
      className={`relative inline-flex shrink-0 cursor-pointer items-center rounded-full ${isSelected ? 'bg-primary' : 'bg-neutral-200 dark:bg-neutral-600'} ${trackSize[size]} ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${className}`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-flex items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-150 ease-out ${thumbSize[size]} ${isSelected ? thumbOn[size] : 'translate-x-0.5'}`}
      >
        {thumbIcon?.({ isSelected })}
      </span>
    </button>
  );
}

export default Switch;
