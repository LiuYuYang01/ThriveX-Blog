import { Metadata } from 'next';
import { getCateListAPI, getCateWallListAPI } from '@/api/wall';
import WallPageClient from '../components/WallPageClient';

export const metadata: Metadata = {
  title: '💌 留言墙',
  description: '💌 留言墙',
};

interface Props {
  params: Promise<{ cate: string }>;
}

export default async (props: Props) => {
  const { cate } = await props.params;
  const { data: cateList } = await getCateListAPI();
  const sorted = [...(cateList ?? [])].sort((a, b) => a.order - b.order);
  const activeCate = cate || sorted[0]?.mark || '';
  const cateId = sorted.find((item) => item.mark === activeCate)?.id ?? sorted[0]?.id ?? 0;
  const { data: wallsData } = await getCateWallListAPI(cateId);

  return (
    <WallPageClient
      cate={activeCate}
      cateList={sorted}
      walls={wallsData?.result ?? []}
    />
  );
};
