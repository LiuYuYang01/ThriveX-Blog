import Link from 'next/link';
import Image from 'next/image';
import { getArticlePagingCacheAPI } from '@/lib/article';
import { IoIosArrowForward } from 'react-icons/io';
import FireSvg from '@/assets/svg/other/fire.svg';
import SidebarCard from '@/components/Sidebar/SidebarCard';
import { Article } from '@/types/app/article';

const HotArticle = async ({ recoArticleIds = [] }: { recoArticleIds?: number[] }) => {
  const { data: article } = await getArticlePagingCacheAPI();
  const ids = recoArticleIds.map((item) => Number(item));
  const list = article?.result.filter((item: Article) => ids.includes(item.id as number)) ?? [];

  return (
    <div className="hotArticleComponent">
      <SidebarCard
        title={
          <>
            <Image src={FireSvg} alt="作者推荐" width={30} height={20} />
            <span> 作者推荐</span>
          </>
        }
        contentClassName="flex flex-col px-3 py-2 w-full"
      >
        {list?.map((item: Article) => (
          <div key={item.id} className="border-b border-dashed border-gray-100 dark:border-[#3d4654] last:border-none">
            <Link href={`/article/${item.id}`} target="_blank" className="group flex items-center justify-between py-3.5 w-full transition-none">
              <span className="text-sm font-medium text-gray-600 dark:text-[#8c9ab1] group-hover:text-primary line-clamp-1 pr-4 transition-none">{item.title}</span>

              <IoIosArrowForward className="text-gray-300 dark:text-[#8c9ab1] group-hover:text-primary shrink-0 text-base group-hover:translate-x-1 transition-[translate] duration-200" />
            </Link>
          </div>
        ))}
      </SidebarCard>
    </div>
  );
};

export default HotArticle;
