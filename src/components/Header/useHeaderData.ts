'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

import { Cate } from '@/types/app/cate';
import { Theme } from '@/types/app/config';
import { getCateListAPI } from '@/api/cate';
import { isRecordNavHref } from '@/utils/cateNav';

import { useConfigStore, useRecordModalStore } from '@/stores';
import useMounted from '@/hooks/useMounted';
import { requestThemeTransition } from '@/utils/themeTransition';

// 菜单栏各布局共享的数据与行为
export default (theme: Theme) => {
  const patchName = usePathname();

  const { isDark } = useConfigStore();
  const mounted = useMounted();
  const openRecordModal = useRecordModalStore((s) => s.openModal);

  // 弹窗模式下拦截闪念导航链接改为打开弹窗
  const handleNavClick = (e: React.MouseEvent, href: string) => {
    if (theme?.record_mode !== 'modal' || !isRecordNavHref(href)) return;
    e.preventDefault();
    openRecordModal();
  };

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
      requestThemeTransition(e.matches);
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
    requestThemeTransition(!isDark);
  };

  // 是否打开侧边栏导航
  const [isOpenSidebarNav, setIsOpenSidebarNav] = useState(false);

  return {
    theme,
    isDark,
    mounted,
    isPathSty,
    isScrolled,
    cateList,
    isOpenSidebarNav,
    handleNavClick,
    toTheme,
    openSidebarNav: () => setIsOpenSidebarNav(true),
    closeSidebarNav: () => setIsOpenSidebarNav(false),
  };
};
