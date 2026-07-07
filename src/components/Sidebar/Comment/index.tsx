'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getCommentListAPI } from '@/api/comment';
import NewCommentSvg from '@/assets/svg/other/comments.svg';
import RandomAvatar from '@/components/RandomAvatar';
import SidebarCard from '@/components/Sidebar/SidebarCard';
import { Comment } from '@/types/app/comment';
import dayjs from 'dayjs';
import { RiTimeLine } from 'react-icons/ri';

const NewComments = () => {
  const [list, setList] = useState<Comment[]>([]);

  const getCommentList = async () => {
    const { data } = await getCommentListAPI({ pageNum: 1, pageSize: 5 });
    setList(data?.result ?? []);
  };

  useEffect(() => {
    getCommentList();
  }, []);

  return (
    <SidebarCard title={<><Image src={NewCommentSvg} alt="最新评论" width={33} height={23} /> 最新评论</>} contentClassName="flex flex-col gap-1 mt-3 w-full">
      {list.map((item) => (
        <Link href={`/article/${item.articleId}`} target="_blank" key={item.id} className="group flex gap-3.5 p-2 -mx-2 rounded-xl transition-none hover:bg-slate-50 dark:hover:bg-[#323e50] cursor-pointer">
          <div className="relative shrink-0 w-11 h-11 mt-0.5">{item.avatar ? <img src={item.avatar} className="w-full h-full object-cover rounded-full transition-[scale] duration-300 group-hover:scale-110 ring-2 ring-transparent group-hover:ring-blue-100 dark:group-hover:ring-blue-900/30" alt="avatar" /> : <RandomAvatar className="w-full h-full rounded-full transition-[scale] duration-300 group-hover:scale-110 ring-2 ring-transparent group-hover:ring-blue-100 dark:group-hover:ring-blue-900/30" />}</div>

          <div className="flex flex-col flex-1 min-w-0 justify-center">
            <p className="text-[14px] text-slate-600 dark:text-[#8c9ab1] group-hover:text-primary line-clamp-2 leading-relaxed wrap-break-word transition-none">{item.content}</p>

            <div className="flex items-center gap-1 mt-1.5 text-[12px] text-slate-400 dark:text-[#8c9ab1]/70 font-medium transition-none">
              <RiTimeLine className="text-[14px]" />
              <time dateTime={dayjs(+item.createTime!).toISOString()}>
                {dayjs(+item.createTime!).format('YYYY-MM-DD HH:mm')}
              </time>
            </div>
          </div>
        </Link>
      ))}
    </SidebarCard>
  );
};

export default NewComments;
