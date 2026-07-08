import Statis from '../Statis';
import Archiving from '../Archiving';
import { getArticlePagingCacheAPI } from '@/lib/article';
import { getCateListCacheAPI } from '@/lib/cate';
import { getCommentListCacheAPI } from '@/lib/comment';
import { getTagListCacheAPI } from '@/lib/tag';
import { getWebListCacheAPI } from '@/lib/web';

export default async () => {
  const [articleRes, cateRes, tagRes, commentRes, webRes] = await Promise.all([
    getArticlePagingCacheAPI(),
    getCateListCacheAPI(),
    getTagListCacheAPI(),
    getCommentListCacheAPI(),
    getWebListCacheAPI(),
  ]);
  const data = articleRes?.data;

  return (
    <div className="rounded-2xl shadow-xl overflow-hidden bg-white dark:bg-black-b/95 backdrop-blur-xs border border-slate-200/80 dark:border-slate-700/50">
      <div className="p-6 sm:p-10 lg:p-12 space-y-12">
        <Statis
          aTotal={data?.total ?? 0}
          cateList={cateRes?.data?.result ?? []}
          tagList={tagRes?.data?.result ?? []}
          commentList={commentRes?.data?.result ?? []}
          linkList={webRes?.data?.result ?? []}
        />
        <Archiving list={data?.result ?? []} />
      </div>
    </div>
  );
};
