'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Modal, TextField, type DisclosureProps } from '@/ThriveUI';
import { getArticlePagingAPI } from '@/api/article';
import { Article } from '@/types/app/article';
import Empty from '../Empty';

interface Props {
  disclosure: DisclosureProps;
}

export default ({ disclosure }: Props) => {
  const { isOpen, onClose } = disclosure;

  const [data, setData] = useState<Paginate<Article[]>>();
  const [searchKey, setSearchKey] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setData(undefined);
      setSearchKey('');
    }
  }, [isOpen]);

  // 关键词变化时防抖请求；清理函数取消过期请求，避免清空后再搜被旧响应覆盖
  useEffect(() => {
    if (!isOpen) return;

    const key = searchKey.trim();
    if (!key) {
      setData(undefined);
      return;
    }

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      try {
        const { data: result } = await getArticlePagingAPI({
          title: key,
          pageNum: 1,
          pageSize: 10,
        });
        if (!cancelled) setData(result);
      } catch {
        if (!cancelled) setData(undefined);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [searchKey, isOpen]);

  return (
    <Modal open={isOpen} onClose={onClose} title="搜索文章" className="max-w-2xl">
      <div className="mb-7">
        <TextField
          type="text"
          placeholder="请输入文章关键词"
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
        />

        <div className="mt-4">
          {data?.result?.length
            ? data.result.map((item) => (
                <Link
                  key={item.id}
                  href={`/article/${item.id}`}
                  className="mb-1 inline-block w-full rounded-md px-4 py-2 text-gray-700 transition-[padding] hover:bg-[#f0f7ff] hover:pl-8 hover:text-primary! dark:text-[#8c9ab1] dark:hover:bg-[#25282d]"
                  onClick={onClose}
                >
                  {item.title}
                </Link>
              ))
            : data && <Empty info="暂无文章" />}
        </div>
      </div>
    </Modal>
  );
};
