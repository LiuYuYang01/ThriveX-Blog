'use client';

import Image from 'next/image';
import { useDisclosure } from '@/ThriveUI';
import sun from './image/sun.svg';
import moon from './image/moon.svg';
import search from './image/search.svg';
import returnTop from './image/returnTop.svg';
import rss from './image/rss.svg';
import { useAppConfig } from '@/components/AppConfigProvider';
import { useConfigStore } from '@/stores';
import Search from '../Search';
import Rss from './components/Rss';
import { requestThemeTransition } from '@/utils/themeTransition';

const itemSty = 'p-2 hover:bg-[#edf5ff] dark:hover:bg-[#4e5969] cursor-pointer  ';

export default () => {
  const { web } = useAppConfig();
  const { isDark } = useConfigStore();
  const { isOpen: isSwiper, onOpen: onSwiperOpen, onClose: onSwiperClose } = useDisclosure();
  const { isOpen: isRssOpen, onOpen: onRssOpen, onClose: onRssClose } = useDisclosure();
  const onReturnTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className="z-999 overflow-hidden fixed top-[70%] right-[3%] flex flex-col w-12 bg-white dark:bg-black-b border dark:border-[#4e5969] rounded-md divide-y dark:divide-[#4e5969]  ">
        {isDark ? <Image src={sun.src} alt="太阳" width={46} height={46} className={itemSty} onClick={() => requestThemeTransition(false)} /> : <Image src={moon.src} alt="月亮" width={46} height={46} className={itemSty} onClick={() => requestThemeTransition(true)} />}

        <Image src={search.src} alt="搜索" width={46} height={46} className={itemSty} onClick={onSwiperOpen} />
        <Image src={rss.src} alt="订阅" width={46} height={46} className={itemSty} onClick={onRssOpen} />
        <Image src={returnTop.src} alt="返回顶部" width={46} height={46} className={itemSty} onClick={onReturnTop} />
      </div>

      {/* 搜索组件 */}
      <Search disclosure={{ isOpen: isSwiper, onClose: onSwiperClose }} />

      {/* 查看Rss地址 */}
      <Rss data={web} disclosure={{ isOpen: isRssOpen, onClose: onRssClose }} />
    </>
  );
};
