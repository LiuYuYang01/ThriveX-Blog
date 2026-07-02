'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getRandomArticleListAPI } from '@/api/article';
import { useConfigStore } from '@/stores';
import { Article } from '@/types/app/article';
import { getRandomImage } from '@/utils';
import RandomArticleSvg from '@/assets/svg/other/article.svg';

const RANKING_COLORS = [
  'bg-[#f83356] after:border-l-[#f83356]',
  'bg-[#faa527] after:border-l-[#faa527]',
  'bg-[#3c83fd] after:border-l-[#3c83fd]',
  'bg-[#56c357] after:border-l-[#56c357]',
  'bg-[#6756c3] after:border-l-[#6756c3]',
] as const;

const HotArticle = () => {
  const { theme } = useConfigStore();

  const [list, setList] = useState<Article[]>([]);

  const getRandomArticleList = async () => {
    const { data } = await getRandomArticleListAPI();
    setList(data ?? []);
  };

  useEffect(() => {
    getRandomArticleList();
  }, []);

  return (
    <div className="flex flex-col p-4 mb-5 bg-white dark:bg-black-b tw_container tw_title">
      <h3 className="w-full tw_title dark:text-white">
        <Image src={RandomArticleSvg} alt="随机推荐" /> 随机推荐
      </h3>

      <div className="w-full pt-2.5 mt-2 min-h-[120px] space-y-4">
        {list?.map((item, index) => (
          <div
            key={index}
            className="relative h-32 bg-no-repeat bg-center rounded-md bg-[length:100%] hover:bg-[length:105%] transition-[background-size] duration-300 ease-out after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-12 after:transition-opacity after:rounded-md after:bg-[linear-gradient(transparent,#000)]"
            style={{ backgroundImage: `url(${getRandomImage(item.cover, theme.covers)})` }}
          >
            <Link href={`/article/${item.id}`} target="_blank" className="inline-block w-full h-full">
              <h4 className="absolute bottom-2.5 w-[95%] px-2.5 text-white text-[15px] font-normal line-clamp-1 z-10">{item.title}</h4>
            </Link>

            <span
              className={`absolute top-2.5 -left-4 w-[30px] h-[25px] pl-[7px] flex items-center text-white rounded-tr-full rounded-br-full font-black box-border after:content-[''] after:absolute after:-bottom-[5px] after:left-0 after:w-0 after:h-0 after:border-[5px] after:border-solid after:border-t-transparent after:border-r-transparent after:border-b-transparent ${RANKING_COLORS[Math.min(index, 4)]}`}
            >
              {index + 1}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotArticle;
