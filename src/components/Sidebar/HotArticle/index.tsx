import Link from 'next/link';
import Image from 'next/image';
import { getWebConfigDataAPI } from '@/api/config';
import { getArticleListAPI } from '@/api/article';
import { IoIosArrowForward } from 'react-icons/io';
import FireSvg from '@/assets/svg/other/fire.svg';
import { Theme } from '@/types/app/config';
import { Article } from '@/types/app/article';

const RandomArticle = async () => {
  const themeResponse = await getWebConfigDataAPI<{ value: Theme }>('theme');
  const theme = themeResponse?.data?.value as Theme;
  const { data: article } = await getArticleListAPI();
  const ids = theme.reco_article.map((item) => Number(item)) ?? [];
  const list = article?.result.filter((item: Article) => ids.includes(item.id as number)) ?? [];

  return (
    <div className="hotArticleComponent">
      <div className="flex flex-col tw_container bg-white dark:bg-black-b p-4 mb-3 tw_title">
        <div className="tw_title w-full dark:text-white">
          <Image src={FireSvg} alt="作者推荐" width={30} height={20} />
          <span> 作者推荐</span>
        </div>

        <div className="flex flex-col px-3 py-2 w-full">
          {list?.map((item: Article) => (
            <div key={item.id} className="border-b border-dashed border-gray-100 dark:border-white/10 last:border-none">
              <Link
                href={`/article/${item.id}`}
                target="_blank"
                className="group flex items-center justify-between py-3.5 w-full"
              >
                <span className="text-sm font-medium text-gray-600 dark:text-[#8c9ab1] group-hover:text-primary dark:group-hover:text-primary line-clamp-1 pr-4">{item.title}</span>

                <IoIosArrowForward className="text-gray-300 dark:text-gray-600 group-hover:text-primary dark:group-hover:text-primary shrink-0 text-base transform group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RandomArticle;
