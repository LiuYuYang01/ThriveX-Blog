'use client';

import { usePathname, useRouter } from 'next/navigation';
import { IoSparkles } from 'react-icons/io5';
import './index.scss';

export default function RecordEntry() {
  const router = useRouter();
  const pathname = usePathname();

  // 已经在闪念页时不展示入口
  if (pathname === '/record') return null;

  return (
    <button
      type="button"
      onClick={() => router.push('/record')}
      aria-label="打开闪念"
      title="闪念"
      className="group fixed right-5 bottom-6 z-40 inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-4.5 py-3 text-sm font-medium text-white shadow-[0_10px_28px_rgba(83,157,253,0.45)] transition-[scale,box-shadow] duration-300 hover:scale-105 hover:shadow-[0_14px_36px_rgba(83,157,253,0.6)] focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:scale-95 sm:right-10 sm:bottom-8"
    >
      <span className="relative flex size-5 items-center justify-center">
        <IoSparkles className="size-4 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
        <span className="record-sparkle-dot absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-white/90" />
      </span>
      <span>闪念</span>
    </button>
  );
}