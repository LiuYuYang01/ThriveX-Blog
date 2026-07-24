'use client';

import { HiOutlineArrowPath, HiOutlinePhoto } from 'react-icons/hi2';

export default function AlbumError({ reset }: { reset: () => void }) {
  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-[#f7f8fa] px-5 pt-20 dark:bg-black-a">
      <div className="w-full max-w-md rounded-[28px] border border-black/7 bg-white p-8 text-center shadow-[0_24px_70px_rgba(15,23,42,0.1)] dark:border-white/8 dark:bg-black-b dark:shadow-[0_24px_70px_rgba(0,0,0,0.28)] sm:p-10">
        <span className="mx-auto inline-flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <HiOutlinePhoto className="size-8" />
        </span>
        <h1 className="mt-6 text-2xl font-semibold text-[#1d2433] dark:text-white">画廊暂时走神了</h1>
        <p className="mt-3 text-sm leading-7 text-[#667085] dark:text-slate-300">照片没有按时抵达，请稍后再试一次。</p>
        <button
          type="button"
          onClick={reset}
          className="mt-7 inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(83,157,253,0.3)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <HiOutlineArrowPath className="size-4" />
          重新加载
        </button>
      </div>
    </main>
  );
}
