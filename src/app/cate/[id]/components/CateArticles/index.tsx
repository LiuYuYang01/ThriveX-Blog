import { connection } from 'next/server';

import Classics from '@/components/ArticleLayout/Classics';
import Pagination from '@/components/Pagination';
import { getCateArticleListCacheAPI } from '@/lib/cate';

interface Props {
  id: number;
  searchParams: Promise<{ page?: number; name?: string }>;
}

export default async ({ id, searchParams }: Props) => {
  await connection();
  const { page: pageParam, name } = await searchParams;
  const page = Number(pageParam) || 1;

  const { data } = await getCateArticleListCacheAPI(id, { pageNum: page, pageSize: 8 });

  return (
    <>
      <Classics data={data} />
      {data?.total > 0 && (
        <Pagination
          total={data.pages}
          page={page}
          basePath={`/cate/${id}`}
          path={name ? `?name=${name}` : undefined}
          className="flex justify-center mt-5"
        />
      )}
    </>
  );
};
