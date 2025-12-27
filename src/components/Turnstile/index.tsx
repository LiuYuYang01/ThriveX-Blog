'use client';

import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useConfigStore } from '@/stores';

// 声明全局 Turnstile 类型
declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: TurnstileOptions) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
      getResponse: (widgetId: string) => string | undefined;
    };
  }
}

interface TurnstileOptions {
  sitekey: string;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact';
  callback?: (token: string) => void;
  'error-callback'?: () => void;
  execution?: 'render' | 'execute';
  appearance?: 'always' | 'execute' | 'interaction-only';
}

export interface TurnstileRef {
  reset: () => void;
  remove: () => void;
  getResponse: () => string | undefined;
}

interface TurnstileProps {
  setToken: (token: string) => void;
}

const Turnstile = forwardRef<TurnstileRef, TurnstileProps>(({ setToken }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const config = useConfigStore();
  const sitekey = config?.other?.turnstile_site_key;

  // 如果没有配置 turnstile_site_key，不渲染组件
  if (!sitekey) {
    return null;
  }

  useImperativeHandle(ref, () => ({
    reset: () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current);
      }
    },
    remove: () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    },
    getResponse: () => {
      if (widgetIdRef.current && window.turnstile) {
        return window.turnstile.getResponse(widgetIdRef.current);
      }
      return undefined;
    },
  }));

  useEffect(() => {
    // 等待 Turnstile 脚本加载完成
    const checkTurnstile = () => {
      if (window.turnstile && containerRef.current && !widgetIdRef.current) {
        const widgetId = window.turnstile.render(containerRef.current, {
          sitekey: sitekey!,
          theme: config.isDark ? 'dark' : 'light',
          size: 'normal',
          callback: (token: string) => {
            setToken(token);
          },
          'error-callback': () => {
            console.error('Turnstile 验证失败');
          },
        });
        widgetIdRef.current = widgetId;
      }
    };

    // 如果 Turnstile 已经加载，直接渲染
    if (window.turnstile) {
      checkTurnstile();
    } else {
      // 否则等待加载
      const interval = setInterval(() => {
        if (window.turnstile) {
          checkTurnstile();
          clearInterval(interval);
        }
      }, 100);

      // 10秒后停止检查
      const timeout = setTimeout(() => {
        clearInterval(interval);
      }, 10000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
        // 组件卸载时移除小部件
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.remove(widgetIdRef.current);
        }
      };
    }

    return () => {
      // 组件卸载时移除小部件
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
    };
  }, [sitekey, config.isDark, setToken]);

  return <div ref={containerRef} id="turnstile-container" />;
});

Turnstile.displayName = 'Turnstile';

export default Turnstile;
