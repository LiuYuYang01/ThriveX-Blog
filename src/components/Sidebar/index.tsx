import Author from './Author';
import HotArticle from './HotArticle';
import RandomArticle from './RandomArticle';
import Comment from './Comment';
import RunTime from './RunTime';
import Study from './Study';
import { RightSidebar, Social } from '@/types/app/config';

interface Props {
  sidebar: RightSidebar[];
  social: Social[];
  recoArticleIds: number[];
}

export default ({ sidebar, social, recoArticleIds }: Props) => {
  return (
    <>
      <div className={`hidden lg:block ${sidebar.length ? 'lg:w-[29%] xl:w-[24%]' : 'w-0'} rounded-md transition-width sticky top-[70px]`}>
        {/* 作者介绍 */}
        {sidebar.includes('author') && <Author social={social} />}
       {/* 站点已运行 */}
        {sidebar.includes('runTime') && <RunTime />}
       {/* 随机推荐 */}
        {sidebar.includes('randomArticle') && <RandomArticle />}
        {/* 热门文章 */}
        {sidebar.includes('hotArticle') && <HotArticle recoArticleIds={recoArticleIds} />}
        {/* 最新评论 */}
        {sidebar.includes('newComments') && <Comment />}
        {/* 装饰组件 */}
        {sidebar.includes('study') && <Study />}
      </div>
    </>
  );
};
