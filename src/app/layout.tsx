import localFont from 'next/font/local';
import { Metadata } from 'next';
import { connection } from 'next/server';
import { Suspense } from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Tools from '@/components/Tools';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Confetti from '@/components/Confetti';
import RootLayoutContent from '@/components/RootLayoutContent';

import { getWebConfigCacheAPI } from '@/lib/config';

// 加载样式文件
import '@/styles/tailwind.css';
import '@/styles/global.scss';
import '@/styles/index.scss';
// 加载本地字体
const LXGWWenKai = localFont({
  src: '../assets/font/LXGWWenKai-Regular.ttf',
  display: 'swap',
});

// 生成动态metadata
export async function generateMetadata(): Promise<Metadata> {
  await connection();
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
      icon: data?.favicon ?? '/favicon.ico',
      shortcut: data?.favicon ?? '/favicon.ico',
      apple: data?.favicon ?? '/favicon.ico',
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" className={LXGWWenKai.className}>
      <body id="root" className={`dark:bg-black-a!`}>
        <Suspense fallback={null}>
          <RootLayoutContent>{children}</RootLayoutContent>
        </Suspense>
      </body>
    </html>
  );
}
