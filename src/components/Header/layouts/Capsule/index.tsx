'use client';

import Link from 'next/link';
import React from 'react';

import { Switch } from '@/ThriveUI';
import Show from '@/components/Show';
import OptimizedImage from '@/components/OptimizedImage';
import Submenu from '../../components/Submenu';
import HeaderSearch from '../../components/HeaderSearch';
import { HeaderLayoutProps } from '../../types';

import { getCateNavHref, getCateNavRel, getCateNavTarget } from '@/utils/cateNav';

import { IoIosArrowDown } from 'react-icons/io';
import { FaRegSun } from 'react-icons/fa';
import { LuMenu } from 'react-icons/lu';
import { BsFillMoonStarsFill } from 'react-icons/bs';

// 悬浮胶囊布局：圆角胶囊毛玻璃，背景图范围内透明展示，超出后显示胶囊背景
export default ({ theme, isDark, mounted, isPathSty, isScrolled, cateList, handleNavClick, toTheme, openSidebarNav }: HeaderLayoutProps) => {
  // 是否在背景图范围内：未滚动且当前页面有沉浸式头图
  const isOverHero = !isPathSty && !isScrolled;

  const linkClass = `flex items-center rounded-full px-4 py-2 text-[15px] whitespace-nowrap cursor-pointer hover:text-primary! ${isOverHero ? 'text-white hover:bg-white/10' : 'text-[#333] dark:text-white hover:bg-black/5 dark:hover:bg-white/10'}`;

  const logoSrc = !mounted ? theme?.dark_logo || theme?.light_logo || '' : isDark ? theme?.dark_logo : isOverHero ? theme?.dark_logo : theme?.light_logo;

  return (
    <div className="header fixed inset-x-0 top-3 z-50 px-4">
      <div className="relative flex items-center justify-between h-14 max-w-300 mx-auto px-8">
        {/* 毛玻璃背景层：独立于内容，避免嵌套 backdrop-filter 导致下拉子菜单模糊失效 */}
        {!isOverHero && (
          <div aria-hidden className="absolute inset-0 rounded-full border border-black/5 dark:border-white/10 bg-[rgba(255,255,255,0.6)] dark:bg-[rgba(44,51,62,0.6)] backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.08)]" />
        )}

        <div className="relative flex items-center min-w-0">
          {/* 移动端侧边导航入口 */}
          <div className="md:hidden flex items-center justify-center size-9 shrink-0 rounded-full cursor-pointer hover:bg-white/10 dark:hover:bg-white/10" onClick={openSidebarNav}>
            <LuMenu className={`text-xl ${isOverHero ? 'text-white' : 'text-[#333] dark:text-white'}`} />
          </div>

          {/* logo */}
          <Link href="/" className="flex items-center h-14 text-[15px]">
            <div className="relative h-9 w-32 md:h-10 md:w-40 md:pr-5 hover:scale-90 transition-[scale]">
              <OptimizedImage src={logoSrc} alt="Logo" fill sizes="160px" className="object-contain object-left" />
            </div>
          </Link>

          <ul className="hidden md:flex items-center overflow-visible">
            <li className="group/one relative">
              <Link href="/" className={linkClass}>
                💎 首页
              </Link>
            </li>

            {/* 文章分类 */}
            {cateList?.map((one) => {
              const href = getCateNavHref(one);
              return (
                <li key={one.id} className="group/one relative">
                  {one.children?.length ? (
                    <span className={`${linkClass} cursor-default`}>
                      {one.icon} {one.name}
                      <IoIosArrowDown className="ml-1.5 transition-[rotate] duration-200 group-hover/one:rotate-180" />
                    </span>
                  ) : (
                    <Link href={href} target={getCateNavTarget(one.type)} rel={getCateNavRel(one.type)} className={linkClass} onClick={(e) => handleNavClick(e, href)}>
                      {one.icon} {one.name}
                    </Link>
                  )}
                  <Show is={!!one.children?.length}>
                    <Submenu items={one.children ?? []} showIcon={one.type !== 'cate'} onNavClick={handleNavClick} />
                  </Show>
                </li>
              );
            })}
          </ul>
        </div>

        {/* 搜索入口 + 主题切换开关 */}
        <div className="relative flex items-center gap-3 shrink-0">
          <HeaderSearch overHero={isOverHero} />
          <Switch size="lg" isSelected={isDark} onValueChange={toTheme} thumbIcon={({ isSelected }) => (isSelected ? <BsFillMoonStarsFill className="text-gray-500" /> : <FaRegSun className="text-gray-500" />)} />
        </div>
      </div>
    </div>
  );
};
