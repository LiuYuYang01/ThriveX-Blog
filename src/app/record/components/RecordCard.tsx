'use client';

import { useEffect, useState } from 'react';
import ImageList from './ImageList';
import Editor from './Editor';
import RecordCommentPanel from './Comment';
import useDebouncedLike from '@/hooks/useDebouncedLike';
import { likeRecordAPI } from '@/api/record';
import { getRecordCommentListAPI } from '@/api/recordComment';
import dayjs from 'dayjs';
import { User } from '@/types/app/user';

interface RecordItemProps {
  id: number | string;
  content: string;
  images: string | string[] | null;
  likeCount?: number;
  mood?: string;
  location?: string;
  createTime?: string | number | Date;
  user: Pick<User, 'avatar' | 'name'> | null;
}

const actionClass =
  'inline-flex items-center gap-2 border-0 bg-transparent p-0 text-[#343b48] cursor-pointer transition-colors hover:text-[#ef5166] dark:text-slate-300 dark:hover:text-[#ef5166]';

function HeartIcon({ active }: { active?: boolean }) {
  return (
    <svg className="h-[17px] w-[17px]" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.85">
      <path d="M20.8 5.7a5 5 0 0 0-7.1 0L12 7.4l-1.7-1.7a5 5 0 1 0-7.1 7.1L12 21l8.8-8.2a5 5 0 0 0 0-7.1Z" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg className="h-[17px] w-[17px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85">
      <path d="M21 12a8 8 0 0 1-8 8H6l-3 3v-8a8 8 0 1 1 18-3Z" />
      <path d="M8 12h.01" />
      <path d="M12 12h.01" />
      <path d="M16 12h.01" />
    </svg>
  );
}

function getRelativeTimeLabel(ts: string | number | Date | undefined): string {
  if (ts == null) return '';
  const now = dayjs();
  const then = dayjs(+ts);
  const diffDays = now.startOf('day').diff(then.startOf('day'), 'day');
  const diffMonths = now.diff(then, 'month', true);
  const diffYears = now.diff(then, 'year', true);

  if (diffDays === 0) return `今天 ${then.format('HH:mm')}`;
  if (diffDays === 1) return `昨天 ${then.format('HH:mm')}`;
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

export default function RecordCard({ id, content, images, likeCount, mood, location, createTime, user }: RecordItemProps) {
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const { count, like } = useDebouncedLike(Number(id), likeCount ?? 0, likeRecordAPI);
  const imageList: string[] = Array.isArray(images) ? images : JSON.parse((images as string) ?? '[]');

  useEffect(() => {
    getRecordCommentListAPI(Number(id), { pageNum: 1, pageSize: 1 })
      .then(({ data }) => setCommentCount(data.total ?? 0))
      .catch(() => {});
  }, [id]);

  const handleLike = () => {
    setLiked(true);
    like();
  };

  return (
    <article className="rounded-xl border border-[#edf0f4] bg-white/85 px-6 py-5 shadow-[0_18px_55px_rgba(33,42,58,0.08)] dark:border-white/10 dark:bg-black-b">
      <div className="flex items-start justify-between gap-[18px]">
        <div className="flex items-center gap-3.5">
          <img src={user?.avatar} alt={user?.name ?? '作者'} width={43} height={43} className="h-[43px] w-[43px] rounded-full object-cover" />
          <div className="text-base font-semibold text-[#161a22] dark:text-slate-100">
            {user?.name}
            {mood && <span className="ml-1.5">{mood}</span>}
          </div>
        </div>
        <span className="shrink-0 text-xs text-slate-400 dark:text-slate-500">{getRelativeTimeLabel(createTime)}</span>
      </div>

      <div className="mt-3 text-base leading-[1.66] text-[#242a35] dark:text-slate-200">
        <Editor value={content} />
      </div>

      {imageList.length > 0 && (
        <div className="mt-[18px]">
          <ImageList list={imageList} />
        </div>
      )}

      <div className="mt-4 flex items-center gap-4">
        {location && (
          <div className="flex min-w-0 items-center gap-1 text-[13px] text-primary">
            <svg className="h-[15px] w-[15px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20 10c0 5-8 10-8 10S4 15 4 10a8 8 0 1 1 16 0Z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            <span className="truncate">{location}</span>
          </div>
        )}
        <div className="ml-auto flex shrink-0 gap-10">
          <button type="button" onClick={handleLike} className={`${actionClass} ${liked ? 'text-[#ef5166]' : ''}`}>
            <HeartIcon active={liked} />
            <span className="tabular-nums">{count}</span>
          </button>
          <button
            type="button"
            onClick={() => setShowComments((v) => !v)}
            className={`${actionClass} ${showComments ? 'text-primary hover:text-primary dark:text-primary' : ''}`}
          >
            <CommentIcon />
            <span className="tabular-nums">{commentCount}</span>
          </button>
        </div>
      </div>

      {showComments && (
        <div className="mt-4 border-t border-[#edf0f4] pt-4 dark:border-white/10">
          <RecordCommentPanel recordId={Number(id)} onCountChange={setCommentCount} />
        </div>
      )}
    </article>
  );
}
