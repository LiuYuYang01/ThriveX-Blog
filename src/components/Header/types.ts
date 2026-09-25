import { Cate } from '@/types/app/cate';
import { Theme } from '@/types/app/config';

// 菜单栏各布局共享的数据与行为
export interface HeaderLayoutProps {
  theme: Theme;
  isDark: boolean;
  mounted: boolean;
  // 这些路径段不需要改变导航样式
  isPathSty: boolean;
  // 是否滚动改变导航样式
  isScrolled: boolean;
  cateList: Cate[];
  isOpenSidebarNav: boolean;
  // 弹窗模式下拦截闪念导航链接改为打开弹窗
  handleNavClick: (e: React.MouseEvent, href: string) => void;
  // 手动切换主题
  toTheme: () => void;
  openSidebarNav: () => void;
  closeSidebarNav: () => void;
}
