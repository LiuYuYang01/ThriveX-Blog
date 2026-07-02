import Link from 'next/link';
import { getRandomImage } from '@/utils';
import { getThemeCovers } from '@/lib/theme';
import { Article } from '@/types/app/article';
import ArticleMeta from '@/components/ArticleLayout/components/ArticleMeta';
import Empty from '@/components/Empty';
import Show from '@/components/Show';


interface CardProps {
  data: Paginate<Article[]>;
}

const Card = async ({ data }: CardProps) => {
  const covers = await getThemeCovers();

  // 生成文章摘要，取前100个字
  const genArticleInfo = (data: Article) => {
    if (data.description?.trim()?.length) {
      return data.description;
    } else {
      return data.content.slice(0, 100);
    }
  };

  return (
    <div className="space-y-4">
      {data?.result?.map((item) => (
        <div key={item.id} className="relative overflow-hidden flex h-[190px] md:h-60 lg:h-52 xl:h-60 bg-black-b tw_container">
          <div className="relative w-full py-5 px-5 sm:px-10 lg:px-5 xl:px-10 z-20">
            <Link href={`/article/${item.id}`} className="flex flex-col justify-between h-full text-center sm:text-start">
              <h3 className="overflow-hidden relative w-full my-2.5 text_shadow text-white hover:text-primary text-center text-lg md:text-xl lg:text-[22px] xl:text-2xl   line-clamp-1">{item.title}</h3>
              <p className="text-center text-[#cecece] text-sm sm:text-[15px] leading-7 sm:indent-8 line-clamp-2 xl:line-clamp-3">{genArticleInfo(item)}</p>

              <ArticleMeta article={item} className="justify-center sm:justify-start" />
            </Link>
          </div>

          <div
            className="absolute w-full h-60 bg-cover bg-center"
            style={{
              filter: 'blur(1.8rem) brightness(0.9)',
              backgroundImage: `url(${getRandomImage(item.cover, covers)})`,
            }}
          />
        </div>
      ))}

      <Show is={!data?.total}>
        <Empty info="暂无文章" />
      </Show>
    </div>
  );
};

export default Card;
