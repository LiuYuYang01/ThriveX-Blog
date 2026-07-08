import Slide from '@/components/Slide';
import Typed from '@/components/Typed';
import Starry from '@/components/Starry';
import Container from '@/components/Container';
import ArticleLayout from '@/components/ArticleLayout';
import Sidebar from '@/components/Sidebar';

import { getArticlePagingCacheAPI } from '@/lib/article';
import { getThemeConfigCacheAPI, getThemeCoversCacheAPI } from '@/lib/theme';
import { getSwiperListCacheAPI } from '@/lib/swiper';

export default async ({ page }: { page: number }) => {
  const [theme, covers, { data: swiper }] = await Promise.all([
    getThemeConfigCacheAPI(),
    getThemeCoversCacheAPI(),
    getSwiperListCacheAPI(),
  ]);

  swiper.result = swiper.result?.sort((a, b) => (a.order || 0) - (b.order || 0)) ?? [];

  const { data } = await getArticlePagingCacheAPI({
    pageNum: page || 1,
    pageSize: theme.is_article_layout === 'waterfall' ? 28 : 8,
  });
  data.result = data?.result?.filter((item) => item.config.status !== 'no_home') ?? [];

  return (
    <>
      <Slide src={theme?.swiper_image} covers={covers}>
        <Starry />
        <Typed
          swiperText={theme?.swiper_text}
          className="absolute top-[45%] sm:top-[40%] left-[50%] transform -translate-x-1/2 w-[80%] text-center text-white xs:text-xl sm:text-[30px] leading-7 sm:leading-[40px] md:leading-[50px] custom_text_shadow"
        />
      </Slide>

      <Container>
        <ArticleLayout page={page} theme={theme} covers={covers} swiper={swiper} data={data} />
        <Sidebar sidebar={theme?.right_sidebar ?? []} social={theme?.social ?? []} recoArticleIds={theme?.reco_article ?? []} />
      </Container>
    </>
  );
};
