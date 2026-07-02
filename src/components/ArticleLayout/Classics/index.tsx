import Link from 'next/link';
import { getRandomImage } from '@/utils';
import { getThemeCovers } from '@/lib/theme';
import { Article } from '@/types/app/article';
import ArticleMeta from '@/components/ArticleLayout/components/ArticleMeta';
import Empty from '@/components/Empty';
import Show from '@/components/Show';


interface ClassicsProps {
  data: Paginate<Article[]>;
}

const Classics = async ({ data }: ClassicsProps) => {
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
    <div className="space-y-2">
      {data?.result?.map((item, index) => {
        const cover = getRandomImage(item.cover, covers);

        return (
        <div key={item.id} className="relative overflow-hidden flex h-[190px] md:h-60 lg:h-52 xl:h-60 bg-black-b tw_container">
          {index % 2 === 0 && (
            <div
              className="hidden sm:block relative min-w-[45%] bg-cover bg-no-repeat bg-center scale-100 hover:scale-125 z-10 transition-transform"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 90% 100%, 0 100%)',
                backgroundImage: `url(${cover})`,
              }}
            />
          )}

          <div className="relative w-full sm:w-[65%] py-5 px-5 sm:px-10 lg:px-5 xl:px-10 z-20">
            <Link href={`/article/${item.id}`} className="flex flex-col justify-between h-full text-center sm:text-start">
              <h3 className="overflow-hidden relative w-full my-2.5 text-white hover:text-primary text-lg md:text-xl lg:text-[22px] xl:text-2xl   line-clamp-1">{item.title}</h3>
              <p className="text-[#cecece] text-sm sm:text-[15px] leading-7 sm:indent-8 line-clamp-2 xl:line-clamp-3">{genArticleInfo(item)}</p>

              <ArticleMeta
                article={item}
                className={`justify-center ${index % 2 === 0 ? ' sm:justify-end' : 'sm:justify-start'}`}
              />
            </Link>
          </div>

          <div
            className="absolute w-full h-60 bg-cover bg-center"
            style={{
              filter: 'blur(2.5rem) brightness(0.6)',
              backgroundImage: `url(${cover})`,
            }}
          />

          {index % 2 !== 0 && (
            <div
              className="relative min-w-[45%] bg-cover bg-no-repeat bg-center scale-100 z-10 hover:scale-125 transition-transform hidden sm:block"
              style={{
                clipPath: 'polygon(10% 0, 100% 0, 100% 100%, 0 100%)',
                backgroundImage: `url(${cover})`,
              }}
            />
          )}
        </div>
        );
      })}

      <Show is={!data?.total}>
        <Empty info="暂无文章" />
      </Show>
    </div>
  );
};

export default Classics;
