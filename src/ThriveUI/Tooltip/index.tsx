'use client';

import { useId, useState, type ReactNode } from 'react';

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  showArrow?: boolean;
  className?: string;
}

export function Tooltip({ content, children, showArrow, className = '' }: TooltipProps) {
  const id = useId();
  const [visible, setVisible] = useState(false);

  return (
    <span
      className={`relative inline-flex ${className}`}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      <span aria-describedby={visible ? id : undefined}>{children}</span>
      {visible ? (
        <span
          id={id}
          role="tooltip"
          className={`pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-neutral-900 px-2.5 py-1.5 text-xs text-white shadow-lg dark:bg-neutral-700 ${
            showArrow
              ? 'after:absolute after:left-1/2 after:top-full after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-neutral-900 dark:after:border-t-neutral-700'
              : ''
          }`}
        >
          {content}
        </span>
      ) : null}
    </span>
  );
}

export default Tooltip;
