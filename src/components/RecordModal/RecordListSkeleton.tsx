import Skeleton from '@/components/Skeleton';

function RecordItemSkeleton() {
  return (
    <div className="flex gap-2.5 border-b border-[#f0f0f0] bg-white px-4 py-3 dark:border-white/8 dark:bg-[#1e2430]">
      <Skeleton className="mt-0.5 h-10 w-10 shrink-0 rounded-md" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-4/5" />
        <Skeleton className="mt-1 h-28 w-full max-w-60 rounded" />
        <div className="flex items-center justify-between pt-0.5">
          <Skeleton className="h-3 w-16" />
          <div className="flex gap-3">
            <Skeleton className="h-3.5 w-6" />
            <Skeleton className="h-3.5 w-6" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RecordListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <RecordItemSkeleton key={i} />
      ))}
    </>
  );
}
