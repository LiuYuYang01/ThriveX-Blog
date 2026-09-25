import Link from 'next/link';
import React from 'react';

import { Cate } from '@/types/app/cate';
import { getCateNavHref, getCateNavRel, getCateNavTarget } from '@/utils/cateNav';

const getSubmenuGridClass = (count: number) => {
  if (count <= 3) return 'grid-cols-1 w-max min-w-[160px]';
  if (count <= 6) return 'grid-cols-2 w-[300px]';
  return 'grid-cols-3 w-[420px]';
};

const getSubmenuPositionClass = (count: number) => (count <= 3 ? 'left-0' : 'left-1/2 -translate-x-1/2');

const submenuPanelClass =
  'invisible opacity-0 scale-[0.98] pointer-events-none group-hover/one:visible group-hover/one:opacity-100 group-hover/one:scale-100 group-hover/one:pointer-events-auto transition-[opacity,scale,visibility] duration-200 ease-out absolute top-[calc(100%-4px)] z-10 pt-1.5 overflow-hidden rounded-xl before:absolute before:inset-x-0 before:-top-1.5 before:h-1.5 before:content-[""]';

const submenuItemClass =
  'group/item flex w-full min-w-0 items-center gap-2 rounded-lg px-3 py-2.5 text-[14px] text-[#666] dark:text-white cursor-pointer hover:text-primary! hover:bg-[#f0f7ff] dark:hover:bg-[#3a4556]';

export default ({ items, showIcon, onNavClick }: { items: Cate[]; showIcon?: boolean; onNavClick: (e: React.MouseEvent, href: string) => void }) => {
  const count = items.length;
  return (
    <ul
      className={`${submenuPanelClass} ${getSubmenuPositionClass(count)} grid ${getSubmenuGridClass(count)} gap-1 p-1.5 border border-black/5 dark:border-white/10 bg-[rgba(255,255,255,0.6)] dark:bg-[rgba(44,51,62,0.6)] backdrop-blur-md`}
      style={{ boxShadow: '0 12px 32px rgba(0, 0, 0, 0.1), 0 2px 6px rgba(0, 0, 0, 0.08)' }}
    >
      {items.map((two) => {
        const href = getCateNavHref(two);
        return (
          <li key={two.id}>
            <Link
              href={href}
              target={getCateNavTarget(two.type)}
              rel={getCateNavRel(two.type)}
              title={two.name}
              className={submenuItemClass}
              onClick={(e) => onNavClick(e, href)}
            >
              {showIcon && two.icon ? <span className="shrink-0 text-base leading-none">{two.icon}</span> : null}
              <span className="truncate">{two.name}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};
