'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Modal, TextField, type DisclosureProps } from '@/ThriveUI';
import { getArticlePagingAPI } from '@/api/article';
import { Article } from '@/types/app/article';
import useDebounce from '@/hooks/useDebounce';
import Empty from '../Empty';

interface Props {
  disclosure: DisclosureProps;
}

export default ({ disclosure }: Props) => {
  const { isOpen, onClose } = disclosure;

  const [data, setData] = useState<Paginate<Article[]>>();
  const [searchKey, setSearchKey] = useState('');

  const getArticleList = async (key: string) => {
    if (key.trim().length === 0) {
      setData(undefined);
      return;
    }

    const { data } = await getArticlePagingAPI({
      key,
      pageNum: 1,
      pageSize: 10,
    });

    setData(data);
  };

  const debouncedFetchArticles = useDebounce(getArticleList, 300);

  const onSearchArticle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.value;
    setSearchKey(key);
    debouncedFetchArticles(key);
  };

  useEffect(() => {
    if (!isOpen) {
      setData(undefined);
      setSearchKey('');
    }
  }, [isOpen]);

  return (
    <Modal open={isOpen} onClose={onClose} title="搜索文章" className="max-w-2xl">
      <div className="mb-7">
        <TextField type="text" placeholder="请输入文章关键词" value={searchKey} onChange={onSearchArticle} />

        <div className="mt-4">
          {data?.result
            ? data?.result?.map((item) => (
                <Link
                  key={item.id}
                  href={`/article/${item.id}`}
                  className="mb-1 inline-block w-full rounded-md px-4 py-2 text-gray-700 transition-[padding] hover:bg-[#f0f7ff] hover:pl-8 hover:!text-primary dark:text-[#8c9ab1] dark:hover:bg-[#25282d]"
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
