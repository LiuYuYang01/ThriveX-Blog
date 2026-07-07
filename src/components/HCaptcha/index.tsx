import HCaptcha from '@hcaptcha/react-hcaptcha';
import { forwardRef, Ref } from 'react';
import { useAppConfig } from '@/components/AppConfigProvider';
import { useConfigStore } from '@/stores';

export default forwardRef(({ setToken }: { setToken: (token: string) => void }, ref: Ref<HCaptcha>) => {
  const { other } = useAppConfig();
  const isDark = useConfigStore((state) => state.isDark);
  const sitekey = other?.hcaptcha_key;

  if (!sitekey) {
    return null;
  }

  return (
    <div>
      <HCaptcha theme={isDark ? 'dark' : 'light'} sitekey={sitekey} onVerify={setToken} ref={ref} />
    </div>
  );
});
