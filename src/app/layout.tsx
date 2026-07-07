import localFont from 'next/font/local';
import { Metadata } from 'next';

import NProgress from '@/components/NProgress';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Tools from '@/components/Tools';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Confetti from '@/components/Confetti';
import RouteChangeHandler from '@/components/RouteChangeHandler';

import { getAppConfigCacheAPI, getWebConfigCacheAPI } from '@/lib/config';

// 加载样式文件
import '@/styles/tailwind.css';
import '@/styles/global.scss';
import '@/styles/index.scss';
import BaiduStatis from '@/components/BaiduStatis';
import FloatingBlock from '@/components/FloatingBlock';
import AppConfigProvider from '@/components/AppConfigProvider';

// 加载本地字体
const LXGWWenKai = localFont({
  src: '../assets/font/LXGWWenKai-Regular.ttf',
  display: 'swap',
});

// 生成动态metadata
export async function generateMetadata(): Promise<Metadata> {
  const data = await getWebConfigCacheAPI();

  return {
    title: {
      default: `${data?.title ?? 'ThriveX'} - ${data?.subhead ?? '现代化博客管理系统'}`,
      template: `%s | ${data?.title ?? 'ThriveX'}`,
    },
    description: data?.description ?? 'ThriveX 现代化博客管理系统',
    keywords: data?.keyword ?? 'ThriveX,博客,Blog',
    authors: [{ name: data?.title ?? 'ThriveX' }],
    creator: data?.title ?? 'ThriveX',
    publisher: data?.title ?? 'ThriveX',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(data?.url ?? 'https://liuyuyang.net'),
    alternates: {
      canonical: '/',
    },
    openGraph: {
      type: 'website',
      locale: 'zh_CN',
      url: data?.url ?? 'https://liuyuyang.net',
      title: `${data?.title ?? 'ThriveX'} - ${data?.subhead ?? '现代化博客管理系统'}`,
      description: data?.description ?? 'ThriveX 现代化博客管理系统',
      siteName: data?.title ?? 'ThriveX',
      images: [
        {
          url: data?.favicon ?? '/favicon.ico',
          width: 1200,
          height: 630,
          alt: data?.title ?? 'ThriveX',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${data?.title ?? 'ThriveX'} - ${data?.subhead ?? '现代化博客管理系统'}`,
      description: data?.description ?? 'ThriveX 现代化博客管理系统',
      images: [data?.favicon ?? '/favicon.ico'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon.ico',
      apple: '/favicon.ico',
    },
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { web: data, theme, other, author } = await getAppConfigCacheAPI();

  return (
    <html lang="zh-CN" className={LXGWWenKai.className}>
      <head>
        {/* 动态favicon */}
        {data?.favicon && (
          <>
            <link rel="icon" type="image/x-icon" href={data.favicon} />
            <link rel="shortcut icon" type="image/x-icon" href={data.favicon} />
            <link rel="apple-touch-icon" href={data.favicon} />
          </>
        )}
        {/* 百度统计 */}
        <BaiduStatis other={other} />
      </head>

      {/* 监听路由变化 */}
      <RouteChangeHandler />

      <body id="root" className={`dark:bg-black-a!`}>
        <AppConfigProvider web={data} theme={theme} other={other} author={author}>
          {/* 🎉 礼花效果 */}
          {/* <Confetti /> */}

          {/* 进度条组件 */}
          <NProgress />
          {/* 顶部导航组件 */}
          <Header theme={theme} />

          {/* 主体内容 */}
          <div className="min-h-[calc(100vh-300px)]">{children}</div>

          {/* 底部组件 */}
          <Footer />
          {/* 右侧工具栏组件 */}
          {/* <Tools /> */}

          {/* 悬浮块 */}
          <FloatingBlock />
        </AppConfigProvider>
      </body>
    </html>
  );
}
