import HCaptcha from '@hcaptcha/react-hcaptcha';
import { forwardRef, Ref } from 'react';
import { useConfigStore } from '@/stores';

export default forwardRef(({ setToken }: { setToken: (token: string) => void }, ref: Ref<HCaptcha>) => {
  const config = useConfigStore();
  const sitekey = config?.other?.hcaptcha_key;

  // 如果没有配置 hcaptcha_key，不渲染组件
  if (!sitekey) {
    return null;
  }

  return (
    <div>
      <HCaptcha theme={config.isDark ? 'dark' : 'light'} sitekey={sitekey} onVerify={setToken} ref={ref} />
    </div>
  );
});
