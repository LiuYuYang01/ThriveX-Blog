import Link from 'next/link';
import { getRandomImage } from '@/utils';
import { getThemeCovers } from '@/lib/theme';
import { Article } from '@/types/app/article';
import dayjs from 'dayjs';

import { RiFireLine } from 'react-icons/ri';
import { IoTimeOutline } from 'react-icons/io5';
import { GoTag } from 'react-icons/go';
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

              <div className={`flex justify-center pt-5 text-end space-x-4 sm:space-x-8`}>
                <div className="flex items-center text-xs text-white">
                  <span className="pr-1">
                    <IoTimeOutline className="p-1 mt-[-2px] mr-[3px] text-[23px] text-white rounded-full align-middle bg-[#539dfd]" />
                  </span>
                  <span>{dayjs(+item.createTime!).format('YYYY-MM-DD')}</span>
                </div>

                <div className="flex items-center text-xs text-white">
                  <span className="pr-1">
                    <RiFireLine className="p-1 mt-[-2px] mr-[3px] text-[23px] text-white rounded-full align-middle bg-[#eb373a]" />
                  </span>
                  <span>{item.view}</span>
                </div>

                <div className="flex items-center text-xs text-white">
                  <span className="pr-1">
                    <GoTag className="p-1 mt-[-2px] mr-[3px] text-[23px] text-white rounded-full align-middle bg-[#f5a630]" />
                  </span>
                  <span>{item.cateList[0]?.name}</span>
                </div>
              </div>
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
