'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';

import { Switch } from '@/ThriveUI';
import Show from '@/components/Show';
import OptimizedImage from '@/components/OptimizedImage';
import SidebarNav from './components/SidebarNav';

import { IoIosArrowDown } from 'react-icons/io';
import { FaRegSun } from 'react-icons/fa';
import { LuMenu } from 'react-icons/lu';
import { BsFillMoonStarsFill } from 'react-icons/bs';

import { Cate } from '@/types/app/cate';
import { Theme } from '@/types/app/config';
import { getCateListAPI } from '@/api/cate';
import { getCateNavHref, getCateNavRel, getCateNavTarget } from '@/utils/cateNav';

import { useConfigStore } from '@/stores';
import useMounted from '@/hooks/useMounted';

const getSubmenuGridClass = (count: number) => {
  if (count <= 3) return 'grid-cols-1 w-max min-w-[160px]';
  if (count <= 6) return 'grid-cols-2 w-[300px]';
  return 'grid-cols-3 w-[420px]';
};

const getSubmenuPositionClass = (count: number) => (count <= 3 ? 'left-0' : 'left-1/2 -translate-x-1/2');

const submenuPanelClass =
  'invisible opacity-0 scale-[0.98] pointer-events-none group-hover/one:visible group-hover/one:opacity-100 group-hover/one:scale-100 group-hover/one:pointer-events-auto transition-[opacity,scale,visibility] duration-200 ease-out absolute top-[calc(100%-4px)] z-10 pt-1.5 overflow-hidden rounded-xl before:absolute before:inset-x-0 before:-top-1.5 before:h-1.5 before:content-[""]';

const submenuItemClass =
  'group/item flex w-full min-w-0 items-center gap-2 rounded-lg px-3 py-2.5 text-[14px] text-[#666] dark:text-white cursor-pointer hover:text-primary! hover:bg-[#f0f7ff] dark:hover:bg-[#3a4556]';

