import { Suspense } from 'react';
import { Metadata } from 'next';

import ArticlesFallback from '@/components/ArticlesFallback';
import { getCateListCacheAPI } from '@/lib/cate';
import CateHeroSection from './components/CateHeroSection';
import CateArticles from './components/CateArticles';
import { findCateById } from '../utils';

interface Props {
  params: Promise<{ id: number }>;
  searchParams: Promise<{ page?: number; name?: string }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const [params, searchParams] = await Promise.all([props.params, props.searchParams]);
  const { data: cateListData } = await getCateListCacheAPI();
  const cateInfo = findCateById(cateListData?.result ?? [], params.id);
  const name = cateInfo?.name ?? searchParams.name ?? '分类';

  return {
    title: `${name} - 分类`,
    description: name,
  };
}

export default async (props: Props) => {
  const params = await props.params;
  const id = params.id;

  return (
    <div className="min-h-screen bg-background text-foreground dark:bg-black-a">
      <CateHeroSection params={props.params} searchParams={props.searchParams} />

      <main className="relative mx-auto max-w-[900px] px-3 pb-10 sm:mt-8 sm:px-6 sm:pb-12 lg:px-8">
        <Suspense fallback={<ArticlesFallback count={3} />}>
          <CateArticles id={id} searchParams={props.searchParams} />
        </Suspense>
      </main>
    </div>
  );
};
