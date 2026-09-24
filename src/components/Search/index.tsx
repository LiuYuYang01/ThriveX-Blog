'use client';

import { useState, useEffect, Fragment } from 'react';
import Link from 'next/link';
import { Modal, TextField, type DisclosureProps } from '@/ThriveUI';
import { getSearchAPI } from '@/api/search';
import { SearchResult } from '@/types/app/search';
import Empty from '../Empty';

interface Props {
  disclosure: DisclosureProps;
}

// 关键词命中高亮（字符串 split 而非正则，避免关键词被当作正则解析）
const highlight = (text: string, key: string) => {
  const parts = text.split(key);
  return parts.map((part, i) => (
    <Fragment key={i}>
      {part}
      {i < parts.length - 1 && <span className="text-primary">{key}</span>}
    </Fragment>
  ));
};

export default ({ disclosure }: Props) => {
  const { isOpen, onClose } = disclosure;

  const [data, setData] = useState<SearchResult>();
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
        const { data: result } = await getSearchAPI({ keyword: key, limit: 5 });
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
    <Modal open={isOpen} onClose={onClose} title="搜索" className="max-w-2xl">
      <div className="mb-7">
        <TextField
          type="text"
          placeholder="搜索文章与闪念"
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
        />

        <div className="mt-4">
          {data?.articles?.length ? (
            <>
              <div className="mb-1 px-4 text-xs text-gray-400">文章</div>
              {data.articles.map((item) => (
                <Link
                  key={item.id}
                  href={`/article/${item.id}`}
                  className="mb-1 inline-block w-full rounded-md px-4 py-2 text-gray-700 transition-[padding] hover:bg-[#f0f7ff] hover:pl-8 hover:text-primary! dark:text-[#8c9ab1] dark:hover:bg-[#25282d]"
                  onClick={onClose}
                >
                  {item.title}
                </Link>
              ))}
            </>
          ) : null}

          {data?.records?.length ? (
            <>
              <div className="mb-1 px-4 text-xs text-gray-400">闪念</div>
              {data.records.map((item) => (
                <Link
                  key={item.id}
                  href={`/record?id=${item.id}`}
                  className="mb-1 inline-block w-full rounded-md px-4 py-2 text-gray-700 transition-[padding] hover:bg-[#f0f7ff] hover:pl-8 hover:text-primary! dark:text-[#8c9ab1] dark:hover:bg-[#25282d]"
                  onClick={onClose}
                >
                  <span className="line-clamp-2">{highlight(item.snippet, searchKey.trim())}</span>
                </Link>
              ))}
            </>
          ) : null}

          {data && !data.articles?.length && !data.records?.length && <Empty info="暂无相关内容" />}
        </div>
      </div>
    </Modal>
  );
};
