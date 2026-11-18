import { useCallback, useEffect, useRef, type UIEvent } from 'react';

// 滚动时给容器加 is-scrolling 让滚动条显形，停下后自动移除
export function useAutoHideScrollbar(delay = 800) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onScroll = useCallback(
    (e: UIEvent<HTMLElement>) => {
      const el = e.currentTarget;
      el.classList.add('is-scrolling');
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => el.classList.remove('is-scrolling'), delay);
    },
    [delay],
  );

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  return onScroll;
}
