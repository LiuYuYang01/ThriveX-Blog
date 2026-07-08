import Image from 'next/image';

import statis from './svg/statis.svg';
import article from './svg/article.svg';
import cate from './svg/cate.svg';
import comment from './svg/comment.svg';
import friend from './svg/friend.svg';

import { Cate } from '@/types/app/cate';
import { Comment } from '@/types/app/comment';
import { Tag } from '@/types/app/tag';
import { Web } from '@/types/app/web';

import { flattenCateForStatis } from '@/app/cate/utils';
import CateStatis from './components/CateStatis';
import TagStatis from './components/TagStatus';

interface Props {
  aTotal: number;
  cateList: Cate[];
  tagList: Tag[];
  commentList: Comment[];
  linkList: Web[];
}

export default ({ aTotal, cateList, tagList, commentList, linkList }: Props) => {
  const flatCateList = flattenCateForStatis(cateList);

  const statCards = [
    {
      title: '文章总计',
      value: aTotal,
      icon: article,
      gradient: 'from-sky-500 to-blue-600',
      bgLight: 'bg-sky-50 dark:bg-sky-500/10',
      borderColor: 'border-sky-200 dark:border-sky-500/30 hover:border-sky-200/80 dark:hover:border-sky-500/40',
      textColor: 'text-sky-600 dark:text-sky-400',
    },
    {
      title: '评论总计',
      value: commentList.length,
      icon: comment,
      gradient: 'from-amber-500 to-orange-500',
      bgLight: 'bg-amber-50 dark:bg-amber-500/10',
      borderColor: 'border-amber-200 dark:border-amber-500/30 hover:border-amber-200/80 dark:hover:border-amber-500/40',
      textColor: 'text-amber-600 dark:text-amber-400',
    },
    {
      title: '分类总计',
      value: flatCateList.length,
      icon: cate,
      gradient: 'from-emerald-500 to-teal-500',
      bgLight: 'bg-emerald-50 dark:bg-emerald-500/10',
      borderColor: 'border-emerald-200 dark:border-emerald-500/30 hover:border-emerald-200/80 dark:hover:border-emerald-500/40',
      textColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      title: '友联总计',
      value: linkList.length,
      icon: friend,
      gradient: 'from-rose-500 to-red-500',
      bgLight: 'bg-rose-50 dark:bg-rose-500/10',
      borderColor: 'border-rose-200 dark:border-rose-500/30 hover:border-rose-200/80 dark:hover:border-rose-500/40',
      textColor: 'text-rose-600 dark:text-rose-400',
    },
  ];

  return (
    <section className="space-y-10">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl">
          <Image src={statis.src} alt="统计" width={34} height={34} className="opacity-90" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">数据统计</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">博客核心指标概览</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <div
            key={index}
            className={`group relative overflow-hidden rounded-2xl border ${card.borderColor} ${card.bgLight} p-5 transition-[translate,box-shadow] duration-300 ease-out hover:shadow-lg hover:-translate-y-0.5`}
          >
            <div className="relative flex items-center justify-between">
              <div className="flex items-center justify-center rounded-xl dark:bg-black/20">
                <Image src={card.icon} alt={card.title} width={48} height={48} />
              </div>
              <div className="text-right">
                <p className={`text-3xl font-bold tabular-nums ${card.textColor}`}>{card.value}</p>
                <p className={`text-sm font-medium mt-0.5 ${card.textColor} opacity-90`}>{card.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
        <CateStatis list={cateList} />
        <TagStatis list={tagList} />
      </div>
    </section>
  );
};
