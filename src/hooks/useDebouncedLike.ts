import { useCallback, useEffect, useRef, useState } from 'react';

const DEBOUNCE_MS = 600;

type LikeAPI = (id: number, count: number) => Promise<{ code?: number; data?: number }>;

/**
 * 防抖合并点赞：连续点击时本地立即 +1，停止点击后一次性提交累计增量。
 */
export default function useDebouncedLike(entityId: number, initialCount: number, likeAPI: LikeAPI) {
  const [displayCount, setDisplayCount] = useState(initialCount);
  const confirmedCountRef = useRef(initialCount);
  const pendingDeltaRef = useRef(0);
  const timerRef = useRef<number | undefined>(undefined);
  const flushingRef = useRef(false);
  const likeAPIRef = useRef(likeAPI);

  likeAPIRef.current = likeAPI;

  useEffect(() => {
    confirmedCountRef.current = initialCount ?? 0;
    pendingDeltaRef.current = 0;
    setDisplayCount(initialCount ?? 0);
  }, [initialCount, entityId]);

  const flush = useCallback(async () => {
    const delta = pendingDeltaRef.current;
    if (delta === 0 || flushingRef.current) return;

    flushingRef.current = true;
    pendingDeltaRef.current = 0;

    try {
      const { code, data } = await likeAPIRef.current(entityId, delta);
      if (code === 200 && typeof data === 'number') {
        confirmedCountRef.current = data;
        setDisplayCount(data);
      } else {
        pendingDeltaRef.current += delta;
        setDisplayCount(confirmedCountRef.current + pendingDeltaRef.current);
      }
    } catch {
      pendingDeltaRef.current += delta;
      setDisplayCount(confirmedCountRef.current + pendingDeltaRef.current);
    } finally {
      flushingRef.current = false;
      if (pendingDeltaRef.current > 0) {
        timerRef.current = window.setTimeout(() => void flush(), DEBOUNCE_MS);
      }
    }
  }, [entityId]);

  const scheduleFlush = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => void flush(), DEBOUNCE_MS);
  }, [flush]);

  const like = useCallback(() => {
    pendingDeltaRef.current += 1;
    setDisplayCount(confirmedCountRef.current + pendingDeltaRef.current);
    scheduleFlush();
  }, [scheduleFlush]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      const delta = pendingDeltaRef.current;
      if (delta > 0) {
        void likeAPIRef.current(entityId, delta);
      }
    };
  }, [entityId]);

  return { count: displayCount, like };
}
