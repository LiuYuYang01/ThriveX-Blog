import Skeleton from '@/components/Skeleton';
import { PageHeroGrid } from '@/components/PageHeroHeader';

/** 闪念页骨架：与时间轴版式对应的加载态 */
export default function RecordLoading() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fbfbfd] px-4 pb-16 sm:px-6 lg:px-8 dark:bg-[#111318]">
      <PageHeroGrid />

      <div className="relative mx-auto w-full max-w-[760px] pt-28">
        <div className="mb-12 flex flex-col items-center gap-4">
          <Skeleton className="h-14 w-44 rounded-2xl" />
          <Skeleton className="h-4 w-56 rounded-full" />
        </div>

        <div className="space-y-5 pl-8 md:pl-7">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="rounded-2xl border border-black/6 bg-white p-5 dark:border-white/8 dark:bg-[#1a212b]">
              <div className="space-y-2.5">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <Skeleton className="mt-4 h-24 w-full max-w-72 rounded-xl" />
              <div className="mt-4 flex justify-between">
                <Skeleton className="h-3.5 w-20" />
                <Skeleton className="h-3.5 w-14" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
