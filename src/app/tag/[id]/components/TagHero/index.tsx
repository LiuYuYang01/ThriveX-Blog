import { connection } from 'next/server';

import Starry from '@/components/Starry';
import Slide from '@/components/Slide';
import { getTagArticleListCacheAPI } from '@/lib/tag';
import { getThemeCoversCacheAPI } from '@/lib/theme';

interface Props {
  id: number;
  searchParams: Promise<{ name?: string }>;
}

export default async ({ id, searchParams }: Props) => {
  await connection();
  const name = (await searchParams).name ?? '标签';

  const [{ data }, covers] = await Promise.all([
    getTagArticleListCacheAPI(id, { pageNum: 1, pageSize: 8 }),
    getThemeCoversCacheAPI(),
  ]);

  return (
    <Slide isRipple={false} covers={covers}>
      <Starry />
      <div className="absolute top-[40%] left-[50%] transform -translate-x-1/2 w-[80%] text-center text-white text-[20px] xs:text-[25px] sm:text-[30px] custom_text_shadow">
        <span>
          该标签：{name} ~ 共计{data?.total}篇文章
        </span>
      </div>
    </Slide>
  );
};
