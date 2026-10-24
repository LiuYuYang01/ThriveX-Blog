import Skeleton from '@/components/Skeleton';

/** 日记本页骨架：封面 + 密语列表的加载态 */
export default function DiaryLoading() {
  return (
    <div className="min-h-screen bg-[#fbfbfd] px-4 pb-20 sm:px-6 lg:px-8 dark:bg-[#111318]">
      <div className="mx-auto grid w-full max-w-[980px] items-center gap-12 pt-16 lg:grid-cols-[300px_minmax(0,1fr)] lg:pt-24">
        <Skeleton className="mx-auto aspect-[3/4] w-[240px] rounded-lg sm:w-[270px]" />
        <div>
          <Skeleton className="h-7 w-56 rounded-full" />
          <Skeleton className="mt-4 h-4 w-full max-w-[420px] rounded-full" />
          <div className="mt-8 space-y-2">
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
          <Skeleton className="mt-6 h-10 w-full rounded-lg" />
          <Skeleton className="mt-6 h-10 w-40 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
