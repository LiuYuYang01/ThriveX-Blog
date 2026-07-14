import Link from 'next/link';
import Image from 'next/image';

import { getRandomArticleListCacheAPI } from '@/lib/article';
import { getThemeCoversCacheAPI } from '@/lib/theme';
import { getStableImage } from '@/utils';
import RandomArticleSvg from '@/assets/svg/other/article.svg';
import CoverImage from '@/components/CoverImage';
import SidebarCard from '@/components/Sidebar/SidebarCard';

const RandomArticle = async () => {
  const [{ data: list }, covers] = await Promise.all([
    getRandomArticleListCacheAPI(),
    getThemeCoversCacheAPI(),
  ]);

  return (
    <SidebarCard
      title={<><Image src={RandomArticleSvg} alt="随机推荐" /> 随机推荐</>}
      contentClassName="w-full pt-2.5 mt-2 min-h-[120px] space-y-4"
      marginBottom="mb-3"
    >
      {list?.map((item) => (
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
            <h4 className="absolute bottom-2.5 w-[95%] px-2.5 text-white text-[15px] font-normal line-clamp-1 z-10">{item.title}</h4>
          </Link>
        </div>
      ))}
    </SidebarCard>
  );
};

export default RandomArticle;
