import { useEffect, useState } from 'react';

type ShareAPI = (id: number, count: number) => Promise<{ code?: number; data?: number }>;

/** 记录分享次数：点击分享时乐观 +1，请求成功后与服务端同步。 */
export default function useShareCount(entityId: number, initialCount: number, shareAPI: ShareAPI) {
  const [count, setCount] = useState(initialCount ?? 0);

  useEffect(() => {
    setCount(initialCount ?? 0);
  }, [initialCount, entityId]);

  const recordShare = async () => {
    setCount((prev) => prev + 1);

    try {
      const { code, data } = await shareAPI(entityId, 1);
      if (code === 200 && typeof data === 'number') {
        setCount(data);
      }
    } catch {
      setCount((prev) => Math.max(0, prev - 1));
    }
  };

  return { count, recordShare };
}
