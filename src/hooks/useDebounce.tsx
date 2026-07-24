import { useEffect, useRef } from 'react';

/** 返回稳定的防抖函数；始终调用最新的 func，避免闭包过期 */
export default function useDebounce<T extends (...args: never[]) => unknown>(func: T, wait: number) {
  const funcRef = useRef(func);
  const waitRef = useRef(wait);
  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    funcRef.current = func;
  }, [func]);

  useEffect(() => {
    waitRef.current = wait;
  }, [wait]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== undefined) clearTimeout(timeoutRef.current);
    };
  }, []);

  const debouncedRef = useRef<T>(null as unknown as T);
  if (!debouncedRef.current) {
    debouncedRef.current = ((...args: Parameters<T>) => {
      if (timeoutRef.current !== undefined) clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        timeoutRef.current = undefined;
        funcRef.current(...args);
      }, waitRef.current);
    }) as T;
  }

  return debouncedRef.current;
}
