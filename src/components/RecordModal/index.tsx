'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { Modal } from '@/ThriveUI';
import PhotoPreview, { type PhotoItem } from '@/ThriveUI/PhotoPreview';
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
  const { open, closeModal, focusId, clearFocus } = useRecordModalStore();
  const { author, theme } = useAppConfig();

  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [scrolled, setScrolled] = useState(false);
  const [preview, setPreview] = useState<{ photos: PhotoItem[]; index: number } | null>(null);
  const currentPageRef = useRef(1);
  const listRef = useRef<HTMLDivElement>(null);
  const fetchedRef = useRef(false);
  const focusedRef = useRef(false);

  const coverSrc = theme?.record_cover?.trim() || getStableImage(undefined, theme?.covers, 'record-cover');
  const covers = parseThemeCovers(theme?.covers);
  const bgCover = coverSrc || covers[0] || '';
  const recordName = theme?.record_name?.trim() || author?.name || '我';
  const recordAvatar = theme?.record_avatar?.trim() || author?.avatar || '';
  const recordUser = { name: recordName, avatar: recordAvatar };
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
      focusedRef.current = false;
      setScrolled(false);
      setPreview(null);
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
      setScrolled(el.scrollTop > 8);

      if (loading || !hasMore) return;
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 80) {
        const next = currentPageRef.current + 1;
        if (next <= totalPages) void fetchRecords(next, true);
      }
    };

    let timer: ReturnType<typeof setTimeout>;
    const debounced = () => {
      clearTimeout(timer);
      timer = setTimeout(onScroll, 120);
    };
    el.addEventListener('scroll', debounced, { passive: true });
    return () => {
      el.removeEventListener('scroll', debounced);
      clearTimeout(timer);
    };
  }, [open, loading, hasMore, totalPages, fetchRecords]);

  useEffect(() => {
    if (!open || !focusId || loading || focusedRef.current || !records.length) return;

    const target = listRef.current?.querySelector<HTMLElement>(`[data-record-id="${focusId}"]`);
    if (!target) return;

    focusedRef.current = true;
    requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      target.classList.add('record-item-flash');
      window.setTimeout(() => {
        target.classList.remove('record-item-flash');
        clearFocus();
      }, 1200);
    });
  }, [open, focusId, loading, records, clearFocus]);

  const openCoverPreview = () => {
    if (!bgCover) return;
    setPreview({ photos: [{ id: 'cover', url: bgCover, alt: '封面' }], index: 0 });
  };

  const openAvatarPreview = () => {
    if (!recordAvatar) return;
    setPreview({ photos: [{ id: 'avatar', url: recordAvatar, alt: recordName }], index: 0 });
  };

  return (
    <>
      <Modal
        open={open}
        onClose={closeModal}
        className="flex! h-[min(780px,92dvh)] max-h-[92dvh]! w-full max-w-97.5! flex-col overflow-hidden! rounded-2xl! border-0! bg-white! p-0! shadow-[0_20px_60px_rgba(0,0,0,0.28)] sm:mx-4"
      >
        <div className="flex h-full min-h-0 flex-col">
          <div
            className={`flex shrink-0 items-center justify-between px-4 py-2.5 dark:bg-[#1e2430] ${
              scrolled
                ? 'border-b border-[#f0f0f0] bg-white/92 backdrop-blur-md dark:border-white/10 dark:bg-[#1e2430]/92'
                : 'border-b border-transparent bg-white'
            }`}
          >
            <span className="text-[15px] font-medium text-[#191919] dark:text-slate-100">闪念</span>
            <button
              type="button"
              onClick={closeModal}
              className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-[#888] hover:bg-[#f0f0f0] hover:text-[#191919] active:scale-95 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-slate-100"
              aria-label="关闭"
            >
              <IoCloseOutline className="h-5 w-5" />
            </button>
          </div>

          <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <div className="relative mb-8">
              <button
                type="button"
                onClick={openCoverPreview}
                disabled={!bgCover}
                className="relative block h-44 w-full cursor-pointer overflow-hidden border-0 bg-[#c8c8c8] p-0 disabled:cursor-default dark:bg-[#2a3140]"
                aria-label="查看封面大图"
              >
                {bgCover ? (
                  <img src={bgCover} alt="" className="absolute inset-0 h-full w-full object-cover" />
                ) : null}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-[linear-gradient(transparent,rgba(0,0,0,0.45))]" />
                <span className="absolute right-22 bottom-2 z-10 text-[16px] font-medium text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.65)]">
                  {recordName}
                </span>
              </button>

              <button
                type="button"
                onClick={openAvatarPreview}
                disabled={!recordAvatar}
                className="absolute right-3 bottom-0 z-10 translate-y-1/2 cursor-pointer border-0 bg-transparent p-0 disabled:cursor-default"
                aria-label="查看头像大图"
              >
                {recordAvatar ? (
                  <img
                    src={recordAvatar}
                    alt={recordName}
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-md border-2 border-white object-cover shadow-sm dark:border-[#1e2430]"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-md border-2 border-white bg-[#e8e8e8] text-sm text-[#999] dark:border-[#1e2430] dark:bg-[#323e50] dark:text-slate-400">
                    {recordName.slice(0, 1)}
                  </div>
                )}
              </button>
            </div>

            <div>
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
                      user={recordUser}
                      highlighted={focusId === item.id}
                    />
                  ))}
                  <Show is={!loading && records.length === 0}>
                    <div className="bg-white py-10 dark:bg-[#1e2430]">
                      <Empty info="暂无闪念~" />
                    </div>
                  </Show>
                  {loading && records.length > 0 && (
                    <div className="bg-white py-3 text-center text-xs text-[#b2b2b2] dark:bg-[#1e2430] dark:text-slate-500">
                      加载中…
                    </div>
                  )}
                  {!hasMore && records.length > 0 && (
                    <div className="bg-white py-3 text-center text-xs text-[#c8c8c8] dark:bg-[#1e2430] dark:text-slate-600">
                      — 已经到底啦 —
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </Modal>

      <PhotoPreview
        open={!!preview}
        photos={preview?.photos ?? []}
        index={preview?.index ?? 0}
        onClose={() => setPreview(null)}
      />

      {open && <ToastContainer position="top-right" autoClose={5000} theme="colored" style={{ zIndex: 1200 }} />}
    </>
  );
}
