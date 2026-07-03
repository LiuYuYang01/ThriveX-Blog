'use client';

import { type ReactNode } from 'react';
import { LuCheck } from 'react-icons/lu';

export interface CheckboxProps {
  children?: ReactNode;
  isSelected?: boolean;
  defaultSelected?: boolean;
  onValueChange?: (selected: boolean) => void;
  isDisabled?: boolean;
  className?: string;
}

export function Checkbox({
  children,
  isSelected,
  defaultSelected = false,
  onValueChange,
  isDisabled,
  className = '',
}: CheckboxProps) {
  const checked = isSelected ?? defaultSelected;

  return (
    <label
      className={`inline-flex cursor-pointer items-center gap-2 ${isDisabled ? 'cursor-not-allowed opacity-60' : ''} ${className}`}
    >
      <span
        role="checkbox"
        aria-checked={checked}
        onClick={() => !isDisabled && onValueChange?.(!checked)}
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
          checked ? 'border-primary bg-primary text-white' : 'border-neutral-300 dark:border-neutral-600'
        }`}
      >
        {checked ? <LuCheck className="h-3 w-3" strokeWidth={3} /> : null}
      </span>
      {children ? <span className="text-sm">{children}</span> : null}
    </label>
  );
}

export default Checkbox;
