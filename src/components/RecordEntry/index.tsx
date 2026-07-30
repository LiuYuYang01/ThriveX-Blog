'use client';

import { IoSparkles } from 'react-icons/io5';
import { useRecordModalStore } from '@/stores';

export default function RecordEntry() {
  const open = useRecordModalStore((s) => s.open);
  const openModal = useRecordModalStore((s) => s.openModal);

  if (open) return null;

  return (
    <button
      type="button"
      onClick={openModal}
      aria-label="打开闪念"
      title="闪念"
      className="group fixed right-5 bottom-6 z-40 inline-flex cursor-pointer items-center gap-2 rounded-full border-0 bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-[0_10px_28px_rgba(83,157,253,0.45)] hover:brightness-105 active:scale-95 sm:right-10 sm:bottom-8"
    >
      <span className="relative flex size-5 items-center justify-center">
        <IoSparkles className="h-4 w-4 transition-[scale] group-hover:scale-110" />
        <span className="absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-white" />
      </span>
      <span>闪念</span>
    </button>
  );
}
