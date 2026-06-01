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
import { Pagination } from '@heroui/react';
import './index.scss';

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

  // 回复评论
  const replyComment = (id: number, name: string) => {
    reply(id, name);
  };

  useImperativeHandle(ref, () => ({
    getCommentList,
  }));

  // 这里的逻辑有点乱，暂时先这样，有空再优化！！！
  return (
    <div className="CommentListComponent">
      <Show is={!!data.result?.length}>
        <ul className="list">
          {data.result?.map((one) => (
            <li className="item" key={one.id}>
              <div className="comment_user_one">
                {one.avatar ? <img src={one.avatar} alt="" className="avatar" /> : <RandomAvatar className="avatar" />}
                <div className="comment_user_one_info">
                  {one.url ? (
                    <a href={one.url} className="name active" target="_blank" rel="noopener noreferrer">
                      {one.name}
                    </a>
                  ) : (
                    <span className="name">{one.name}</span>
                  )}
                  <span className="time">{dayjs(+one.createTime).format('YYYY-MM-DD HH:mm')}</span>
                </div>

                <div className="reply" onClick={() => replyComment(one.id!, one.name)}>
                  <RiMessage3Line />
                </div>
              </div>

              <div className="comment_main">{one.content}</div>

              {one?.children?.length
                ? one.children?.map((two) => (
                    <div className="comment_user_two !ml-5 sm:!ml-12" key={two.id}>
                      <div className="comment_user_two_info">
                        {two.avatar ? <img src={two.avatar} alt="" className="avatar" /> : <RandomAvatar className="avatar" />}

                        {two.url ? (
                          <a href={two.url} className="name active !text-primary" target="_blank" rel="noopener noreferrer">
                            {two.name}
                          </a>
                        ) : (
                          <span className="name">{two.name}</span>
                        )}

                        <span className="time">{dayjs(+two.createTime).format('YYYY-MM-DD HH:mm')}</span>
                        <div className="reply" onClick={() => replyComment(two.id!, two.name)}>
                          <RiMessage3Line />
                        </div>
                      </div>

                      <div className="comment_main">
                        <Link href="#">@{one.name}：</Link>
                        <span>{two.content}</span>
                      </div>

                      {two.children?.map((three) => (
                        <div key={three.id}>
                          <div className="comment_user_three !ml-5 sm:!ml-12">
                            <div className="comment_user_three_info">
                              {three.avatar ? <img src={three.avatar} alt="" className="avatar" /> : <RandomAvatar className="avatar" />}

                              {three.url ? (
                                <a href={three.url} className="name active !text-primary" target="_blank" rel="noopener noreferrer">
                                  {three.name}
                                </a>
                              ) : (
                                <span className="name">{three.name}</span>
                              )}

                              <span className="time">{dayjs(+three.createTime).format('YYYY-MM-DD HH:mm')}</span>

                              <div className="reply" onClick={() => replyComment(three.id!, three.name)}>
                                <RiMessage3Line />
                              </div>
                            </div>

                            <div className="comment_main">
                              <Link href="#">@{two.name}：</Link>
                              <span>{three.content}</span>
                            </div>
                          </div>

                          {three.children?.map((four) => (
                            <div key={four.id}>
                              <div className="comment_user_three !ml-5 sm:!ml-12">
                                <div className="comment_user_three_info">
                                  {four.avatar ? <img src={four.avatar} alt="" className="avatar" /> : <RandomAvatar className="avatar" />}

                                  {four.url ? (
                                    <a href={four.url} className="name active !text-primary" target="_blank" rel="noopener noreferrer">
                                      {four.name}
                                    </a>
                                  ) : (
                                    <span className="name">{four.name}</span>
                                  )}

                                  <span className="time">{dayjs(+four.createTime).format('YYYY-MM-DD HH:mm')}</span>

                                  <div className="reply" onClick={() => replyComment(four.id!, four.name)}>
                                    <RiMessage3Line />
                                  </div>
                                </div>

                                <div className="comment_main">
                                  <Link href="#">@{three.name}：</Link>
                                  <span>{four.content}</span>
                                </div>
                              </div>

                              {four.children?.map((five) => (
                                <div key={five.id} className="comment_user_three !ml-5 sm:!ml-12">
                                  <div className="comment_user_three_info">
                                    {five.avatar ? <img src={five.avatar} alt="" className="avatar" /> : <RandomAvatar className="avatar" />}

                                    {five.url ? (
                                      <a href={five.url} className="name active !text-primary" target="_blank" rel="noopener noreferrer">
                                        {five.name}
                                      </a>
                                    ) : (
                                      <span className="name">{five.name}</span>
                                    )}

                                    <span className="time">{dayjs(+five.createTime).format('YYYY-MM-DD HH:mm')}</span>

                                    <div className="reply" onClick={() => replyComment(five.id!, five.name)}>
                                      <RiMessage3Line />
                                    </div>
                                  </div>

                                  <div className="comment_main">
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

      {!data.result?.length ? <Empty info="评论列表为空~"></Empty> : <Pagination showControls total={data.pages} page={page} onChange={onPaginateChange} className="flex justify-center mt-2" classNames={{ item: 'shadow-none bg-transparent dark:hover:!bg-black-b  ', prev: 'dark:bg-black-b  ', next: 'dark:bg-black-b  ' }} />}
    </div>
  );
});

export default CommentList;
