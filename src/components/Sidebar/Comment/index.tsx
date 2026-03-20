'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getCommentPagingAPI } from '@/api/comment';
import NewCommentSvg from '@/assets/svg/other/comments.svg';
import RandomAvatar from '@/components/RandomAvatar';
import { Comment } from '@/types/app/comment';
import dayjs from 'dayjs';
import { RiTimeLine } from 'react-icons/ri';

const NewComments = () => {
  const [list, setList] = useState<Comment[]>([]);

  const getCommentPaging = async () => {
    const { data } = await getCommentPagingAPI();
    setList(data?.result ?? []);
  };

  useEffect(() => {
    getCommentPaging();
  }, []);

  return (
    <div className="flex flex-col tw_container bg-white dark:bg-black-b p-4 mb-3 tw_title">
      <div className="tw_title w-full dark:text-white">
        <Image src={NewCommentSvg} alt="最新评论" width={33} height={23} /> 最新评论
      </div>

      <div className="flex flex-col gap-1 mt-3 w-full">
        {list.map((item) => (
          <Link href={`/article/${item.articleId}`} target="_blank" key={item.id} className="group flex gap-3.5 p-2 -mx-2 rounded-xl hover:bg-slate-50 dark:hover:bg-transparent cursor-pointer">
            <div className="relative flex-shrink-0 w-11 h-11 mt-0.5">{item.avatar ? <img src={item.avatar} className="w-full h-full object-cover rounded-full transition-transform duration-300 group-hover:scale-110 ring-2 ring-transparent group-hover:ring-blue-100 dark:group-hover:ring-blue-900/30" alt="avatar" /> : <RandomAvatar className="w-full h-full rounded-full transition-transform duration-300 group-hover:scale-110 ring-2 ring-transparent group-hover:ring-blue-100 dark:group-hover:ring-blue-900/30" />}</div>

            <div className="flex flex-col flex-1 min-w-0 justify-center">
              <p className="text-[14px] text-slate-600 dark:text-[#8c9ab1] group-hover:text-primary line-clamp-2 leading-relaxed break-words">{item.content}</p>

              <div className="flex items-center gap-1 mt-1.5 text-[12px] text-slate-400 dark:text-zinc-500 font-medium">
                <RiTimeLine className="text-[14px]" />
                <time className="dark:text-gray-500" dateTime={dayjs(+item.createTime!).toISOString()}>
                  {dayjs(+item.createTime!).format('YYYY-MM-DD HH:mm')}
                </time>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NewComments;
