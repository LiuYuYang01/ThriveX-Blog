'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

export interface PopoverProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  children: ReactNode;
}

export interface PopoverTriggerProps {
  children: ReactNode;
}

export interface PopoverContentProps {
  children: ReactNode;
  className?: string;
}

const placementCls = {
  top: 'bottom-full left-1/2 mb-2 -translate-x-1/2',
  bottom: 'top-full left-1/2 mt-2 -translate-x-1/2',
  left: 'right-full top-1/2 mr-2 -translate-y-1/2',
  right: 'left-full top-1/2 ml-2 -translate-y-1/2',
};

export function Popover({ isOpen, onOpenChange, placement = 'bottom', children }: PopoverProps) {
  const [innerOpen, setInnerOpen] = useState(false);
  const open = isOpen ?? innerOpen;
  const setOpen = onOpenChange ?? setInnerOpen;
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open, setOpen]);

  let trigger: ReactNode = null;
  let content: ReactNode = null;

  for (const child of Array.isArray(children) ? children : [children]) {
    if (!child || typeof child !== 'object' || !('type' in child)) continue;
    const el = child as React.ReactElement<{ children?: ReactNode }>;
    if (el.type === PopoverTrigger) trigger = el.props.children;
    if (el.type === PopoverContent) content = el.props.children;
  }

  return (
    <div ref={rootRef} className="relative inline-flex">
      <span onClick={() => setOpen(!open)}>{trigger}</span>
      {open && content ? (
        <div
          className={`absolute z-50 rounded-xl border border-neutral-200/80 bg-surface p-2 shadow-panel dark:border-neutral-700/60 ${placementCls[placement]}`}
        >
          {content}
        </div>
      ) : null}
    </div>
  );
}

export function PopoverTrigger({ children }: PopoverTriggerProps) {
  return <>{children}</>;
}

export function PopoverContent({ children }: PopoverContentProps) {
  return <>{children}</>;
}

export default Popover;
