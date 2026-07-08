import { Suspense } from 'react';
import { Metadata } from 'next';

import ArticlesFallback from '@/components/ArticlesFallback';
import TagHero from './components/TagHero';
import TagArticles from './components/TagArticles';

interface Props {
  params: Promise<{ id: number }>;
  searchParams: Promise<{ page?: number; name?: string }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const name = searchParams.name ?? '标签';

  return {
    title: `🔖 ${name} - 标签`,
    description: name,
  };
}

export default async (props: Props) => {
  const params = await props.params;
  const id = params.id;

  return (
    <>
      <TagHero id={id} searchParams={props.searchParams} />

      <div className="md:w-full lg:w-[900px] lg:mx-auto px-4 lg:p-0 my-5">
        <Suspense fallback={<ArticlesFallback count={3} />}>
          <TagArticles id={id} searchParams={props.searchParams} />
        </Suspense>
      </div>
    </>
  );
};
