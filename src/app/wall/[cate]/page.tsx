import { Metadata } from 'next';
import { connection } from 'next/server';
import { getWallCateListCacheAPI, getCateWallListCacheAPI } from '@/lib/wall';
import WallPageClient from '../components/WallPageClient';
export const metadata: Metadata = {
  title: '💌 留言墙',
  description: '💌 留言墙',
};

interface Props {
  params: Promise<{ cate: string }>;
}

export default async (props: Props) => {
  await connection();
  const { cate } = await props.params;
  const { data: cateList } = await getWallCateListCacheAPI();
  const sorted = [...(Array.isArray(cateList) ? cateList : [])].sort((a, b) => a.order - b.order);
  const activeCate = cate || sorted[0]?.mark || '';
  const cateId = sorted.find((item) => item.mark === activeCate)?.id ?? sorted[0]?.id ?? 0;
  const { data: wallsData } = await getCateWallListCacheAPI(cateId);

  return (
    <WallPageClient
      cate={activeCate}
      cateList={sorted}
      walls={wallsData?.result ?? []}
    />
  );
};
