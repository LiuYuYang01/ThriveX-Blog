'use client';

import { useRouter } from 'next/navigation';
import { ClientPagination } from '@/ThriveUI';

interface Props {
  total: number;
  page: number;
  size?: number;
  path?: string;
  className?: string;
}

export default ({ total, page, path, className }: Props) => {
  const router = useRouter();

  const onChange = (page: number) => {
    router.push(path ? `${path}&page=${page}` : `?page=${page}`);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className={className}>
      <ClientPagination showControls total={total} page={+page} onChange={onChange} />
    </div>
  );
};
