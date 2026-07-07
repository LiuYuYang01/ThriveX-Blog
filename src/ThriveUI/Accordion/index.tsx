'use client';

import { useState, type ReactNode } from 'react';
import { LuChevronDown } from 'react-icons/lu';

export interface AccordionProps {
  children: ReactNode;
  className?: string;
  defaultExpandedKeys?: string[];
}

export interface AccordionItemProps {
  title: ReactNode;
  children: ReactNode;
  'aria-label'?: string;
  itemKey?: string;
}

export function Accordion({ children, className = '', defaultExpandedKeys = [] }: AccordionProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(defaultExpandedKeys));

  const toggle = (key: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const items = (Array.isArray(children) ? children : [children]).filter(Boolean);

  return (
    <div className={`divide-y divide-neutral-200 dark:divide-neutral-700/60 ${className}`}>
      {items.map((child, index) => {
        if (!child || typeof child !== 'object' || !('type' in child)) return null;
        const el = child as React.ReactElement<AccordionItemProps>;
        if (el.type !== AccordionItem) return null;
        const key = el.props.itemKey ?? String(index);
        const open = expanded.has(key);
        return (
          <div key={key} className="py-4">
            <button
              type="button"
              aria-expanded={open}
              aria-label={el.props['aria-label']}
              onClick={() => toggle(key)}
              className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl px-4 py-3 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
            >
              <span className="min-w-0 flex-1 text-base font-medium">{el.props.title}</span>
              <LuChevronDown
                className={`h-4 w-4 shrink-0 text-neutral-400 transition-[rotate] ${open ? 'rotate-180' : ''}`}
                strokeWidth={1.75}
              />
            </button>
            {open ? <div className="px-4 pb-4 pt-1">{el.props.children}</div> : null}
          </div>
        );
      })}
    </div>
  );
}

export function AccordionItem(props: AccordionItemProps) {
  void props;
  return null;
}

export default Accordion;
