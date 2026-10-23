'use client';

import { forwardRef, Ref } from 'react';
import { Turnstile as ReactTurnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import { useAppConfig } from '@/components/AppConfigProvider';
import { useConfigStore } from '@/stores';

export type { TurnstileInstance };

// 人机验证组件（Cloudflare Turnstile）：sitekey 未配置时不渲染，ref 暴露 reset 等实例方法
export default forwardRef(({ setToken }: { setToken: (token: string) => void }, ref: Ref<TurnstileInstance>) => {
  const { publicConfig } = useAppConfig();
  const isDark = useConfigStore((state) => state.isDark);
  const sitekey = publicConfig?.turnstile_key?.key;

  if (!sitekey) {
    return null;
  }

  return (
    <div>
      <ReactTurnstile
        siteKey={sitekey}
        options={{ theme: isDark ? 'dark' : 'light' }}
        onSuccess={setToken}
        // Token 过期后置空，表单侧 captchaToken 变为 falsy，会重新提示完成验证
        onExpire={() => setToken('')}
        ref={ref}
      />
    </div>
  );
});
