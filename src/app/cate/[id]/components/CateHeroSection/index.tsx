import { connection } from 'next/server';

import { getCateArticleListCacheAPI, getCateListCacheAPI } from '@/lib/cate';
import CateHero from '../../../components/CateHero';
import CateHeroContent from '../../../components/CateHeroContent';
import { CATE_HERO_IMAGE, findCateById } from '../../../utils';

interface Props {
  params: Promise<{ id: number }>;
  searchParams: Promise<{ name?: string }>;
}

export default async ({ params, searchParams }: Props) => {
  await connection();
  const [{ id }, { name }] = await Promise.all([params, searchParams]);

  const [{ data }, { data: cateListData }] = await Promise.all([
    getCateArticleListCacheAPI(id, { pageNum: 1, pageSize: 8 }),
    getCateListCacheAPI(),
  ]);

  const cateInfo = findCateById(cateListData?.result ?? [], id);

  return (
    <CateHero image={CATE_HERO_IMAGE}>
      <CateHeroContent
        name={cateInfo?.name ?? name ?? '分类'}
        icon={cateInfo?.icon}
        articleCount={data?.total ?? 0}
      />
    </CateHero>
  );
};
