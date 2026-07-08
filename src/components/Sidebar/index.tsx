import Author from './Author';
import HotArticle from './HotArticle';
import RandomArticle from './RandomArticle';
import Comment from './Comment';
import RunTime from './RunTime';
import Study from './Study';
import { getThemeConfigCacheAPI } from '@/lib/theme';

export default async () => {
  const theme = await getThemeConfigCacheAPI();
  const sidebar = theme?.right_sidebar ?? [];

  return (
    <>
      <div className={`hidden lg:block ${sidebar.length ? 'lg:w-[29%] xl:w-[24%]' : 'w-0'} rounded-md transition-width sticky top-[70px]`}>
        {/* 作者介绍 */}
        {sidebar.includes('author') && <Author />}
        {/* 站点已运行 */}
        {sidebar.includes('runTime') && <RunTime />}
        {/* 随机推荐 */}
        {sidebar.includes('randomArticle') && <RandomArticle />}
        {/* 热门文章 */}
        {sidebar.includes('hotArticle') && <HotArticle />}
        {/* 最新评论 */}
        {sidebar.includes('newComments') && <Comment />}
        {/* 装饰组件 */}
        {sidebar.includes('study') && <Study />}
      </div>
    </>
  );
};
