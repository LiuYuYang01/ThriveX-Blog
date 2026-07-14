import Link from 'next/link';
import Image from 'next/image';

import { getArticleCacheAPI } from '@/lib/article';
import { getThemeCoversCacheAPI } from '@/lib/theme';
import { getStableImage } from '@/utils';
import FireSvg from '@/assets/svg/other/fire.svg';
import CoverImage from '@/components/CoverImage';
import SidebarCard from '@/components/Sidebar/SidebarCard';
import { Article } from '@/types/app/article';

const RANKING_COLORS = [
  'bg-[#f83356] after:border-l-[#f83356]',
  'bg-[#faa527] after:border-l-[#faa527]',
  'bg-[#3c83fd] after:border-l-[#3c83fd]',
  'bg-[#56c357] after:border-l-[#56c357]',
  'bg-[#6756c3] after:border-l-[#6756c3]',
] as const;

/** 根据后台配置的推荐文章 ID 拉取并展示作者推荐列表 */
const HotArticle = async ({ recoArticleIds = [] }: { recoArticleIds?: number[] }) => {
  const ids = recoArticleIds.map((item) => Number(item)).filter(Boolean);
  if (!ids.length) return null;

  const [articles, covers] = await Promise.all([
    Promise.all(ids.map((id) => getArticleCacheAPI(id))),
    getThemeCoversCacheAPI(),
  ]);
  const list = articles.map((res) => res.data).filter((item): item is Article => !!item);
  if (!list.length) return null;

  return (
    <div className="hotArticleComponent">
      <SidebarCard
        title={
          <>
            <Image src={FireSvg} alt="作者推荐" width={30} height={20} />
            <span> 作者推荐</span>
          </>
        }
        className="overflow-visible"
        contentClassName="w-full pt-2.5 mt-2 space-y-4 overflow-visible"
      >
        {list.map((item, index) => (
          <div key={item.id} className="group relative h-32 rounded-md cursor-pointer">
            <div className="absolute inset-0 overflow-hidden rounded-md">
              <CoverImage
                src={getStableImage(item.cover, covers, String(item.id))}
                alt={item.title}
                containerClassName="absolute inset-0 transition-[scale] duration-300 ease-out group-hover:scale-105"
                sizes="300px"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-[linear-gradient(transparent,#000)]" />
            </div>

            <Link href={`/article/${item.id}`} target="_blank" className="inline-block w-full h-full">
              <h4 className="absolute bottom-2.5 w-[95%] px-2.5 text-white text-[15px] font-normal line-clamp-1 z-10">
                {item.title}
              </h4>
            </Link>

            <span
              className={`absolute top-2.5 -left-4 z-20 flex h-[25px] w-[30px] items-center pl-[7px] box-border rounded-tr-full rounded-br-full text-white font-black after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:h-0 after:w-0 after:border-[5px] after:border-solid after:border-t-transparent after:border-r-transparent after:border-b-transparent ${RANKING_COLORS[Math.min(index, 4)]}`}
            >
              {index + 1}
            </span>
          </div>
        ))}
      </SidebarCard>
    </div>
  );
};

export default HotArticle;
