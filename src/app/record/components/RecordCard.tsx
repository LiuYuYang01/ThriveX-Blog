'use client';

import { useEffect, useState } from 'react';
import { RiChat3Line } from 'react-icons/ri';
import ImageList from './ImageList';
import RecordCommentPanel from './Comment';
import LikeButton from '@/components/LikeButton';
import { likeRecordAPI } from '@/api/record';
import { getRecordCommentListAPI } from '@/api/recordComment';
import { getRelativeTimeLabel } from '@/utils';
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
  'inline-flex h-7 items-center gap-1.5 border-0 bg-transparent p-0 text-sm text-[#343b48] cursor-pointer transition-colors hover:text-primary dark:text-slate-300 dark:hover:text-primary';

export default function RecordCard({ id, content, images, likeCount, mood, location, createTime, user }: RecordItemProps) {
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const imageList: string[] = Array.isArray(images) ? images : JSON.parse((images as string) ?? '[]');

  useEffect(() => {
    getRecordCommentListAPI(Number(id), { pageNum: 1, pageSize: 1 })
      .then(({ data }) => setCommentCount(data.total ?? 0))
      .catch(() => {});
  }, [id]);

  return (
    <article className="rounded-xl border border-[#edf0f4] bg-white/85 px-6 py-5 shadow-[0_18px_55px_rgba(33,42,58,0.08)] dark:border-white/10 dark:bg-black-b">
      <div className="flex items-center gap-3.5">
        <img src={user?.avatar} alt={user?.name ?? '作者'} width={43} height={43} className="h-[43px] w-[43px] rounded-full object-cover" />
        <div className="text-base font-semibold text-[#161a22] dark:text-slate-100">
          {user?.name}
          {mood && <span className="ml-1.5">{mood}</span>}
        </div>
      </div>

      <p className="mt-3 whitespace-pre-wrap wrap-break-word text-base leading-[1.66] text-[#242a35] dark:text-slate-200">
        {content}
      </p>

      {imageList.length > 0 && (
        <div className="mt-[18px]">
          <ImageList list={imageList} />
        </div>
      )}

      <div className="mt-4 flex items-center justify-between gap-4 border-t border-[#edf0f4] pt-3.5 dark:border-white/10">
        <div className="flex min-w-0 items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
          <span className="shrink-0">{getRelativeTimeLabel(createTime)}</span>
          {location && (
            <>
              <span className="shrink-0 text-slate-300 dark:text-slate-600">·</span>
              <span className="flex min-w-0 items-center gap-1 truncate text-primary">
                <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M20 10c0 5-8 10-8 10S4 15 4 10a8 8 0 1 1 16 0Z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
                <span className="truncate">{location}</span>
              </span>
            </>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-3 rounded-lg bg-[#f4f6f9] px-2 py-0.5 dark:bg-white/5">
          <LikeButton entityId={Number(id)} initialCount={likeCount ?? 0} likeAPI={likeRecordAPI} variant="inline" className="gap-1" />
          <span className="h-3.5 w-px bg-slate-200 dark:bg-white/10" aria-hidden />
          <button
            type="button"
            onClick={() => setShowComments((v) => !v)}
            className={`${actionClass} ${showComments ? 'text-primary hover:text-primary dark:text-primary' : ''}`}
          >
            <RiChat3Line className="h-4 w-4" />
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
