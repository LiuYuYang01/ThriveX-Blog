'use client';

import Link from 'next/link';
import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';

type QueryRecord = Record<string, string | number | boolean | undefined | null>;

/** 构建分页链接，第 1 页默认不带 page 参数 */
export function buildPageHref(
  pathname: string,
  page: number,
  options?: {
    param?: string;
    query?: QueryRecord;
  },
): string {
  const param = options?.param ?? 'page';
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(options?.query ?? {})) {
    if (value !== undefined && value !== null && key !== param) {
      search.set(key, String(value));
    }
  }

  if (page > 1) {
    search.set(param, String(page));
  }

  const qs = search.toString();
  const path = pathname || '/';
  return qs ? `${path}?${qs}` : path;
}


export type PageItem = number | 'ellipsis';

const range = (start: number, end: number): number[] =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i);

export function getPageRange(
  current: number,
  total: number,
  siblingCount = 1,
  boundaryCount = 5,
): PageItem[] {
  if (total <= 0) return [];
  if (total === 1) return [1];

  const c = Math.min(Math.max(1, current), total);
  const allPages = range(1, total);

  if (total <= boundaryCount + 2 + siblingCount * 2) {
    return allPages;
  }

  if (c <= boundaryCount + siblingCount) {
    const leadingEnd = Math.max(boundaryCount, c + siblingCount);
    if (leadingEnd >= total) return allPages;
    return [...range(1, leadingEnd), 'ellipsis', total];
  }

  if (c > total - boundaryCount - siblingCount) {
    const trailingStart = Math.min(total - boundaryCount + 1, c - siblingCount);
    return [1, 'ellipsis', ...range(trailingStart, total)];
  }

  return [
    1,
    'ellipsis',
    ...range(c - siblingCount, c + siblingCount),
    'ellipsis',
    total,
  ];
}

export interface PaginationProps {
  /** 当前页码，从 1 开始 */
  current: number;
  /** 总页数 */
  totalPages: number;
  /** 用于生成分页链接的基础路径 */
  basePath: string;
  /** 数据总条数，用于展示统计文案 */
  totalItems?: number;
  /** 每页条数，默认 10 */
  pageSize?: number;
  /** 当前页两侧显示的页码个数 */
  siblingCount?: number;
  /** 靠近首尾时连续展示的页码个数 */
  boundaryCount?: number;
  /** 点击省略号时跳转的页数 */
  dotsJump?: number;
  /** 分页链接中保留的查询参数 */
  query?: QueryRecord;
  className?: string;
}

function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      width="1em"
      height="1em"
    >
      <path
        d="M15.5 19l-7-7 7-7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      className={`rotate-180 ${className ?? ''}`}
      width="1em"
      height="1em"
    >
      <path
        d="M15.5 19l-7-7 7-7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function DotsIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      width="1em"
      height="1em"
    >
      <circle cx="5" cy="12" r="1" fill="currentColor" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
      <circle cx="19" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