const Submenu = ({ items, showIcon }: { items: Cate[]; showIcon?: boolean }) => {
  const count = items.length;
  return (
    <ul
      className={`${submenuPanelClass} ${getSubmenuPositionClass(count)} grid ${getSubmenuGridClass(count)} gap-1 p-1.5 border border-black/5 dark:border-white/10 bg-[rgba(255,255,255,0.95)] dark:bg-[rgba(44,51,62,0.95)] backdrop-blur-md`}
      style={{ boxShadow: '0 12px 32px rgba(0, 0, 0, 0.1), 0 2px 6px rgba(0, 0, 0, 0.08)' }}
    >
      {items.map((two) => (
        <li key={two.id}>
          <Link href={getCateNavHref(two)} target={getCateNavTarget(two.type)} rel={getCateNavRel(two.type)} title={two.name} className={submenuItemClass}>
            {showIcon && two.icon ? <span className="shrink-0 text-base leading-none">{two.icon}</span> : null}
            <span className="truncate">{two.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default ({ theme }: { theme: Theme }) => {
  const patchName = usePathname();

  const { isDark, setIsDark } = useConfigStore();
  const mounted = useMounted();

  // 这些路径段不需要改变导航样式
  const isPathSty = ['/my', '/wall', '/record', '/equipment', '/tags', '/resume', '/album', '/fishpond', '/friend', '/echoes', '/sponsors'].some((path) => patchName.includes(path));
  // 是否改变导航样式
  const [isScrolled, setIsScrolled] = useState(false);

  // 获取分类列表
  const [cateList, setCateList] = useState<Cate[]>([]);
  const getCateList = async () => {
    const { data } = await getCateListAPI();
    const result = data?.result ?? [];
    const filteredList = result
      .filter((item) => !item.is_hide)
      .map((item) => ({
        ...item,
        children: item.children?.filter((child) => !child.is_hide).sort((a, b) => a.order - b.order) ?? [],
      }))
      .sort((a, b) => a.order - b.order);
    setCateList(filteredList);
  };

  useEffect(() => {
    // 监听系统主题变化
    const mediaQuery = matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e: MediaQueryListEvent) => {
      setIsDark(e.matches);
    });

    getCateList();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 手动切换主题
  const toTheme = () => {
    setIsDark(!isDark);
  };
  // 判断当前主题
  useEffect(() => {
    const html = document.querySelector('html');
    if (html && html.classList) {
      html?.classList?.toggle('dark', isDark);
    }
  }, [isDark]);

  // 是否打开侧边栏导航
  const [isOpenSidebarNav, setIsOpenSidebarNav] = useState(false);

  const logoSrc = !mounted
    ? theme?.dark_logo || theme?.light_logo || ''
    : isDark
      ? theme?.dark_logo
      : isPathSty || isScrolled
        ? theme?.light_logo
        : theme?.dark_logo;

  return (
    <>
      <div className={`header fixed inset-x-0 top-0 w-full h-[60px] z-50 overflow-visible after:content-[''] after:block after:w-full after:h-0 after:bg-[linear-gradient(#fff,transparent_70%)] dark:after:bg-[linear-gradient(#2b333e,transparent_70%)] ${isPathSty || isScrolled ? 'bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(44,51,62,0.7)] backdrop-blur-md border-b dark:border-[#2b333e] after:h-5! after:transition-height]' : 'border-transparent'}`}>
        <div className="grid grid-cols-[1fr_auto_1fr] grid-rows-[60px] h-[60px] md:flex md:justify-between items-center w-full max-w-[1200px] mx-auto px-4 md:px-6 lg:px-0!">
          <div
            className="md:hidden group flex items-center justify-center size-9 shrink-0 rounded-full transition-colors cursor-pointer hover:bg-[#e9edf4] dark:hover:bg-[#455162]"
            onClick={() => setIsOpenSidebarNav(true)}
          >
            <LuMenu className={`text-xl transition-colors ${isPathSty || isScrolled ? 'text-[#333] dark:text-white' : 'text-white group-hover:text-[#333] dark:group-hover:text-white'}`} />
          </div>

          <div className="flex h-[60px] items-center justify-center md:justify-start min-w-0 md:flex-1 overflow-visible">
            {/* logo */}
            <Link href="/" className="flex items-center h-[60px] text-[15px]">
              <div className="relative h-10 w-40 pr-0 md:pr-5 hover:scale-90 transition-[scale]">
                <OptimizedImage src={logoSrc} alt="Logo" fill sizes="160px" className="object-contain object-center md:object-left" />
              </div>
            </Link>

            <ul className="hidden md:flex items-center h-[60px] overflow-visible">
              <li className="group/one relative">
                <Link href="/" className={`flex items-center h-[60px] px-5 text-[15px] group-hover/one:text-primary! ${isPathSty || isScrolled ? 'text-[#333] dark:text-white' : 'text-white'}`}>
                  💎 首页
                </Link>
              </li>

              {/* 文章分类 */}
              {cateList?.map((one) => (
                <React.Fragment key={one.id}>
                  {/* 渲染分类 */}
                  {one.type === 'cate' && (
                    <li className="group/one relative">
                      {one.children.length ? (
                        <span className={`flex items-center h-[60px] px-5 text-[15px] whitespace-nowrap group-hover/one:text-primary! cursor-default ${isPathSty || isScrolled ? 'text-[#333] dark:text-white' : 'text-white'}`}>
                          {one.icon} {one.name}
                          <IoIosArrowDown className="ml-2 transition-[rotate] duration-200 group-hover/one:rotate-180" />
                        </span>
                      ) : (
                        <Link href={getCateNavHref(one)} target={getCateNavTarget(one.type)} rel={getCateNavRel(one.type)} className={`flex items-center h-[60px] px-5 text-[15px] whitespace-nowrap group-hover/one:text-primary! ${isPathSty || isScrolled ? 'text-[#333] dark:text-white' : 'text-white'}`}>
                          {one.icon} {one.name}
                        </Link>
                      )}

                      <Show is={!!one.children.length}>
                        <Submenu items={one.children} />
                      </Show>
                    </li>
                  )}

                  {/* 渲染页面 */}
                  {one.type === 'page' && (
                    <li className="group/one relative">
                      {one.children?.length ? (
                        <span className={`flex items-center h-[60px] px-10 text-[15px] whitespace-nowrap group-hover/one:text-primary! cursor-default ${isPathSty || isScrolled ? 'text-[#333] dark:text-white' : 'text-white'}`}>
                          {one.icon} {one.name}
                          <IoIosArrowDown className="ml-2 transition-[rotate] duration-200 group-hover/one:rotate-180" />
                        </span>
                      ) : (
                        <Link href={getCateNavHref(one)} target={getCateNavTarget(one.type)} rel={getCateNavRel(one.type)} className={`flex items-center h-[60px] px-10 text-[15px] whitespace-nowrap group-hover/one:text-primary! ${isPathSty || isScrolled ? 'text-[#333] dark:text-white' : 'text-white'}`}>
                          {one.icon} {one.name}
                        </Link>
                      )}

                      <Show is={!!one.children?.length}>
                        <Submenu items={one.children} showIcon />
                      </Show>
                    </li>
                  )}

                  {/* 渲染导航 */}
                  {one.type === 'nav' && (
                    <li className="group/one relative">
                      {one.children?.length ? (
                        <span className={`flex items-center h-[60px] px-10 text-[15px] whitespace-nowrap group-hover/one:text-primary! cursor-default ${isPathSty || isScrolled ? 'text-[#333] dark:text-white' : 'text-white'}`}>
                          {one.icon} {one.name}
                          <IoIosArrowDown className="ml-2 transition-[rotate] duration-200 group-hover/one:rotate-180" />
                        </span>
                      ) : (
                        <Link href={getCateNavHref(one)} target={getCateNavTarget(one.type)} rel={getCateNavRel(one.type)} className={`flex items-center h-[60px] px-10 text-[15px] whitespace-nowrap group-hover/one:text-primary! ${isPathSty || isScrolled ? 'text-[#333] dark:text-white' : 'text-white'}`}>
                          {one.icon} {one.name}
                        </Link>
                      )}

                      <Show is={!!one.children?.length}>
                        <Submenu items={one.children} showIcon />
                      </Show>
                    </li>
                  )}
                </React.Fragment>
              ))}
            </ul>
          </div>

          {/* 主题切换开关 */}
          <Switch
            size="lg"
            isSelected={isDark}
            onValueChange={toTheme}
            thumbIcon={({ isSelected }) => (isSelected ? <BsFillMoonStarsFill className="text-gray-500" /> : <FaRegSun className="text-gray-500" />)}
            className="shrink-0 justify-self-end"
          />
        </div>
      </div>

      {/* 侧边导航：移动端时候显示 */}
      <SidebarNav list={cateList} open={isOpenSidebarNav} onClose={() => setIsOpenSidebarNav(false)} />
    </>
  );
};
