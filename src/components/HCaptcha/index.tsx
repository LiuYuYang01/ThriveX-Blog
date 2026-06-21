'use client';

import HCaptcha from '@hcaptcha/react-hcaptcha';
import { forwardRef, Ref } from 'react';
import { useConfigStore } from '@/stores';

export default forwardRef(({ setToken }: { setToken: (token: string) => void }, ref: Ref<HCaptcha>) => {
  const isDark = useConfigStore((state) => state.isDark);
  const hcaptchaKey = useConfigStore((state) => state.config.hcaptcha_key?.key);
  const sitekey = hcaptchaKey?.trim() || process.env.NEXT_PUBLIC_HCAPTCHA_KEY?.trim();

  if (!sitekey) {
    return null;
  }

  return (
    <div>
      <HCaptcha theme={isDark ? 'dark' : 'light'} sitekey={sitekey} onVerify={setToken} ref={ref} />
    </div>
  );
});
