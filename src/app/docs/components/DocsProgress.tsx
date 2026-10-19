'use client';

import { useEffect, useRef } from 'react';

// 正文顶部的阅读进度细线，直接改 transform 避免滚动时反复触发渲染
export default function DocsProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    const column = bar?.closest<HTMLElement>('[data-doc-column]');
    if (!bar || !column) return;

    const update = () => {
      const rect = column.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const passed = Math.min(Math.max(-rect.top, 0), Math.max(scrollable, 1));
      bar.style.transform = `scaleX(${scrollable > 0 ? passed / scrollable : 0})`;
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div className="h-[2px] w-full overflow-hidden rounded-full bg-border">
      <div ref={barRef} className="h-full w-full origin-left scale-x-0 rounded-full bg-primary" />
    </div>
  );
}
