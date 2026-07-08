import Image from 'next/image';
import { Tag } from '@/types/app/tag';
import { Tooltip } from '@/ThriveUI';
import tag from './svg/tag.svg';

const tagStyles = [
  'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300',
  'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300',
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
  'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300',
  'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300',
];

/**
 * 标签墙统计展示，以流式布局呈现文章标签
 */
export default function TagStatis({ list }: { list: Tag[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/30 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg">
          <Image src={tag.src} alt="标签墙" width={30} height={30} className="opacity-90" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">标签墙</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">文章标签云展示</p>
        </div>
      </div>
      <div className="flex flex-wrap content-start gap-2 max-h-[280px] overflow-y-auto pr-1 pb-1 hide_sliding">
        {list.map((item, index) => (
          <Tooltip key={item.id ?? index} content={item.name} showArrow={true}>
            <span
              className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-xl transition-shadow duration-200 ease-out hover:shadow-sm ${tagStyles[index % tagStyles.length]}`}
            >
              {item.name}
            </span>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}
