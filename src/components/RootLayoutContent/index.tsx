import { Suspense } from 'react';

import NProgress from '@/components/NProgress';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RouteChangeHandler from '@/components/RouteChangeHandler';
import BaiduStatis from '@/components/BaiduStatis';
import FloatingBlock from '@/components/FloatingBlock';
import AppConfigProvider from '@/components/AppConfigProvider';
import { getAppConfigCacheAPI } from '@/lib/config';

interface Props {
  children: React.ReactNode;
}

export default async function RootLayoutContent({ children }: Props) {
  const { web: data, theme, other, author } = await getAppConfigCacheAPI();

  return (
    <>
      <BaiduStatis other={other} />

      <Suspense fallback={null}>
        <RouteChangeHandler />
      </Suspense>

      <AppConfigProvider web={data} theme={theme} other={other} author={author}>
        <NProgress />
        <Suspense fallback={null}>
          <Header theme={theme} />
        </Suspense>

        <div className="min-h-[calc(100vh-300px)]">{children}</div>

        <Footer />
        <FloatingBlock />
      </AppConfigProvider>
    </>
  );
}
