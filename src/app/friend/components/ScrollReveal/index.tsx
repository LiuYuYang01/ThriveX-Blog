'use client';

import { useEffect, useRef, type ReactNode } from 'react';

export default function ScrollReveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.classList.remove('opacity-0', 'translate-y-8', 'scale-95');
          }, delay);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className="transition-[opacity,translate,scale] duration-700 ease-out opacity-0 translate-y-8 scale-95"
    >
      {children}
    </div>
  );
}
