'use client';

import { IoSearchOutline } from 'react-icons/io5';
import { useCommandPaletteStore } from '@/stores';

interface Props {
  // 是否在沉浸式头图上（白色文字状态）
  overHero: boolean;
}

// 顶栏搜索入口：点击打开全局命令面板，桌面端常驻快捷键提示
export default ({ overHero }: Props) => {
  const openPalette = useCommandPaletteStore((s) => s.openModal);

  return (
    <button
      type="button"
      onClick={openPalette}
      aria-label="搜索"
      title="搜索"
      className={`flex size-9 shrink-0 items-center justify-center rounded-full text-[13px] cursor-pointer md:size-auto md:gap-2 md:px-3.5 md:py-1.5 ${
        overHero
          ? 'border-white/40 text-white hover:bg-white/10'
          : 'border-[#d8dee8] text-[#333] hover:bg-black/5 dark:border-[#4e5969] dark:text-white dark:hover:bg-white/10'
      }`}
    >
      <IoSearchOutline className="text-base" />
    </button>
  );
};
