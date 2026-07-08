import Link from 'next/link';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { cn } from '@/lib/utils';

export interface ArticleInfo {
  id: number;
  title: string;
}

export interface ArticleNavigationProps {
  currentId: number;
  prev?: ArticleInfo | null;
  next?: ArticleInfo | null;
}

const cardBaseClass = cn(
  'group relative flex w-full flex-col justify-center rounded-2xl border p-5 sm:p-6',
  'focus:outline-hidden focus:ring-2 focus:ring-primary/50',
);

const cardMotionClass = cn(
  'transition-[translate,box-shadow] duration-500 ease-out',
);

const cardActiveClass = cn(
  'cursor-pointer bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)]',
  'border-gray-200 hover:-translate-y-1',
  'hover:shadow-[0_12px_28px_-6px_rgba(83,157,253,0.2)]',
  'dark:border-gray-800 dark:bg-black-b dark:shadow-none',
  'dark:hover:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.45)]',
);

const cardDisabledClass = cn(
  'cursor-not-allowed border-gray-100 bg-gray-50 opacity-60',
  'dark:border-gray-800/50 dark:bg-[#313842]',
);

const labelClass = cn(
  'mb-2 flex items-center space-x-2 text-sm text-gray-500 transition-none',
  'group-hover:text-primary dark:text-gray-400 dark:group-hover:text-primary',
);

const arrowClass = cn(
  'text-lg transition-[translate,scale] duration-500 ease-out',
  'group-hover:-translate-x-1 group-hover:scale-110',
);

const arrowRightClass = cn(
  'text-lg transition-[translate,scale] duration-300 ease-out',
  'group-hover:translate-x-1 group-hover:scale-110',
);

export default function ArticleNavigation({ prev, next }: ArticleNavigationProps) {
  return (
    <nav className="mb-8 mt-12 w-full">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
        {prev ? (
          <Link href={`/article/${prev.id}`} className={cn(cardBaseClass, cardMotionClass, cardActiveClass, 'items-start')}>
            <div className={labelClass}>
              <FiArrowLeft className={arrowClass} />
              <span>上一篇</span>
            </div>
            <h3 className="line-clamp-2 text-base font-medium leading-relaxed text-gray-900 dark:text-gray-100 sm:text-lg">
              {prev.title}
            </h3>
          </Link>
        ) : (
          <div className={cn(cardBaseClass, cardDisabledClass, 'items-start')}>
            <div className="mb-2 flex items-center space-x-2 text-sm text-gray-300 dark:text-gray-600">
              <FiArrowLeft className="text-lg" />
              <span>上一篇</span>
            </div>
            <p className="text-base text-gray-600 dark:text-white sm:text-lg">已经是第一篇了</p>
          </div>
        )}

        {next ? (
          <Link href={`/article/${next.id}`} className={cn(cardBaseClass, cardMotionClass, cardActiveClass, 'items-end text-right')}>
            <div className={cn(labelClass, 'flex-row-reverse space-x-reverse')}>
              <FiArrowRight className={arrowRightClass} />
              <span>下一篇</span>
            </div>
            <h3 className="line-clamp-2 text-base font-medium leading-relaxed text-gray-900 dark:text-gray-100 sm:text-lg">
              {next.title}
            </h3>
          </Link>
        ) : (
          <div className={cn(cardBaseClass, cardDisabledClass, 'items-end text-right')}>
            <div className="mb-2 flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-500">
              <span>下一篇</span>
              <FiArrowRight className="text-lg" />
            </div>
            <p className="text-base text-gray-600 dark:text-white sm:text-lg">已经是最后一篇了</p>
          </div>
        )}
      </div>
    </nav>
  );
}
