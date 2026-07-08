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

const submenuPanelClass =
  'invisible opacity-0 scale-[0.98] pointer-events-none group-hover/one:visible group-hover/one:opacity-100 group-hover/one:scale-100 group-hover/one:pointer-events-auto transition-[opacity,scale,visibility] duration-200 ease-out absolute left-0 top-[calc(100%-4px)] z-10 pt-0.5 min-w-full w-max max-w-[220px] overflow-hidden rounded-md before:absolute before:inset-x-0 before:-top-1 before:h-1 before:content-[""]';

const submenuItemClass =
  'group/item relative flex w-full items-center min-w-0 px-5 py-2.5 text-[15px] text-[#666] dark:text-white transition-colors duration-150 hover:text-primary! hover:bg-[#f2f2f2] dark:hover:bg-[#323e50] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-0 before:w-[3px] before:rounded-r-full before:bg-primary before:transition-[height] before:duration-150 hover:before:h-[50%]';

export default ({ theme }: { theme: Theme }) => {
  const patchName = usePathname();

  const { isDark, setIsDark } = useConfigStore();

  // 这些路径段不需要改变导航样式
  const isPathSty = ['/my', '/wall', '/record', '/equipment', '/tags', '/resume', '/album', '/fishpond', '/friend'].some((path) => patchName.includes(path));
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

  return (
    <>
      <div className={`header fixed inset-x-0 top-0 w-full h-[60px] z-50 overflow-visible after:content-[''] after:block after:w-full after:h-0 after:bg-[linear-gradient(#fff,transparent_70%)] dark:after:bg-[linear-gradient(#2b333e,transparent_70%)] ${isPathSty || isScrolled ? 'bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(44,51,62,0.7)] backdrop-blur-md border-b dark:border-[#2b333e] after:h-5! after:transition-height]' : 'border-transparent'}`}>
        <div className="grid grid-cols-[auto_1fr_auto] grid-rows-[60px] h-[60px] md:flex md:justify-between items-center w-full max-w-[1200px] mx-auto px-4 md:px-6 lg:px-0!">
          <div
            className="md:hidden group flex items-center justify-center size-9 shrink-0 rounded-full transition-colors cursor-pointer hover:bg-[#e9edf4] dark:hover:bg-[#455162]"
            onClick={() => setIsOpenSidebarNav(true)}
          >
            <LuMenu className={`text-xl transition-colors ${isPathSty || isScrolled ? 'text-[#333] dark:text-white' : 'text-white group-hover:text-[#333] dark:group-hover:text-white'}`} />
          </div>

          <div className="flex h-[60px] items-center justify-center md:justify-start min-w-0 md:flex-1 overflow-visible">
            {/* logo */}
            <Link href="/" className="flex items-center h-[60px] text-[15px]">
              {isDark ? (
                <OptimizedImage src={theme?.dark_logo} alt="Logo" width={160} height={40} className="h-10 w-auto object-contain pr-0 md:pr-5 hover:scale-90 transition-[scale]" style={{ width: 'auto' }} />
              ) : (
                <OptimizedImage
                  src={isPathSty || isScrolled ? theme?.light_logo : theme?.dark_logo}
                  alt="Logo"
                  width={160}
                  height={40}
                  className="h-10 w-auto object-contain pr-0 md:pr-5 hover:scale-90 transition-[scale]"
                  style={{ width: 'auto' }}
                />
              )}
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
                        <ul className={`${submenuPanelClass} backdrop-blur-[5px] bg-[rgba(255,255,255,0.95)] dark:bg-[rgba(44,51,62,0.95)]`} style={{ boxShadow: '0 12px 32px rgba(0, 0, 0, 0.1), 0 2px 6px rgba(0, 0, 0, 0.08)' }}>
                          {one.children?.map((two) => (
                            <li key={two.id}>
                              <Link href={getCateNavHref(two)} target={getCateNavTarget(two.type)} rel={getCateNavRel(two.type)} title={two.name} className={`${submenuItemClass} truncate`}>
                                {two.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
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
                        <ul className={`${submenuPanelClass} bg-[rgba(255,255,255,0.95)] dark:bg-[rgba(44,51,62,0.95)]`} style={{ boxShadow: '0 12px 32px rgba(0, 0, 0, 0.1), 0 2px 6px rgba(0, 0, 0, 0.08)' }}>
                          {one.children?.map((two) => (
                            <li key={two.id}>
                              <Link href={getCateNavHref(two)} target={getCateNavTarget(two.type)} rel={getCateNavRel(two.type)} title={two.name} className={`${submenuItemClass} gap-1.5`}>
                                <span className="shrink-0">{two.icon}</span>
                                <span className="truncate">{two.name}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
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
                        <ul className={`${submenuPanelClass} bg-[rgba(255,255,255,0.95)] dark:bg-[rgba(44,51,62,0.95)]`} style={{ boxShadow: '0 12px 32px rgba(0, 0, 0, 0.1), 0 2px 6px rgba(0, 0, 0, 0.08)' }}>
                          {one.children?.map((two) => (
                            <li key={two.id}>
                              <Link href={getCateNavHref(two)} target={getCateNavTarget(two.type)} rel={getCateNavRel(two.type)} title={two.name} className={`${submenuItemClass} gap-1.5`}>
                                <span className="shrink-0">{two.icon}</span>
                                <span className="truncate">{two.name}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
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
            className={`shrink-0 ${isDark ? '' : 'bg-[#e1e1e1]!'}`}
          />
        </div>
      </div>

      {/* 侧边导航：移动端时候显示 */}
      <SidebarNav list={cateList} open={isOpenSidebarNav} onClose={() => setIsOpenSidebarNav(false)} />
    </>
  );
};
