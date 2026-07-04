'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import RecordCard from './components/RecordCard';
import RecordSidebar from './components/Sidebar';
import { getRecordListAPI } from '@/api/record';
import { getAuthorDataAPI } from '@/api/user';
import { Record } from '@/types/app/record';
import { User } from '@/types/app/user';
import Empty from '@/components/Empty';
import Show from '@/components/Show';
import Loading from '@/components/Loading';
import { TextField } from '@/ThriveUI';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RECORD_PAGE = {
  title: '日记',
  subtitle: '记录生活，遇见美好',
  metaTitle: '闪念',
} as const;

export default () => {
  const [records, setRecords] = useState<Record[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const currentPageRef = useRef(1);

  const fetchRecordList = useCallback(async (page: number, append: boolean = false) => {
    setLoading(true);
    try {
      const { data: recordData } = await getRecordListAPI({ pageNum: page, pageSize: 8 });

      if (recordData?.result?.length) {
        setRecords((prev) => (append ? [...prev, ...recordData.result] : recordData.result));
        setTotalPages(recordData.pages ?? 1);
        setHasMore(page < (recordData.pages ?? 1));
        currentPageRef.current = page;
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('获取记录列表失败:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const userResponse = await getAuthorDataAPI();
        if (userResponse?.data) setUser(userResponse.data);
        setRecords([]);
        setHasMore(true);
        setInitialLoading(true);
        currentPageRef.current = 1;
        await fetchRecordList(1, false);
      } catch (error) {
        console.error('获取初始数据失败:', error);
        setInitialLoading(false);
      }
    };
    fetchInitialData();
  }, [fetchRecordList]);

  useEffect(() => {
    const handleScroll = () => {
      if (loading || !hasMore) return;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      if (scrollTop + windowHeight >= documentHeight - 100) {
        const nextPage = currentPageRef.current + 1;
        if (nextPage <= totalPages) fetchRecordList(nextPage, true);
      }
    };
    let timeoutId: NodeJS.Timeout;
    const debounced = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 200);
    };
    window.addEventListener('scroll', debounced);
    return () => {
      window.removeEventListener('scroll', debounced);
      clearTimeout(timeoutId);
    };
  }, [hasMore, loading, totalPages, fetchRecordList]);

  const filteredRecords = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return records;
    return records.filter(
      (r) =>
        r.content?.toLowerCase().includes(q) ||
        r.location?.toLowerCase().includes(q) ||
        r.mood?.includes(q),
    );
  }, [records, keyword]);

  return (
    <>
      <title>🏕️ {RECORD_PAGE.metaTitle}</title>
      <meta name="description" content={RECORD_PAGE.subtitle} />

      <div className="min-h-screen bg-[linear-gradient(110deg,#fbfbfc_0%,#f7f8fa_58%,#fbfbfc_100%)] px-4 py-10 pt-24 dark:bg-[linear-gradient(to_right,#232931_0%,#232931_100%)] sm:px-6">
        <div className="mx-auto max-w-[1200px]">
          <header className="mb-4 sm:mb-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="m-0 text-[32px] font-semibold tracking-normal text-[#161a22] dark:text-slate-100">
                {RECORD_PAGE.title}
              </h1>
              <p className="mt-2 text-sm text-[#788190] dark:text-slate-400">{RECORD_PAGE.subtitle}</p>
            </div>

            <TextField
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              type="text"
              inputMode="search"
              placeholder="搜索日记、标签..."
              fieldClassName="w-full sm:w-[250px]"
              className="text-[13px] shadow-[0_10px_34px_rgba(37,45,60,0.05)] dark:bg-black-b"
              endContent={
                <svg className="h-4 w-4 text-[#313845] dark:text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
              }
            />
          </header>

          {initialLoading ? (
            <div className="flex justify-center py-20">
              <Loading />
            </div>
          ) : (
            <div className="grid items-start gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(280px,374px)]">
              <section className="grid gap-3">
                {filteredRecords.map((item) => (
                  <RecordCard
                    key={item.id}
                    id={item.id as number}
                    content={item.content}
                    images={item.images}
                    likeCount={item.likeCount}
                    mood={item.mood}
                    location={item.location}
                    createTime={item.createTime}
                    user={user}
                  />
                ))}
                <Show is={!filteredRecords.length}>
                  <Empty info={keyword ? '没有匹配的闪念~' : '内容为空~'} />
                </Show>
                {loading && records.length > 0 && (
                  <div className="flex justify-center py-6 text-sm text-slate-500">正在加载...</div>
                )}
                {!hasMore && records.length > 0 && (
                  <div className="flex justify-center py-6 text-sm text-slate-500">没有更多内容了</div>
                )}
              </section>

              <RecordSidebar records={records} user={user} />
            </div>
          )}
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={5000} theme="colored" />
    </>
  );
};
