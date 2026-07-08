import Dynamic from './components/Dynamic';
import Swiper from '../Swiper';
import Classics from './Classics';
import Waterfall from './Waterfall';
import Card from './Card';
import Pagination from '../Pagination';

import { Theme } from '@/types/app/config';
import { Swiper as SwiperItem } from '@/types/app/swiper';
import { Article } from '@/types/app/article';

interface Props {
  page: number;
  basePath: string;
  theme: Theme;
  covers: string[];
  swiper: { result?: SwiperItem[] };
  data: Paginate<Article[]>;
}

export default ({ page, basePath, theme, covers, swiper, data }: Props) => {
  const sidebar = theme?.right_sidebar ?? [];

  return (
    <div className={`w-full md:w-[90%] ${sidebar?.length ? 'lg:w-[68%] xl:w-[73%]' : 'w-full'} mx-auto transition-width`}>
      {!!swiper.result?.length && <Swiper data={swiper.result} />}
      <Dynamic className="my-2" />

      {theme.is_article_layout === 'classics' && <Classics data={data} covers={covers} />}
      {theme.is_article_layout === 'card' && <Card data={data} covers={covers} />}
      {theme.is_article_layout === 'waterfall' && <Waterfall data={data} covers={covers} />}

      {!!data.total && (
        <Pagination total={data.pages} page={page} basePath={basePath} className="flex justify-center mt-5" />
      )}
    </div>
  );
};
