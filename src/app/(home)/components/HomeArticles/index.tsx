import ArticleLayout from '@/components/ArticleLayout';
import { getArticlePagingCacheAPI } from '@/lib/article';
import { getThemeConfigCacheAPI, getThemeCoversCacheAPI } from '@/lib/theme';
import { getSwiperListCacheAPI } from '@/lib/swiper';

interface Props {
  searchParams: Promise<{ page?: number }>;
}

export default async ({ searchParams }: Props) => {
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam) || 1;

  const [theme, covers, { data: swiper }] = await Promise.all([
    getThemeConfigCacheAPI(),
    getThemeCoversCacheAPI(),
    getSwiperListCacheAPI(),
  ]);

  swiper.result = swiper.result?.sort((a, b) => (a.order || 0) - (b.order || 0)) ?? [];
  const articleLayout = theme?.is_article_layout ?? 'classics';

  const { data } = await getArticlePagingCacheAPI({
    pageNum: page,
    pageSize: articleLayout === 'waterfall' ? 28 : 10,
  });
  data.result = data?.result?.filter((item) => item.config.status !== 'no_home') ?? [];

  return (
    <ArticleLayout
      page={page}
      basePath="/"
      theme={theme}
      covers={covers}
      swiper={swiper}
      data={data}
    />
  );
};
