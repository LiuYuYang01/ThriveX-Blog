'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRecordModalStore } from '@/stores';

/** 直接访问 /record 时打开弹窗并回到首页，保持当前页弹出体验 */
export default function RecordPageOpener() {
  const router = useRouter();
  const openModal = useRecordModalStore((s) => s.openModal);

  useEffect(() => {
    openModal();
    router.replace('/');
  }, [openModal, router]);

  return <div className="min-h-screen" aria-hidden />;
}
