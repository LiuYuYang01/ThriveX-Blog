'use client';

import { useEffect } from 'react';
import { Other } from '@/types/app/config';

export default function BaiduAnalytics({ other }: { other: Other }) {
  useEffect(() => {
    if (other?.baidu_token) {
      window._hmt = window._hmt || [];
      const baiduScript = document.createElement('script');
      baiduScript.src = `https://hm.baidu.com/hm.js?${other.baidu_token}`;
      baiduScript.async = true;
      document.head.appendChild(baiduScript);

      return () => {
        document.head.removeChild(baiduScript);
      };
    }
  }, [other]);

  return null;
}
