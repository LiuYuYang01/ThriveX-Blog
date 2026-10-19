'use client';

import { useEffect, useMemo, useState } from 'react';

import type { TocHeading } from '@/utils/article';

// 页内目录，随滚动高亮当前小节
export default function DocsToc({ headings }: { headings: TocHeading[] }) {
  const items = useMemo(() => headings.filter((item) => item.level === 2 || item.level === 3), [headings]);
  const [active, setActive] = useState('');

  useEffect(() => {
    if (!items.length) return;

    const update = () => {
      let current = '';
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= 140) current = item.id;
      }
      setActive(current || items[0].id);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [items]);

  if (!items.length) return null;

  return (
    <nav aria-label="本页目录">
      <p className="mb-3 text-xs font-medium tracking-[0.14em] text-foreground/70">本页内容</p>

      <ul className="space-y-2.5 border-l border-border pl-4">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`block cursor-pointer text-[13px] leading-snug ${
                item.level === 3 ? 'pl-3' : ''
              } ${item.id === active ? 'font-medium text-foreground' : 'text-foreground/75 hover:text-foreground'}`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
