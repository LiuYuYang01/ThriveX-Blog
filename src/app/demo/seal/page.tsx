import type { Metadata } from 'next';

import Encrypt from '@/components/Encrypt';

export const metadata: Metadata = {
  title: '加密信笺预览',
  robots: { index: false, follow: false },
};

export default function SealDemoPage() {
  return (
    <div className="w-[90%] xl:w-6/12 mx-auto mt-12 mb-24 relative">
      <Encrypt
        id={2}
        social={[
          { name: 'Weixin', url: 'https://example.com' },
          { name: 'GitHub', url: 'https://example.com' },
          { name: 'Juejin', url: 'https://example.com' },
        ]}
      />
    </div>
  );
}
