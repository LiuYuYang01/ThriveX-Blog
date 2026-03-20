import Slide from '@/components/Slide';
import Starry from '@/components/Starry';
import Statis from './components/Statis';
import Archiving from './components/Archiving';
import { getArticleListAPI } from '@/api/article';

export default async () => {
  const { data } = await getArticleListAPI();

  return (
    <>
      <title>📊 数据统计</title>
      <meta name="description" content="📊 数据统计" />

      {/* 背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary/6 blur-[120px]" />
        <div className="absolute top-1/4 right-0 w-96 h-96 rounded-full bg-violet-400/8 blur-[80px]" />
        <div className="absolute bottom-1/4 left-0 w-80 h-80 rounded-full bg-cyan-400/8 blur-[80px]" />
      </div>

      <Slide isRipple={false} src="https://bu.dusays.com/2025/12/04/6930fd6cda541.jpg">
        {/* 星空背景组件 */}
        <Starry />

        <div className="absolute top-[45%] left-1/2 -translate-x-1/2 flex flex-col items-center">
          <h1 className="text-white text-2xl xs:text-3xl sm:text-4xl font-bold tracking-wide whitespace-nowrap custom_text_shadow drop-shadow-lg">
            数据统计
          </h1>
          <p className="mt-2 text-white/90 text-sm sm:text-base custom_text_shadow">博客运营数据一览</p>
        </div>
      </Slide>

      <div className="w-[92%] max-w-6xl mx-auto -mt-8 sm:-mt-12 relative z-10 mb-16">
        <div className="rounded-2xl shadow-xl overflow-hidden bg-white dark:bg-black-b/95 backdrop-blur-sm border border-slate-200/80 dark:border-slate-700/50">
          <div className="p-6 sm:p-10 lg:p-12 space-y-12">
            <Statis aTotal={data?.total ?? 0} />
            <Archiving list={data?.result ?? []} />
          </div>
        </div>
      </div>
    </>
  );
};
