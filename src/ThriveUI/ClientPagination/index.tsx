'use client';

import { getPageRange } from '../Pagination';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';

export interface ClientPaginationProps {
  total: number;
  page: number;
  onChange: (page: number) => void;
  showControls?: boolean;
  className?: string;
}

const itemCls =
  'flex h-9 min-w-9 cursor-pointer items-center justify-center rounded-xl px-2 text-sm text-neutral-700 dark:text-neutral-300 transition-none hover:bg-neutral-200 dark:hover:bg-[#323e50]';
const navCls =
  'flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-neutral-200/50 text-neutral-700 transition-none hover:bg-neutral-200/80 dark:bg-[#3d4654]/80 dark:text-neutral-200 dark:hover:bg-[#455162] disabled:cursor-not-allowed disabled:opacity-40';

export function ClientPagination({
  total,
  page,
  onChange,
  showControls = true,
  className = '',
}: ClientPaginationProps) {
  if (total <= 1) return null;

  const safePage = Math.min(Math.max(1, page), total);
  const range = getPageRange(safePage, total);

  return (
    <nav aria-label="分页导航" className={`flex justify-center ${className}`}>
      <ul className="flex items-center gap-1">
        {showControls ? (
          <li>
            <button
              type="button"
              aria-label="上一页"
              disabled={safePage <= 1}
              onClick={() => onChange(safePage - 1)}
              className={navCls}
            >
              <LuChevronLeft className="h-4 w-4" />
            </button>
          </li>
        ) : null}

        {range.map((item, index) =>
          item === 'ellipsis' ? (
            <li key={`e-${index}`} className={`${itemCls} cursor-default`}>
              …
            </li>
          ) : (
            <li key={item}>
              <button
                type="button"
                aria-label={`第 ${item} 页`}
                aria-current={item === safePage ? 'page' : undefined}
                onClick={() => onChange(item)}
                className={`${itemCls} ${
                  item === safePage ? 'bg-primary font-medium text-white hover:bg-primary' : ''
                }`}
              >
                {item}
              </button>
            </li>
          ),
        )}

        {showControls ? (
          <li>
            <button
              type="button"
              aria-label="下一页"
              disabled={safePage >= total}
              onClick={() => onChange(safePage + 1)}
              className={navCls}
            >
              <LuChevronRight className="h-4 w-4" />
            </button>
          </li>
        ) : null}
      </ul>
    </nav>
  );
}

export default ClientPagination;
