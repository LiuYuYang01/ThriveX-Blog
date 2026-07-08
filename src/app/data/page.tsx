import { Suspense } from 'react';
import { Metadata } from 'next';
import Slide from '@/components/Slide';
import Starry from '@/components/Starry';
import DataContent from './components/DataContent';
import DataContentFallback from './components/DataContentFallback';

export const metadata: Metadata = {
  title: '📊 数据统计',
  description: '📊 数据统计',
};

export default () => (
  <>
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-size-[64px_64px]" />
      <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary/6 blur-[120px]" />
      <div className="absolute top-1/4 right-0 w-96 h-96 rounded-full bg-violet-400/8 blur-[80px]" />
      <div className="absolute bottom-1/4 left-0 w-80 h-80 rounded-full bg-cyan-400/8 blur-[80px]" />
    </div>

    <Slide isRipple={false} src="https://bu.dusays.com/2025/12/04/6930fd6cda541.jpg">
      <Starry />

      <div className="absolute top-[45%] left-1/2 -translate-x-1/2 flex flex-col items-center">
        <h1 className="text-white text-2xl xs:text-3xl sm:text-4xl font-bold tracking-wide whitespace-nowrap custom_text_shadow drop-shadow-lg">
          数据统计
        </h1>
        <p className="mt-2 text-white/90 text-sm sm:text-base custom_text_shadow">博客运营数据一览</p>
      </div>
    </Slide>

    <div className="w-[92%] max-w-6xl mx-auto -mt-8 sm:-mt-12 relative z-10 mb-16">
      <Suspense fallback={<DataContentFallback />}>
        <DataContent />
      </Suspense>
    </div>
  </>
);
