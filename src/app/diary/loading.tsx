import Skeleton from '@/components/Skeleton';

/** 日记本页骨架：封面 + 密语列表的加载态 */
export default function DiaryLoading() {
  return (
    <div className="diary-scene relative min-h-screen overflow-hidden px-4 pb-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-[980px] items-center gap-12 pt-16 lg:grid-cols-[300px_minmax(0,1fr)] lg:pt-24">
        <Skeleton className="mx-auto aspect-[450/680] w-[240px] rounded-md bg-[rgba(238,227,200,0.22)] sm:w-[270px]" />
        <div>
          <Skeleton className="h-7 w-56 rounded-full bg-[rgba(238,227,200,0.22)]" />
          <Skeleton className="mt-4 h-4 w-full max-w-[420px] rounded-full bg-[rgba(238,227,200,0.16)]" />
          <div className="mt-8 space-y-2">
            <Skeleton className="h-12 w-full rounded-lg bg-[rgba(238,227,200,0.14)]" />
            <Skeleton className="h-12 w-full rounded-lg bg-[rgba(238,227,200,0.14)]" />
          </div>
          <Skeleton className="mt-6 h-10 w-full rounded-lg bg-[rgba(238,227,200,0.16)]" />
          <Skeleton className="mt-6 h-10 w-40 rounded-xl bg-[rgba(238,227,200,0.2)]" />
        </div>
      </div>
    </div>
  );
}
