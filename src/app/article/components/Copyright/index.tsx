'use client';

import { FiPenTool } from 'react-icons/fi';

const Copyright = () => {

  return (
    <div className="my-10 w-full select-none">
      <div className="relative flex flex-col gap-4 pt-8 border-t border-gray-200 dark:border-white/10">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white dark:bg-black-b px-3 text-primary dark:text-blue-400">
          <FiPenTool className="text-sm -rotate-45" />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm sm:text-base text-gray-500 dark:text-gray-400 font-serif italic">
          <span className="text-gray-300 dark:text-white/20 text-xs" aria-hidden="true">•</span>

          <span className="text-pretty text-center leading-relaxed">
            除特别声明外，版权均属作者所有
          </span>
        </div>

        <p className="text-center text-[10px] sm:text-xs text-gray-400/80 dark:text-gray-600 tracking-wide font-mono">
          REPRINT PLEASE INDICATE SOURCE
        </p>
      </div>
    </div>
  );
};

export default Copyright;