'use client';

import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import Link from 'next/link';
import Show from '@/components/Show';
import Empty from '@/components/Empty';
import RandomAvatar from '@/components/RandomAvatar';
import { Comment } from '@/types/app/comment';
import { RiMessage3Line } from 'react-icons/ri';
import dayjs from 'dayjs';
import { getArticleCommentListAPI } from '@/api/comment';
import { ClientPagination } from '@/ThriveUI';

interface Props {
  id: number;
  reply: (id: number, name: string) => void;
}

const CommentList = forwardRef(({ id, reply }: Props, ref) => {
  const [data, setData] = useState<Paginate<Comment[]>>({} as Paginate<Comment[]>);
  const getCommentList = async (page: number = 1) => {
    const { data } = await getArticleCommentListAPI(+id!, { pageNum: page, pageSize: 8 });
    setData(data);
  };

  useEffect(() => {
    getCommentList();
  }, []);

  const [page, setPage] = useState(1);
  const onPaginateChange = (page: number) => {
    setPage(page);
    getCommentList(page);
  };

  const replyComment = (id: number, name: string) => {
    reply(id, name);
  };

  useImperativeHandle(ref, () => ({
    getCommentList,
  }));

  return (
    <div className="py-[30px]">
      <Show is={!!data.result?.length}>
        <ul className="mt-5 flex flex-col overflow-hidden">
          {data.result?.map((one) => (
            <li
              className="group/item relative flex min-h-[105px] flex-col justify-center border-b border-dashed border-[#eee] px-2.5 py-5 last:border-none hover:rounded-[5px] hover:bg-[#f3f8fe] dark:border-[#4e5969] dark:hover:bg-[#2e3745]"
              key={one.id}
            >
              <div className="flex items-center">
                {one.avatar ? <img src={one.avatar} alt="" className="mr-2.5 size-[35px] rounded-full" /> : <RandomAvatar className="mr-2.5 size-[35px] rounded-full" />}
                <div className="flex flex-col">
                  {one.url ? (
                    <a href={one.url} className="text-base text-primary" target="_blank" rel="noopener noreferrer">
                      {one.name}
                    </a>
                  ) : (
                    <span className="text-base text-[#444] dark:text-white">{one.name}</span>
                  )}
                  <span className="text-sm text-[#8599ab] dark:text-[#8c9ab1]">{dayjs(+one.createTime).format('YYYY-MM-DD HH:mm')}</span>
                </div>

                <div
                  className="absolute -right-[15%] cursor-pointer rounded-[30px] bg-primary px-2.5 py-1 text-xl text-white transition-[right] duration-300 group-hover/item:right-[2%]"
                  onClick={() => replyComment(one.id!, one.name)}
                >
                  <RiMessage3Line />
                </div>
              </div>

              <div className="my-2.5 break-words text-[15px] text-[#666] dark:text-[#cdcdcd]">{one.content}</div>

              {one?.children?.length
                ? one.children?.map((two) => (
                    <div className="ml-5 mt-5 sm:ml-12" key={two.id}>
                      <div className="flex items-center">
                        {two.avatar ? <img src={two.avatar} alt="" className="mr-2.5 size-[35px] rounded-full" /> : <RandomAvatar className="mr-2.5 size-[35px] rounded-full" />}

                        {two.url ? (
                          <a href={two.url} className="mr-4 text-[15px] text-primary" target="_blank" rel="noopener noreferrer">
                            {two.name}
                          </a>
                        ) : (
                          <span className="mr-4 text-[15px] text-[#444] dark:text-white">{two.name}</span>
                        )}

                        <span className="text-xs text-[#8599ab] dark:text-[#8c9ab1]">{dayjs(+two.createTime).format('YYYY-MM-DD HH:mm')}</span>
                        <div
                          className="absolute -right-[15%] cursor-pointer rounded-[30px] bg-primary px-2.5 py-1 text-xl text-white transition-[right] duration-300 group-hover/item:right-[2%]"
                          onClick={() => replyComment(two.id!, two.name)}
                        >
                          <RiMessage3Line />
                        </div>
                      </div>

                      <div className="my-2.5 break-words text-[15px] text-[#666] dark:text-[#cdcdcd] [&_a]:text-primary">
                        <Link href="#">@{one.name}：</Link>
                        <span>{two.content}</span>
                      </div>

                      {two.children?.map((three) => (
                        <div key={three.id}>
                          <div className="ml-5 mt-5 sm:ml-12">
                            <div className="flex items-center">
                              {three.avatar ? <img src={three.avatar} alt="" className="mr-2.5 size-[35px] rounded-full" /> : <RandomAvatar className="mr-2.5 size-[35px] rounded-full" />}

                              {three.url ? (
                                <a href={three.url} className="mr-4 text-[15px] text-primary" target="_blank" rel="noopener noreferrer">
                                  {three.name}
                                </a>
                              ) : (
                                <span className="mr-4 text-[15px] text-[#444] dark:text-white">{three.name}</span>
                              )}

                              <span className="text-xs text-[#8599ab] dark:text-[#8c9ab1]">{dayjs(+three.createTime).format('YYYY-MM-DD HH:mm')}</span>

                              <div
                                className="absolute -right-[15%] cursor-pointer rounded-[30px] bg-primary px-2.5 py-1 text-xl text-white transition-[right] duration-300 group-hover/item:right-[2%]"
                                onClick={() => replyComment(three.id!, three.name)}
                              >
                                <RiMessage3Line />
                              </div>
                            </div>

                            <div className="my-2.5 break-words text-[15px] text-[#666] dark:text-[#cdcdcd] [&_a]:text-primary">
                              <Link href="#">@{two.name}：</Link>
                              <span>{three.content}</span>
                            </div>
                          </div>

                          {three.children?.map((four) => (
                            <div key={four.id}>
                              <div className="ml-5 mt-5 sm:ml-12">
                                <div className="flex items-center">
                                  {four.avatar ? <img src={four.avatar} alt="" className="mr-2.5 size-[35px] rounded-full" /> : <RandomAvatar className="mr-2.5 size-[35px] rounded-full" />}

                                  {four.url ? (
                                    <a href={four.url} className="mr-4 text-[15px] text-primary" target="_blank" rel="noopener noreferrer">
                                      {four.name}
                                    </a>
                                  ) : (
                                    <span className="mr-4 text-[15px] text-[#444] dark:text-white">{four.name}</span>
                                  )}

                                  <span className="text-xs text-[#8599ab] dark:text-[#8c9ab1]">{dayjs(+four.createTime).format('YYYY-MM-DD HH:mm')}</span>

                                  <div
                                    className="absolute -right-[15%] cursor-pointer rounded-[30px] bg-primary px-2.5 py-1 text-xl text-white transition-[right] duration-300 group-hover/item:right-[2%]"
                                    onClick={() => replyComment(four.id!, four.name)}
                                  >
                                    <RiMessage3Line />
                                  </div>
                                </div>

                                <div className="my-2.5 break-words text-[15px] text-[#666] dark:text-[#cdcdcd] [&_a]:text-primary">
                                  <Link href="#">@{three.name}：</Link>
                                  <span>{four.content}</span>
                                </div>
                              </div>

                              {four.children?.map((five) => (
                                <div key={five.id} className="ml-5 mt-5 sm:ml-12">
                                  <div className="flex items-center">
                                    {five.avatar ? <img src={five.avatar} alt="" className="mr-2.5 size-[35px] rounded-full" /> : <RandomAvatar className="mr-2.5 size-[35px] rounded-full" />}

                                    {five.url ? (
                                      <a href={five.url} className="mr-4 text-[15px] text-primary" target="_blank" rel="noopener noreferrer">
                                        {five.name}
                                      </a>
                                    ) : (
                                      <span className="mr-4 text-[15px] text-[#444] dark:text-white">{five.name}</span>
                                    )}

                                    <span className="text-xs text-[#8599ab] dark:text-[#8c9ab1]">{dayjs(+five.createTime).format('YYYY-MM-DD HH:mm')}</span>

                                    <div
                                      className="absolute -right-[15%] cursor-pointer rounded-[30px] bg-primary px-2.5 py-1 text-xl text-white transition-[right] duration-300 group-hover/item:right-[2%]"
                                      onClick={() => replyComment(five.id!, five.name)}
                                    >
                                      <RiMessage3Line />
                                    </div>
                                  </div>

                                  <div className="my-2.5 break-words text-[15px] text-[#666] dark:text-[#cdcdcd] [&_a]:text-primary">
                                    <Link href="#">@{four.name}：</Link>
                                    <span>{five.content}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  ))
                : null}
            </li>
          ))}
        </ul>
      </Show>

      {!data.result?.length ? (
        <Empty info="评论列表为空~"></Empty>
      ) : (
        <ClientPagination showControls total={data.pages} page={page} onChange={onPaginateChange} className="mt-2 flex justify-center" />
      )}
    </div>
  );
});

export default CommentList;
