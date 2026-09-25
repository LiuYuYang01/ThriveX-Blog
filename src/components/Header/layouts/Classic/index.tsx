'use client';

import Link from 'next/link';
import React from 'react';

import { Switch } from '@/ThriveUI';
import Show from '@/components/Show';
import OptimizedImage from '@/components/OptimizedImage';
import Submenu from '../../components/Submenu';
import { HeaderLayoutProps } from '../../types';

import { getCateNavHref, getCateNavRel, getCateNavTarget } from '@/utils/cateNav';

import { IoIosArrowDown } from 'react-icons/io';
import { FaRegSun } from 'react-icons/fa';
import { LuMenu } from 'react-icons/lu';
import { BsFillMoonStarsFill } from 'react-icons/bs';

// 经典通栏布局：全宽沉浸式，滚动后切换为毛玻璃背景
export default ({ theme, isDark, mounted, isPathSty, isScrolled, cateList, handleNavClick, toTheme, openSidebarNav }: HeaderLayoutProps) => {
  const logoSrc = !mounted
    ? theme?.dark_logo || theme?.light_logo || ''
    : isDark
      ? theme?.dark_logo
      : isPathSty || isScrolled
        ? theme?.light_logo
        : theme?.dark_logo;

  return (
    <div className={`header fixed inset-x-0 top-0 w-full h-[60px] z-50 overflow-visible after:content-[''] after:block after:w-full after:h-0 after:bg-[linear-gradient(#fff,transparent_70%)] dark:after:bg-[linear-gradient(#2b333e,transparent_70%)] ${isPathSty || isScrolled ? 'bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(44,51,62,0.7)] backdrop-blur-md border-b dark:border-[#2b333e] after:h-5! after:transition-height]' : 'border-transparent'}`}>
      <div className="grid grid-cols-[1fr_auto_1fr] grid-rows-[60px] h-[60px] md:flex md:justify-between items-center w-full max-w-[1200px] mx-auto px-4 md:px-6 lg:px-0!">
        <div
          className="md:hidden group flex items-center justify-center size-9 shrink-0 rounded-full transition-colors cursor-pointer hover:bg-[#e9edf4] dark:hover:bg-[#455162]"
          onClick={openSidebarNav}
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
            {cateList?.map((one) => {
              const href = getCateNavHref(one);
              const linkClass = `flex items-center h-[60px] text-[15px] whitespace-nowrap group-hover/one:text-primary! ${isPathSty || isScrolled ? 'text-[#333] dark:text-white' : 'text-white'}`;
              return (
                <React.Fragment key={one.id}>
                  {one.type === 'cate' && (
                    <li className="group/one relative">
                      {one.children.length ? (
                        <span className={`${linkClass} px-5 cursor-default`}>
                          {one.icon} {one.name}
                          <IoIosArrowDown className="ml-2 transition-[rotate] duration-200 group-hover/one:rotate-180" />
                        </span>
                      ) : (
                        <Link href={href} target={getCateNavTarget(one.type)} rel={getCateNavRel(one.type)} className={`${linkClass} px-5`} onClick={(e) => handleNavClick(e, href)}>
                          {one.icon} {one.name}
                        </Link>
                      )}
                      <Show is={!!one.children.length}>
                        <Submenu items={one.children} onNavClick={handleNavClick} />
                      </Show>
                    </li>
                  )}

                  {one.type === 'page' && (
                    <li className="group/one relative">
                      {one.children?.length ? (
                        <span className={`${linkClass} px-10 cursor-default`}>
                          {one.icon} {one.name}
                          <IoIosArrowDown className="ml-2 transition-[rotate] duration-200 group-hover/one:rotate-180" />
                        </span>
                      ) : (
                        <Link href={href} target={getCateNavTarget(one.type)} rel={getCateNavRel(one.type)} className={`${linkClass} px-10`} onClick={(e) => handleNavClick(e, href)}>
                          {one.icon} {one.name}
                        </Link>
                      )}
                      <Show is={!!one.children?.length}>
                        <Submenu items={one.children} showIcon onNavClick={handleNavClick} />
                      </Show>
                    </li>
                  )}

                  {one.type === 'nav' && (
                    <li className="group/one relative">
                      {one.children?.length ? (
                        <span className={`${linkClass} px-10 cursor-default`}>
                          {one.icon} {one.name}
                          <IoIosArrowDown className="ml-2 transition-[rotate] duration-200 group-hover/one:rotate-180" />
                        </span>
                      ) : (
                        <Link href={href} target={getCateNavTarget(one.type)} rel={getCateNavRel(one.type)} className={`${linkClass} px-10`} onClick={(e) => handleNavClick(e, href)}>
                          {one.icon} {one.name}
                        </Link>
                      )}
                      <Show is={!!one.children?.length}>
                        <Submenu items={one.children} showIcon onNavClick={handleNavClick} />
                      </Show>
                    </li>
                  )}
                </React.Fragment>
              );
            })}
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
  );
};
