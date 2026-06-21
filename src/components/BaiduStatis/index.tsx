'use client';

import { useEffect } from 'react';
import { useConfigStore } from '@/stores';

export default function BaiduAnalytics() {
  const baiduKey = useConfigStore((state) => state.config.baidu_statis_key?.key);

  useEffect(() => {
    if (baiduKey?.trim()) {
      window._hmt = window._hmt || [];
      const baiduScript = document.createElement('script');
      baiduScript.src = `https://hm.baidu.com/hm.js?${baiduKey}`;
      baiduScript.async = true;
      document.head.appendChild(baiduScript);

      return () => {
        document.head.removeChild(baiduScript);
      };
    }
  }, [baiduKey]);

  return null;
}
