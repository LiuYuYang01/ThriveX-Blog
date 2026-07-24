import { PageHeroGrid } from '@/components/PageHeroHeader';

export default function AlbumLoading() {
  return (
    <main className="relative min-h-screen bg-[#f7f8fa] pb-20 dark:bg-black-a">
      <PageHeroGrid />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-32 sm:px-6">
        <div className="mx-auto mb-12 flex max-w-sm flex-col items-center gap-4 animate-pulse motion-reduce:animate-none">
          <div className="h-14 w-40 rounded-2xl bg-black/8 dark:bg-white/8" />
          <div className="h-4 w-56 rounded-full bg-black/6 dark:bg-white/6" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="aspect-[4/3] animate-pulse rounded-2xl bg-black/7 motion-reduce:animate-none dark:bg-white/7" />
          ))}
        </div>
      </div>
    </main>
  );
}
