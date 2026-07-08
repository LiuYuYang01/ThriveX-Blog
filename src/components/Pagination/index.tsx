'use client';

import { usePathname } from 'next/navigation';
import Pagination from '@/ThriveUI/Pagination';

interface Props {
  total: number;
  page: number;
  path?: string;
  className?: string;
}

function parseQuery(path?: string): Record<string, string> {
  if (!path) return {};
  const qs = path.startsWith('?') ? path.slice(1) : path;
  return Object.fromEntries(new URLSearchParams(qs));
}

export default ({ total, page, path, className }: Props) => {
  const pathname = usePathname();

  return (
    <Pagination
      current={+page}
      totalPages={total}
      basePath={pathname}
      query={parseQuery(path)}
      className={className}
    />
  );
};
