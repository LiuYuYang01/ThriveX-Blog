import Pagination from '@/ThriveUI/Pagination';

interface Props {
  total: number;
  page: number;
  basePath: string;
  path?: string;
  className?: string;
}

function parseQuery(path?: string): Record<string, string> {
  if (!path) return {};
  const qs = path.startsWith('?') ? path.slice(1) : path;
  return Object.fromEntries(new URLSearchParams(qs));
}

export default ({ total, page, basePath, path, className }: Props) => (
  <Pagination
    current={+page}
    totalPages={total}
    basePath={basePath}
    query={parseQuery(path)}
    className={className}
  />
);
