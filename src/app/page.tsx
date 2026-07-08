import { Suspense } from 'react';

import HomeContent from './components/HomeContent';

interface Props {
  searchParams: Promise<{ page?: number }>;
}

export default async (props: Props) => {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen animate-pulse bg-neutral-100 dark:bg-neutral-900" aria-hidden />
      }
    >
      <HomeContent page={page} />
    </Suspense>
  );
};
