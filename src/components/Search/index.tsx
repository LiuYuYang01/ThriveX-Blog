'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Modal, ModalContent, ModalHeader, ModalBody, UseDisclosureProps, Input } from '@heroui/react';
import { getArticlePagingAPI } from '@/api/article';
import { Article } from '@/types/app/article';
import useDebounce from '@/hooks/useDebounce';
import Empty from '../Empty';

interface Props {
  disclosure: UseDisclosureProps & { onOpenChange: () => void };
}

export default ({ disclosure }: Props) => {
  const { isOpen, onOpenChange } = disclosure;

  const [data, setData] = useState<Paginate<Article[]>>();
  const [searchKey, setSearchKey] = useState(''); // 添加搜索关键词状态

  // 获取文章数据
  const getArticleList = async (key: string) => {
    if (key.trim().length === 0) {
      setData(undefined);
      return;
    }

    const { data } = await getArticlePagingAPI({
      key,
      pageNum: 1,
      pageSize: 10,
    })

    setData(data);
  };

  // 使用自定义防抖函数
  const debouncedFetchArticles = useDebounce(getArticleList, 300);

  // 根据关键词搜索文章
  const onSearchArticle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.value;
    setSearchKey(key); // 更新搜索关键词状态
    debouncedFetchArticles(key);
  };

  // 当模态框关闭时，清空搜索结果
  useEffect(() => {
    if (!isOpen) {
      setData(undefined);
      setSearchKey(''); // 同时清空搜索关键词
    }
  }, [isOpen]);

  return (
    <>
      <Modal
        size="lg"
        backdrop="opaque"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          backdrop: 'bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20',
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">搜索文章</ModalHeader>

              <ModalBody>
                <div className="mb-7">
                  <Input type="text" placeholder="请输入文章关键词" value={searchKey} onChange={onSearchArticle} />

                  <div className="mt-4">
                    {data?.result
                      ? data?.result?.map((item) => (
                          <Link key={item.id} href={`/article/${item.id}`} className="inline-block w-full py-2 px-4 mb-1 text-gray-700 dark:text-[#8c9ab1] hover:!text-primary hover:bg-[#f0f7ff] dark:hover:bg-[#25282d] hover:pl-8 rounded-md transition-[padding]" onClick={onClose}>
                            {item.title}
                          </Link>
                        ))
                      : data && <Empty info="暂无文章" />}
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
