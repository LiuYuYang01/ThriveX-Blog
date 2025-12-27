'use client';

import { useEffect, useRef } from 'react';
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

/**
 * Turnstile 页面保护组件
 * 用于在页面加载时进行人机验证，防止恶意爬虫和频繁访问
 * 验证通过后，将 token 存储在 localStorage 中，避免重复验证
 */
export default function TurnstileProtection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const config = useConfigStore();
  const sitekey = config?.other?.turnstile_site_key;

  // 检查是否已经验证过（token 有效期为 5 分钟）
  useEffect(() => {
    const checkExistingToken = () => {
      const storedToken = localStorage.getItem('turnstile_token');
      const storedTime = localStorage.getItem('turnstile_token_time');

      if (storedToken && storedTime) {
        const tokenAge = Date.now() - parseInt(storedTime, 10);
        // Token 有效期 5 分钟（300秒），我们设置为 4 分钟（240秒）以确保安全
        if (tokenAge < 240000) {
          return true;
        } else {
          // Token 过期，清除
          localStorage.removeItem('turnstile_token');
          localStorage.removeItem('turnstile_token_time');
        }
      }
      return false;
    };

    // 如果已有有效 token，直接通过
    if (checkExistingToken()) {
      return;
    }

    // 等待 Turnstile 脚本加载完成
    const checkTurnstile = () => {
      if (window.turnstile && containerRef.current && !widgetIdRef.current) {
        const widgetId = window.turnstile.render(containerRef.current, {
          sitekey: sitekey!,
          theme: config.isDark ? 'dark' : 'light',
          size: 'normal',
          callback: (token: string) => {
            // 验证成功，存储 token 和时间戳
            localStorage.setItem('turnstile_token', token);
            localStorage.setItem('turnstile_token_time', Date.now().toString());
          },
          'error-callback': () => {
            console.error('Turnstile 验证失败');
            // 验证失败，重置小部件
            if (widgetIdRef.current && window.turnstile) {
              window.turnstile.reset(widgetIdRef.current);
            }
          },
          appearance: 'execute', // 自动执行验证，无需用户交互（除非检测到可疑行为）
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
  }, [sitekey, config.isDark]);

  // 如果没有配置 Turnstile，不渲染任何内容
  if (!sitekey) {
    return null;
  }

  // 使用 execute 模式，Turnstile 会在后台自动执行验证
  // 正常情况下不会显示，避免影响用户体验
  // 只有在检测到可疑行为时才会显示验证界面
  return (
    <div
      ref={containerRef}
      id="turnstile-protection-container"
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        visibility: 'hidden', // 隐藏但保留空间，Turnstile 会在需要时自动显示
      }}
    />
  );
}
