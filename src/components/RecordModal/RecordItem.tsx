'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { RiChat3Line, RiHeartFill, RiMapPinLine } from 'react-icons/ri';
import ImageList from '@/app/record/components/ImageList';
import RecordCommentPanel from '@/app/record/components/Comment';
import useDebouncedLike from '@/hooks/useDebouncedLike';
import { likeRecordAction } from '@/actions/record';
import { getRecordCommentListAPI } from '@/api/recordComment';
import { getRelativeTimeLabel } from '@/utils/dayFormat';
import { User } from '@/types/app/user';
import './like.scss';

interface Props {
  id: number | string;
  content: string;
  images: string | string[] | null;
  likeCount?: number;
  mood?: string;
  location?: string;
  createTime?: string | number | Date;
  user: Pick<User, 'avatar' | 'name'> | null;
}

interface Particle {
  id: number;
  tx: number;
  ty: number;
  rot: number;
}

export default function RecordItem({ id, content, images, likeCount, mood, location, createTime, user }: Props) {
  const imageList: string[] = Array.isArray(images) ? images : JSON.parse((images as string) ?? '[]');
  const { count, like } = useDebouncedLike(Number(id), likeCount ?? 0, likeRecordAction);
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [popping, setPopping] = useState(false);
  const [countBump, setCountBump] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const particleIdRef = useRef(0);

  useEffect(() => {
    getRecordCommentListAPI(Number(id), { pageNum: 1, pageSize: 1 })
      .then(({ data }) => setCommentCount(data.total ?? 0))
      .catch(() => { });
  }, [id]);

  const handleLike = () => {
    like();
    setPopping(true);
    setCountBump(true);

    const next: Particle[] = Array.from({ length: 3 }, (_, i) => {
      const angle = -Math.PI / 2 + (i - 1) * 0.55;
      const dist = 18 + Math.random() * 10;
      return {
        id: ++particleIdRef.current,
        tx: Math.cos(angle) * dist,
        ty: Math.sin(angle) * dist - 8,
        rot: (Math.random() - 0.5) * 30,
      };
    });
    setParticles((prev) => [...prev.slice(-6), ...next]);

    window.setTimeout(() => setPopping(false), 420);
    window.setTimeout(() => setCountBump(false), 320);
    window.setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !next.some((n) => n.id === p.id)));
    }, 650);
  };

  return (
    <article className="flex gap-3 border-b border-gray-50 bg-white px-4 py-3.5 dark:border-white/10 dark:bg-[#1e2430]">
      <img
        src={user?.avatar}
        alt={user?.name ?? '作者'}
        width={40}
        height={40}
        className="mt-0.5 h-10 w-10 shrink-0 rounded-md object-cover"
      />
      <div className="min-w-0 flex-1">
        <p className="m-0 text-[15px] font-medium text-[#576b95] dark:text-[#7b93c4]">
          {user?.name}
          {mood ? <span className="ml-1.5 font-normal">{mood}</span> : null}
        </p>
        <p className="mt-1 whitespace-pre-wrap wrap-break-word text-[15px] leading-[1.55] text-[#191919] dark:text-slate-200">
          {content}
        </p>
        {imageList.length > 0 && (
          <div className="mt-2.5">
            <ImageList list={imageList} />
          </div>
        )}
        <div className="mt-2 flex items-end justify-between gap-2">
          <div className="min-w-0 text-xs">
            {location ? (
              <p className="m-0 flex min-w-0 items-center gap-0.5 truncate text-[#576b95] dark:text-[#7b93c4]">
                <RiMapPinLine className="h-3 w-3 shrink-0" />
                <span className="truncate">{location}</span>
              </p>
            ) : null}
            <p className={`m-0 text-[#b2b2b2] dark:text-slate-500 ${location ? 'mt-1' : ''}`}>{getRelativeTimeLabel(createTime)}</p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              onClick={handleLike}
              className="record-like-btn relative inline-flex cursor-pointer items-center gap-1 border-0 bg-transparent p-0 text-[#b2b2b2] hover:text-[#fa5151]"
              aria-label="点赞"
            >
              {particles.map((p) => (
                <span
                  key={p.id}
                  className="record-like-particle pointer-events-none absolute left-1/2 top-1/2 text-[#fa5151]"
                  style={
                    {
                      '--tx': `${p.tx}px`,
                      '--ty': `${p.ty}px`,
                      '--rot': `${p.rot}deg`,
                    } as CSSProperties
                  }
                >
                  <RiHeartFill className="h-2.5 w-2.5" />
                </span>
              ))}
              <RiHeartFill className={`record-like-heart h-3.5 w-3.5 ${count > 0 ? 'text-[#fa5151]' : ''} ${popping ? 'is-popping' : ''}`} />
              {count > 0 && (
                <span className={`text-xs tabular-nums ${countBump ? 'record-like-count-bump' : ''}`}>{count}</span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setShowComments((v) => !v)}
              className={`inline-flex cursor-pointer items-center gap-1 border-0 bg-transparent p-0 text-[#b2b2b2] hover:text-[#576b95] ${showComments ? 'text-[#576b95]' : ''}`}
              aria-label="评论"
            >
              <RiChat3Line className="h-3.5 w-3.5" />
              <span className="text-xs tabular-nums">{commentCount}</span>
            </button>
          </div>
        </div>
        {showComments && (
          <div className="mt-2 rounded-sm bg-[#f7f7f7] px-2.5 py-2 dark:bg-white/5">
            <RecordCommentPanel recordId={Number(id)} onCountChange={setCommentCount} />
          </div>
        )}
      </div>
    </article>
  );
}
