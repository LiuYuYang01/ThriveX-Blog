import Classics from '@/components/ArticleLayout/Classics';
import Pagination from '@/components/Pagination';
import { getTagArticleListCacheAPI } from '@/lib/tag';

interface Props {
  id: number;
  searchParams: Promise<{ page?: number; name?: string }>;
}

export default async ({ id, searchParams }: Props) => {
  const { page: pageParam, name } = await searchParams;
  const page = Number(pageParam) || 1;

  const { data } = await getTagArticleListCacheAPI(id, { pageNum: page, pageSize: 8 });

  return (
    <>
      <Classics data={data} />
      {data?.total > 0 && (
        <Pagination
          total={data.pages}
          page={page}
          basePath={`/tag/${id}`}
          path={name ? `?name=${name}` : undefined}
          className="flex justify-center mt-5"
        />
      )}
    </>
  );
};
