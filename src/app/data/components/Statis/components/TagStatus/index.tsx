import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getTagListAPI } from '@/api/tag';
import { Tag } from '@/types/app/tag';
import { getRandom } from '@/utils';
import { Tooltip } from '@heroui/react';
import tag from './svg/tag.svg';

export default () => {
  const [list, setList] = useState<Tag[]>([]);
  const getTagData = async () => {
    const { data } = await getTagListAPI();
    setList(data?.result ?? []);
  };

  useEffect(() => {
    getTagData();
  }, []);

  const tagStyles = [
    'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300',
    'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300',
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
    'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300',
    'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
    'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300',
  ];

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/30 p-6 overflow-hidden">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-violet-500/10 dark:bg-violet-500/20">
          <Image src={tag.src} alt="标签墙" width={22} height={22} className="opacity-90" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">标签墙</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">文章标签云展示</p>
        </div>
      </div>
      <div className="overflow-auto max-h-[280px] pr-2 grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2 hide_sliding">
        {list.map((item, index) => (
          <Tooltip key={index} content={item.name} showArrow={true}>
            <span
              className={`flex justify-center items-center min-w-0 px-3 py-2 text-sm font-medium rounded-xl transition-[transform,box-shadow] hover:scale-105 hover:shadow-md ${tagStyles[getRandom(0, tagStyles.length - 1)]} overflow-hidden text-ellipsis whitespace-nowrap`}
            >
              {item.name}
            </span>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};
