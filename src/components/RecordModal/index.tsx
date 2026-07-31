'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { IoCameraOutline, IoCloseOutline } from 'react-icons/io5';
import { Modal } from '@/ThriveUI';
import Empty from '@/components/Empty';
import Show from '@/components/Show';
import { useAppConfig } from '@/components/AppConfigProvider';
import { useRecordModalStore } from '@/stores';
import { getRecordListAPI } from '@/api/record';
import { Record } from '@/types/app/record';
import { getStableImage, parseThemeCovers } from '@/utils/cover';
import RecordItem from './RecordItem';
import RecordListSkeleton from './RecordListSkeleton';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RecordModal() {
  const { open, closeModal } = useRecordModalStore();
  const { author, theme } = useAppConfig();

  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const currentPageRef = useRef(1);
  const listRef = useRef<HTMLDivElement>(null);
  const fetchedRef = useRef(false);

  const coverSrc = getStableImage(undefined, theme?.covers, 'record-cover');
  const covers = parseThemeCovers(theme?.covers);
  const bgCover = coverSrc || covers[0] || '';
  const showSkeleton = loading && records.length === 0;

  const fetchRecords = useCallback(async (page: number, append = false) => {
    setLoading(true);
    try {
      const { data } = await getRecordListAPI({ pageNum: page, pageSize: 8 });
      if (data?.result?.length) {
        setRecords((prev) => (append ? [...prev, ...data.result] : data.result));
        setTotalPages(data.pages ?? 1);
        setHasMore(page < (data.pages ?? 1));
        currentPageRef.current = page;
      } else {
        if (!append) setRecords([]);
        setHasMore(false);
      }
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) {
      fetchedRef.current = false;
      return;
    }
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    currentPageRef.current = 1;
    setLoading(true);
    void fetchRecords(1);
  }, [open, fetchRecords]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    const el = listRef.current;
    if (!open || !el) return;

    const onScroll = () => {
      if (loading || !hasMore) return;
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 80) {
        const next = currentPageRef.current + 1;
        if (next <= totalPages) void fetchRecords(next, true);
      }
    };

    let timer: ReturnType<typeof setTimeout>;
    const debounced = () => {
      clearTimeout(timer);
      timer = setTimeout(onScroll, 150);
    };
    el.addEventListener('scroll', debounced);
    return () => {
      el.removeEventListener('scroll', debounced);
      clearTimeout(timer);
    };
  }, [open, loading, hasMore, totalPages, fetchRecords]);

  return (
    <>
      <Modal
        open={open}
        onClose={closeModal}
        className="flex! h-[min(780px,92dvh)] max-h-[92dvh]! w-full max-w-97.5! flex-col overflow-hidden! rounded-2xl! border-0! bg-white! p-0! shadow-[0_20px_60px_rgba(0,0,0,0.28)] sm:mx-4"
      >
        <div className="flex h-full min-h-0 flex-col">
          <div className="flex shrink-0 items-center justify-between bg-white px-3 py-2.5 dark:bg-[#1e2430]">
            <span className="inline-flex p-1 text-[#191919] dark:text-slate-200" aria-hidden>
              <IoCameraOutline className="h-6 w-6" />
            </span>
            <button
              type="button"
              onClick={closeModal}
              className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-[#888] hover:bg-[#f0f0f0] hover:text-[#191919] active:scale-95 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-slate-100"
              aria-label="关闭"
            >
              <IoCloseOutline className="h-5 w-5" />
            </button>
          </div>

          <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto">
            <div className="relative mb-10">
              <div
                className="relative h-50 w-full bg-[#c8c8c8] bg-cover bg-center dark:bg-[#2a3140]"
                style={bgCover ? { backgroundImage: `url(${bgCover})` } : undefined}
              >
                <span className="absolute right-22 bottom-1 z-10 text-[17px] font-medium text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.65)]">
                  {author?.name || '我'}
                </span>
              </div>
              <div className="absolute right-3 bottom-0 z-10 translate-y-1/2">
                {author?.avatar ? (
                  <img
                    src={author.avatar}
                    alt={author.name ?? '作者'}
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-md border-2 border-white object-cover shadow-sm dark:border-[#1e2430]"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-md border-2 border-white bg-[#d9d9d9] dark:border-[#1e2430]" />
                )}
              </div>
            </div>

            <div className="mt-2">
              {showSkeleton ? (
                <RecordListSkeleton />
              ) : (
                <>
                  {records.map((item) => (
                    <RecordItem
                      key={item.id}
                      id={item.id as number}
                      content={item.content}
                      images={item.images}
                      likeCount={item.likeCount}
                      mood={item.mood}
                      location={item.location}
                      createTime={item.createTime as string | number | undefined}
                      user={author}
                    />
                  ))}
                  <Show is={!loading && records.length === 0}>
                    <div className="bg-white py-10 dark:bg-[#1e2430]">
                      <Empty info="暂无闪念~" />
                    </div>
                  </Show>
                  {loading && records.length > 0 && (
                    <div className="bg-white py-4 text-center text-sm text-slate-400 dark:bg-[#1e2430]">正在加载...</div>
                  )}
                  {!hasMore && records.length > 0 && (
                    <div className="bg-white py-4 text-center text-sm text-slate-400 dark:bg-[#1e2430]">没有更多了</div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </Modal>

      {open && <ToastContainer position="top-right" autoClose={5000} theme="colored" style={{ zIndex: 1200 }} />}
    </>
  );
}
