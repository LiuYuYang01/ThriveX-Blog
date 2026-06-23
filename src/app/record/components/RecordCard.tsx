import ImageList from './ImageList';
import Editor from './Editor';
import RecordCommentPanel from './Comment';
import dayjs from 'dayjs';
import { User } from '@/types/app/user';

interface RecordItemProps {
  id: number | string;
  content: string;
  images: string | string[] | null;
  createTime?: string | number | Date;
  user: Pick<User, 'avatar' | 'name'> | null;
}

const MONTH_ZH = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

const formatDay = (ts: string | number | Date | undefined) =>
  ts != null ? dayjs(+ts).format('DD') : '--';
const formatMonth = (ts: string | number | Date | undefined) =>
  ts != null ? MONTH_ZH[dayjs(+ts).month()] : '--';
const formatTime = (ts: string | number | Date | undefined) =>
  ts != null ? dayjs(+ts).format('HH:mm') : '--';

/** 根据与当前时间的差值返回相对时间文案 */
function getRelativeTimeLabel(ts: string | number | Date | undefined): string {
  if (ts == null) return '';
  const now = dayjs();
  const then = dayjs(+ts);
  const diffDays = now.startOf('day').diff(then.startOf('day'), 'day');
  const diffMonths = now.diff(then, 'month', true);
  const diffYears = now.diff(then, 'year', true);

  if (diffDays === 0) return '今天';
  if (diffDays === 1) return '昨天';
  if (diffDays >= 2 && diffDays <= 6) return `${diffDays}天前`;
  if (diffDays >= 7 && diffDays <= 13) return '一周前';
  if (diffDays >= 14 && diffDays <= 20) return '两周前';
  if (diffDays >= 21 && diffDays <= 27) return '三周前';
  if (diffMonths >= 1 && diffMonths < 2) return '一月前';
  if (diffMonths >= 2 && diffMonths < 3) return '两月前';
  if (diffMonths >= 3 && diffMonths < 6) return '三月前';
  if (diffMonths >= 6 && diffMonths < 12) return '半年前';
  if (diffYears >= 1 && diffYears < 2) return '一年前';
  if (diffYears >= 2 && diffYears < 3) return '两年前';
  if (diffYears >= 3) return `${Math.floor(diffYears)}年前`;
  return '';
}

export default function RecordCard({ id, content, images, createTime, user }: RecordItemProps) {
  const imageList: string[] = Array.isArray(images) ? images : JSON.parse((images as string) ?? '[]');

  return (
    <article key={id} className="relative flex gap-6 pb-12 group">
      {/* --- 左侧：时间轴装饰 --- */}
      <div className="flex flex-col items-center flex-shrink-0 w-14 pt-1">
        <div className="text-sm font-bold text-slate-400 dark:text-slate-500 tracking-wider">
          {formatMonth(createTime)}
        </div>
        <div className="text-2xl font-black text-slate-800 dark:text-slate-200 font-serif">
          {formatDay(createTime)}
        </div>
        {/* 连接线 */}
        <div className="h-full w-px bg-slate-200 dark:bg-slate-600 my-2 group-last:hidden" />
      </div>

      {/* --- 右侧：主体内容卡片 --- */}
      <div className="flex-grow min-w-0">
        <div className="bg-white dark:bg-black-b rounded-2xl p-5 sm:p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:shadow-none hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:hover:shadow-none transition-shadow duration-300 border border-slate-100 dark:border-black-b">
          {/* Header: 用户与元数据 */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <img
                src={user?.avatar}
                alt={user?.name ?? '作者头像'}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-50 dark:ring-slate-800 cursor-pointer transition-transform duration-200 ease-out hover:rotate-6"
              />
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{user?.name}</h3>
                <div className="text-xs text-slate-400 dark:text-slate-500">{formatTime(createTime)}</div>
              </div>
            </div>
            
            <span className="flex-shrink-0 text-xs text-slate-400 dark:text-slate-500">
              {getRelativeTimeLabel(createTime)}
            </span>
          </div>

          {/* Body: 文本内容 */}
          <div className="prose prose-sm sm:prose-base prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed break-words">
            <Editor value={content} />
          </div>

          {/* Body: 图片展示 */}
          <div className="mt-3">
            <ImageList list={imageList} />
          </div>

          <RecordCommentPanel recordId={Number(id)} />
        </div>
      </div>
    </article>
  );
}
