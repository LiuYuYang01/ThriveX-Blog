import { PageHeroGrid } from '@/components/PageHeroHeader';

export default function AlbumPhotosLoading() {
  return (
    <main className="relative min-h-screen bg-[#f7f8fa] pb-20 dark:bg-black-a">
      <PageHeroGrid />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-28 sm:px-6 sm:pt-32">
        <div className="mb-10 animate-pulse motion-reduce:animate-none">
          <div className="h-5 w-24 rounded-full bg-black/8 dark:bg-white/8" />
          <div className="mt-8 h-12 w-48 rounded-2xl bg-black/8 dark:bg-white/8 sm:w-72" />
          <div className="mt-4 h-4 w-full max-w-md rounded-full bg-black/6 dark:bg-white/6" />
        </div>
        <div className="columns-1 gap-4 sm:columns-2 sm:gap-5 lg:columns-3">
          {Array.from({ length: 9 }, (_, index) => (
            <div
              key={index}
              className={`mb-4 break-inside-avoid animate-pulse rounded-2xl bg-black/7 motion-reduce:animate-none dark:bg-white/7 sm:mb-5 ${
                index % 3 === 0 ? 'aspect-[3/4]' : index % 3 === 1 ? 'aspect-[4/3]' : 'aspect-square'
              }`}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
