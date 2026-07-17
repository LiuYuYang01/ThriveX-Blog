import { connection } from 'next/server';

import Slide from '@/components/Slide';
import Typed from '@/components/Typed';
import Starry from '@/components/Starry';
import { getThemeConfigCacheAPI, getThemeCoversCacheAPI } from '@/lib/theme';

export default async () => {
  await connection();
  const [theme, covers] = await Promise.all([
    getThemeConfigCacheAPI(),
    getThemeCoversCacheAPI(),
  ]);

  return (
    <Slide src={theme?.swiper_image} covers={covers}>
      <Starry />
      <Typed
        swiperText={theme?.swiper_text}
        className="absolute top-[45%] sm:top-[40%] left-[50%] transform -translate-x-1/2 w-[80%] text-center text-white xs:text-xl sm:text-[30px] leading-7 sm:leading-[40px] md:leading-[50px] custom_text_shadow"
      />
    </Slide>
  );
};
