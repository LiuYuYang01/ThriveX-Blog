'use client';

import { ComponentType } from 'react';

import ClassicHeader from './layouts/Classic';
import CapsuleHeader from './layouts/Capsule';
import SidebarNav from './components/SidebarNav';
import useHeaderData from './useHeaderData';
import { HeaderLayoutProps } from './types';

import { Theme } from '@/types/app/config';

// 菜单栏布局注册表
const headerLayouts: Record<string, ComponentType<HeaderLayoutProps>> = {
  classic: ClassicHeader,
  capsule: CapsuleHeader,
};

export default ({ theme }: { theme: Theme }) => {
  const headerData = useHeaderData(theme);
  const Layout = headerLayouts[theme.header_layout ?? 'classic'] ?? ClassicHeader;

  return (
    <>
      <Layout {...headerData} />

      {/* 侧边导航：移动端时候显示 */}
      <SidebarNav list={headerData.cateList} open={headerData.isOpenSidebarNav} onClose={headerData.closeSidebarNav} />
    </>
  );
};
