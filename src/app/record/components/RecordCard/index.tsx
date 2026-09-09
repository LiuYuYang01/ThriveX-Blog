'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import dayjs from 'dayjs';
import { RiChat3Line, RiHeartFill, RiMapPinLine } from 'react-icons/ri';

import ImageList from '@/app/record/components/ImageList';
import RecordCommentPanel from '@/app/record/components/Comment';
import useDebouncedLike from '@/hooks/useDebouncedLike';
import { likeRecordAction } from '@/actions/record';
import { getRecordCommentListAPI } from '@/api/recordComment';
import { Record } from '@/types/app/record';
import './like.scss';

interface Props {
  record: Record;
  highlighted?: boolean;
}

interface Particle {
  id: number;
  tx: number;
  ty: number;
  rot: number;
}

function parseImages(images: Record['images']): string[] {
  if (Array.isArray(images)) return images.filter(Boolean);
  try {
    const parsed = JSON.parse((images as string) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
}

export default function RecordCard({ record, highlighted }: Props) {
  const imageList = parseImages(record.images);
  const { count, like } = useDebouncedLike(Number(record.id), record.likeCount ?? 0, likeRecordAction);
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [popping, setPopping] = useState(false);
  const [countBump, setCountBump] = useState(false);
  const [burst, setBurst] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const particleIdRef = useRef(0);
  const lastTapRef = useRef(0);

  useEffect(() => {
    getRecordCommentListAPI(Number(record.id), { pageNum: 1, pageSize: 1 })
      .then(({ data }) => setCommentCount(data.total ?? 0))
      .catch(() => {});
  }, [record.id]);

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

  // 双击内容点赞
  const handleContentTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 320) {
      handleLike();
      setBurst(true);
      window.setTimeout(() => setBurst(false), 560);
      lastTapRef.current = 0;
      return;
    }
    lastTapRef.current = now;
  };

  return (
    <article
      data-record-id={record.id}
      className={`relative rounded-2xl border border-black/6 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-5 dark:border-white/8 dark:bg-[#1a212b] ${
        highlighted ? 'record-item-flash' : ''
      }`}
    >
      {record.mood ? (
        <span className="absolute -top-3 right-4 rotate-3 rounded-lg border border-black/8 bg-white px-1.5 py-1 text-base leading-none shadow-[0_3px_10px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[#1a212b]">
          {record.mood}
        </span>
      ) : null}

      <button
        type="button"
        onClick={handleContentTap}
        className="mt-0.5 w-full cursor-pointer border-0 bg-transparent p-0 text-left whitespace-pre-wrap wrap-break-word text-[15px] leading-[1.7] text-[#2b3240] dark:text-slate-200"
      >
        {record.content}
      </button>
      {burst && (
        <span className="record-double-tap-heart pointer-events-none absolute left-1/2 top-1/3 z-10 -translate-x-1/2 text-[#fa5151]">
          <RiHeartFill className="h-10 w-10 drop-shadow" />
        </span>
      )}

      {imageList.length > 0 && (
        <div className="mt-2.5">
          <ImageList list={imageList} />
        </div>
      )}

      <div className="mt-3 flex items-end justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5 text-xs text-[#9aa3b2] dark:text-slate-500">
          {record.createTime ? <span className="tabular-nums">{dayjs(+record.createTime).format('HH:mm')}</span> : null}
          {record.location ? (
            <span className="flex min-w-0 items-center gap-0.5">
              <RiMapPinLine className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{record.location}</span>
            </span>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-3.5">
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
            <RiHeartFill
              className={`record-like-heart h-4 w-4 ${count > 0 ? 'text-[#fa5151]' : ''} ${popping ? 'is-popping' : ''}`}
            />
            {count > 0 && (
              <span className={`text-xs tabular-nums ${countBump ? 'record-like-count-bump' : ''}`}>{count}</span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setShowComments((v) => !v)}
            className={`inline-flex cursor-pointer items-center gap-1 border-0 bg-transparent p-0 text-[#b2b2b2] hover:text-primary ${
              showComments ? 'text-primary' : ''
            }`}
            aria-label="评论"
          >
            <RiChat3Line className="h-4 w-4" />
            {commentCount > 0 && <span className="text-xs tabular-nums">{commentCount}</span>}
          </button>
        </div>
      </div>

      {showComments && (
        <div className="mt-3 rounded-xl bg-[#f6f7f9] px-3 py-2.5 dark:bg-white/5">
          <RecordCommentPanel recordId={Number(record.id)} onCountChange={setCommentCount} />
        </div>
      )}
    </article>
  );
}
