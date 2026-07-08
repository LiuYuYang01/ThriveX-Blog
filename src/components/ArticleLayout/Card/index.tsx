import Link from 'next/link';
import { getRandomImage } from '@/utils';
import { getThemeCoversCacheAPI } from '@/lib/theme';
import { Article } from '@/types/app/article';
import ArticleMeta from '@/components/ArticleLayout/components/ArticleMeta';
import CoverImage from '@/components/CoverImage';
import Empty from '@/components/Empty';
import Show from '@/components/Show';

interface CardProps {
  data: Paginate<Article[]>;
  covers?: string[];
}

const Card = async ({ data, covers: coversProp }: CardProps) => {
  const covers = coversProp ?? (await getThemeCoversCacheAPI());

  const genArticleInfo = (data: Article) => {
    if (data.description?.trim()?.length) {
      return data.description;
    }
    return data.content.slice(0, 100);
  };

  return (
    <div className="space-y-4">
      {data?.result?.map((item) => {
        const cover = getRandomImage(item.cover, covers);

        return (
          <div key={item.id} className="panel relative overflow-hidden flex h-[190px] md:h-60 lg:h-52 xl:h-60 bg-black-b">
            <div className="relative w-full py-5 px-5 sm:px-10 lg:px-5 xl:px-10 z-20">
              <Link href={`/article/${item.id}`} className="flex flex-col justify-between h-full text-center sm:text-start">
                <h3 className="overflow-hidden relative w-full my-2.5 text_shadow text-white hover:text-primary text-center text-lg md:text-xl lg:text-[22px] xl:text-2xl   line-clamp-1">{item.title}</h3>
                <p className="text-center text-[#cecece] text-sm sm:text-[15px] leading-7 sm:indent-8 line-clamp-2 xl:line-clamp-3">{genArticleInfo(item)}</p>
                <ArticleMeta article={item} className="justify-center sm:justify-start" />
              </Link>
            </div>

            <div className="absolute w-full h-60 overflow-hidden" style={{ filter: 'blur(1.8rem) brightness(0.9)' }}>
              <CoverImage src={cover} alt={item.title} sizes="100vw" />
            </div>
          </div>
        );
      })}

      <Show is={!data?.total}>
        <Empty info="暂无文章" />
      </Show>
    </div>
  );
};

export default Card;
