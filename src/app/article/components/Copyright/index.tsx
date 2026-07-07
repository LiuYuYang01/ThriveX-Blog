'use client';

import { useAppConfig } from '@/components/AppConfigProvider';
import { FiShield, FiUser } from 'react-icons/fi';

const Copyright = () => {
  const { author } = useAppConfig();

  // 增加一个 fallback，防止未加载时出现空隙
  const authorName = author?.name || '匿名作者';

  return (
    <div
      className="relative w-full p-4 sm:p-5 mt-8 overflow-hidden rounded-xl 
      bg-[#ecf7fe]/60 border border-[#ecf7fe] 
      dark:bg-[#28323f] dark:border-gray-800/60"
    >
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary dark:bg-blue-500/80 rounded-l-xl" />

      <FiShield className="absolute right-2.5 top-5 text-7xl text-blue-500/4 dark:text-gray-700 pointer-events-none rotate-12" />

      <div className="relative z-10 flex flex-col gap-3.5">
        <div className="flex items-center gap-3 text-sm sm:text-base text-gray-700 dark:text-gray-300">
          <div className="flex items-center justify-center shrink-0 w-7 h-7 rounded-full bg-gray-50 dark:bg-transparent shadow-xs text-primary dark:text-gray-400">
            <FiUser className="text-base" />
          </div>
          <p>
            <span className="font-medium text-gray-900 dark:text-gray-100">{authorName}</span>
          </p>
        </div>

        <div className="flex items-start sm:items-center gap-3 text-sm sm:text-base text-gray-700 dark:text-gray-300">
          <div className="flex items-center justify-center shrink-0 w-7 h-7 rounded-full bg-gray-50 dark:bg-transparent shadow-xs mt-0.5 sm:mt-0 text-primary dark:text-gray-400">
            <FiShield className="text-base" />
          </div>
          <p className="leading-relaxed">
            除特别声明外，版权均归 <span className="font-medium text-gray-900 dark:text-gray-100">{authorName}</span> 所有。转载请注明出处！
          </p>
        </div>
      </div>
    </div>
  );
};

export default Copyright;
