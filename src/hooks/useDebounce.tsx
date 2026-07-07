import { useRef } from 'react';

export default function useDebounce<T extends (...args: any[]) => any>(func: T, wait: number) {
  const timeoutRef = useRef<number | undefined>(null);
  const funcRef = useRef(func);
  funcRef.current = func;

  return (...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      funcRef.current(...args);
    }, wait);
  };
}
