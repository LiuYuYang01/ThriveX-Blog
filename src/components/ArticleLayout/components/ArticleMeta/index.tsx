import { Fragment } from 'react';
import dayjs from 'dayjs';
import { FiCalendar, FiEye } from 'react-icons/fi';
import { IconType } from 'react-icons';
import { Article } from '@/types/app/article';
import { cn } from '@/lib/utils';

interface ArticleMetaProps {
  article: Pick<Article, 'createTime' | 'view' | 'cateList'>;
  className?: string;
}

interface MetaItem {
  key: string;
  icon?: IconType;
  label: string;
}

function buildMetaItems(article: ArticleMetaProps['article']): MetaItem[] {
  const items: MetaItem[] = [
    {
      key: 'date',
      icon: FiCalendar,
      label: dayjs(+article.createTime!).format('YYYY-MM-DD'),
    },
    {
      key: 'view',
      icon: FiEye,
      label: `${article.view} 阅读`,
    },
  ];

  const category = article.cateList[0]?.name;
  if (category) {
    items.push({ key: 'category', label: category });
  }

  return items;
}

export default function ArticleMeta({ article, className }: ArticleMetaProps) {
  const items = buildMetaItems(article);

  return (
    <div className={cn('flex flex-wrap pt-5', className)}>
      {/* <div className="inline-flex max-w-full flex-wrap items-center rounded-full border border-white/20 bg-black/30 px-1 py-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md"> */}
      <div className="inline-flex max-w-full flex-wrap items-center rounded-full px-1 py-1">
        {items.map(({ key, icon: Icon, label }, index) => (
          <Fragment key={key}>
            {index > 0 && <span className="mx-0.5 h-3 w-px shrink-0 bg-white/25" aria-hidden />}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs text-white/90 sm:px-3">
              {Icon && <Icon className="size-3.5 shrink-0 text-white/55" strokeWidth={2} />}
              <span className="whitespace-nowrap">{label}</span>
            </span>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