function DoubleChevronIcon({ className }: { className?: string; }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      width="1em"
      height="1em"
    >
      <path
        d="M13 17l5-5-5-5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M6 17l5-5-5-5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

const navBtnClass =
  'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-200/50 text-neutral-700 outline-none transition-none hover:bg-neutral-200/80 active:bg-neutral-200/80 dark:bg-[#3d4654]/80 dark:text-neutral-200 dark:hover:bg-[#455162] dark:active:bg-[#455162] aria-disabled:pointer-events-none aria-disabled:cursor-default aria-disabled:bg-neutral-200/35 aria-disabled:text-neutral-300 aria-disabled:hover:bg-neutral-200/35 dark:aria-disabled:bg-[#2c333e] dark:aria-disabled:text-neutral-500 dark:aria-disabled:hover:bg-[#2c333e]';

const pageItemClass =
  'relative z-10 flex h-9 min-w-9 shrink-0 items-center justify-center rounded-xl px-2 text-sm text-neutral-700 outline-none transition-none hover:bg-neutral-200 active:bg-neutral-200 dark:text-neutral-300 dark:hover:bg-[#323e50] dark:active:bg-[#323e50]';

const pageItemActiveClass =
  'pointer-events-none hover:bg-transparent active:bg-transparent';

function NavButton({
  href,
  disabled,
  label,
  children,
}: {
  href?: string;
  disabled?: boolean;
  label: string;
  children: ReactNode;
}) {
  if (disabled || !href) {
    return (
      <li aria-disabled="true" className={navBtnClass} title={label}>
        {children}
      </li>
    );
  }

  return (
    <li>
      <Link href={href} className={navBtnClass} aria-label={label}>
        {children}
      </Link>
    </li>
  );
}

function EllipsisJump({
  href,
  backward,
  label,
  disabled,
}: {
  href?: string;
  backward?: boolean;
  label: string;
  disabled?: boolean;
}) {
  const className = `${pageItemClass} group bg-transparent shadow-none aria-disabled:pointer-events-none aria-disabled:cursor-default aria-disabled:text-neutral-300 dark:aria-disabled:text-neutral-600`;

  if (disabled || !href) {
    return (
      <li aria-disabled="true" className={className} title={label}>
        <DotsIcon />
      </li>
    );
  }

  return (
    <li>
      <Link
        href={href}
        aria-label={label}
        className={className}
      >
        <DotsIcon className="group-hover:hidden group-focus-visible:hidden" />
        <DoubleChevronIcon className={
          `hidden group-hover:block group-focus-visible:block ${backward ? 'rotate-180' : ''}`
        } />
      </Link>
    </li>
  );
}

function getEllipsisJumpPage(
  direction: 'forward' | 'backward',
  current: number,
  total: number,
  jump: number,
): number {
  if (direction === 'forward') {
    if (total - current <= jump) {
      return total;
    }
    return current + jump;
  }
  return Math.max(current - jump, 1);
}

function getEllipsisDirection(
  index: number,
  items: ReturnType<typeof getPageRange>,
): 'forward' | 'backward' {
  const ellipsisIndices = items.reduce<number[]>(
    (acc, item, i) => (item === 'ellipsis' ? [...acc, i] : acc),
    [],
  );
  if (ellipsisIndices.length === 1) return 'forward';
  return index === ellipsisIndices[0] ? 'backward' : 'forward';
}

export default function Pagination({
  current,
  totalPages,
  basePath,
  totalItems,
  pageSize = 10,
  siblingCount = 1,
  boundaryCount = 5,
  dotsJump = 5,
  query,
  className = '',
}: PaginationProps) {
  const hrefForPage = (page: number) => buildPageHref(basePath, page, { query });
  const listRef = useRef<HTMLUListElement>(null);
  const activeRef = useRef<HTMLSpanElement>(null);
  const [cursor, setCursor] = useState({ x: 0, width: 36, visible: false });

  const safeCurrent = Math.min(Math.max(1, current), totalPages);
  const range = getPageRange(safeCurrent, totalPages, siblingCount, boundaryCount);
  const rangeKey = range.join(',');
  const start = (safeCurrent - 1) * pageSize + 1;
  const end =
    totalItems != null
      ? Math.min(safeCurrent * pageSize, totalItems)
      : safeCurrent * pageSize;

  useLayoutEffect(() => {
    if (totalPages <= 1) return;

    const list = listRef.current;
    const active = activeRef.current;
    if (!list || !active) {
      setCursor((c) => ({ ...c, visible: false }));
      return;
    }

    const listRect = list.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();
    setCursor({
      x: activeRect.left - listRect.left,
      width: activeRect.width,
      visible: true,
    });
  }, [safeCurrent, rangeKey, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="分页导航"
      className={`flex flex-col items-center gap-4 ${className}`}
    >
      <div className="flex w-full justify-center overflow-x-auto p-2.5 -m-2.5 scrollbar-none">
        <ul
          ref={listRef}
          className="relative flex h-fit max-w-fit flex-nowrap items-center gap-1 overflow-visible rounded-xl"
        >
          <span
            aria-hidden
            className={`pointer-events-none absolute left-0 top-0 z-0 flex h-9 min-w-9 select-none items-center justify-center rounded-xl bg-primary text-sm font-medium text-white transition-[transform,width,opacity] duration-300 ease-out ${cursor.visible ? 'opacity-100' : 'opacity-0'}`}
            style={{
              width: cursor.width,
              transform: `translateX(${cursor.x}px)`,
            }}
          >
            {safeCurrent}
          </span>

          <NavButton
            href={safeCurrent > 1 ? hrefForPage(safeCurrent - 1) : undefined}
            disabled={safeCurrent <= 1}
            label="上一页"
          >
            <ChevronLeft className="h-4 w-4" />
          </NavButton>

          {range.map((item, index) => {
            if (item === 'ellipsis') {
              const direction = getEllipsisDirection(index, range);
              const jumpPage = getEllipsisJumpPage(
                direction,
                safeCurrent,
                totalPages,
                dotsJump,
              );
              const ellipsisDisabled = jumpPage === safeCurrent;
              return (
                <EllipsisJump
                  key={`ellipsis-${index}`}
                  href={ellipsisDisabled ? undefined : hrefForPage(jumpPage)}
                  disabled={ellipsisDisabled}
                  backward={direction === 'backward'}
                  label={direction === 'backward' ? '向前跳转' : '向后跳转'}
                />
              );
            }

            const active = item === safeCurrent;

            return (
              <li key={item}>
                {active ? (
                  <span
                    ref={activeRef}
                    aria-current="page"
                    aria-label={`第 ${item} 页，当前页`}
                    className={`${pageItemClass} ${pageItemActiveClass} text-transparent`}
                  >
                    {item}
                  </span>
                ) : (
                  <Link
                    href={hrefForPage(item)}
                    aria-label={`第 ${item} 页`}
                    className={pageItemClass}
                  >
                    {item}
                  </Link>
                )}
              </li>
            );
          })}

          <NavButton
            href={
              safeCurrent < totalPages ? hrefForPage(safeCurrent + 1) : undefined
            }
            disabled={safeCurrent >= totalPages}
            label="下一页"
          >
            <ChevronRight className="h-4 w-4" />
          </NavButton>
        </ul>
      </div>

      {totalItems != null ? (
        <p className="text-center text-xs tabular-nums text-neutral-400 dark:text-neutral-500">
          共{' '}
          <span className="font-medium text-neutral-600 dark:text-neutral-300">
            {totalItems}
          </span>{' '}
          篇
          <span className="mx-1.5 text-neutral-300 dark:text-neutral-600">·</span>
          第 {start}–{end} 篇
        </p>
      ) : null}
    </nav>
  );
}
