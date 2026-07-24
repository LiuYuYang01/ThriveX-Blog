import { connection } from 'next/server';
import { Suspense } from 'react';

import NProgress from '@/components/NProgress';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RouteChangeHandler from '@/components/RouteChangeHandler';
import BaiduStatis from '@/components/BaiduStatis';
import FloatingBlock from '@/components/FloatingBlock';
import ThemeTransition from '@/components/ThemeTransition';
import AppConfigProvider from '@/components/AppConfigProvider';
import { getAppConfigCacheAPI } from '@/lib/config';

interface Props {
  children: React.ReactNode;
}

export default async function RootLayoutContent({ children }: Props) {
  await connection();
  const { web: data, theme, other, publicConfig, author } = await getAppConfigCacheAPI();

  return (
    <>
      <BaiduStatis publicConfig={publicConfig} />

      <Suspense fallback={null}>
        <RouteChangeHandler />
      </Suspense>

      <AppConfigProvider web={data} theme={theme} other={other} publicConfig={publicConfig} author={author}>
        <NProgress />
        <Suspense fallback={null}>
          <Header theme={theme} />
        </Suspense>

        <div className="min-h-[calc(100vh-300px)]">{children}</div>

        <Footer />
        <FloatingBlock />
        <ThemeTransition />
      </AppConfigProvider>
    </>
  );
}
