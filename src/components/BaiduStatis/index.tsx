'use client';

import { useEffect } from 'react';
import { PublicConfig } from '@/types/app/config';

export default function BaiduStatis({ publicConfig }: { publicConfig: PublicConfig }) {
  const baiduKey = publicConfig?.baidu_statis_key?.key;

  useEffect(() => {
    if (baiduKey) {
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
