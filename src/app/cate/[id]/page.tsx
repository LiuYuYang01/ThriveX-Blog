import { Metadata } from 'next';
import { getCateArticleListCacheAPI, getCateListCacheAPI } from '@/lib/cate';
import Classics from '@/components/ArticleLayout/Classics';
import Pagination from '@/components/Pagination';
import CateHero from '../components/CateHero';
import CateHeroContent from '../components/CateHeroContent';
import { CATE_HERO_IMAGE, findCateById } from '../utils';

interface Props {
  params: Promise<{ id: number }>;
  searchParams: Promise<{ page: number; name: string }>;
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
  const searchParams = await props.searchParams;
  const params = await props.params;
  const id = params.id;
  const page = +(searchParams.page ?? 1);
  const name = searchParams.name;

  const [{ data }, { data: cateListData }] = await Promise.all([
    getCateArticleListCacheAPI(id, { pageNum: page, pageSize: 8 }),
    getCateListCacheAPI(),
  ]);

  const cateInfo = findCateById(cateListData?.result ?? [], id);

  return (
    <>
      <div className="min-h-screen bg-background text-foreground dark:bg-black-a">
        <CateHero image={CATE_HERO_IMAGE}>
          <CateHeroContent
            name={cateInfo?.name ?? name}
            icon={cateInfo?.icon}
            articleCount={data?.total ?? 0}
          />
        </CateHero>

        <main className="relative mx-auto max-w-[900px] px-3 pb-10 sm:mt-8 sm:px-6 sm:pb-12 lg:px-8">
          <Classics data={data} />

          {data?.total > 0 && (
            <Pagination total={data?.pages} page={page} path={`?name=${name}`} className="flex justify-center mt-5" />
          )}
        </main>
      </div>
    </>
  );
};
