import { Feed } from 'feed';
import { NextResponse } from 'next/server';

import { Web } from '@/types/app/config';

import { getArticlePagingAPI } from '@/api/article';
import { getWebConfigDataAPI } from '@/api/config';
import { getAuthorDataAPI } from '@/api/user';
import { getRecordListAPI } from '@/api/record';

export async function GET() {
  const webResponse = await getWebConfigDataAPI<{ value: Web }>('web');
  const web = webResponse?.data?.value as Web;
  const { data: user } = await getAuthorDataAPI();
  const { data: article } = await getArticlePagingAPI({ pageNum: 1, pageSize: 8 });
  const { data: record } = await getRecordListAPI({ pageNum: 1, pageSize: 8 });

  const articleList = article?.result ?? [];
  const recordList = record?.result ?? [];

  // 合并文章和说说，并根据时间排序
  const list = [...articleList, ...recordList].sort((a, b) => {
    return +b.createTime! - +a.createTime!;
  });

  const feed = new Feed({
    title: `${web?.title} - ${web?.subhead}`,
    description: web?.description,
    id: web?.url,
    link: web?.url,
    language: 'zh-CN',
    copyright: 'ThriveX 现代化博客管理系统',
    updated: new Date(),
    generator: '为爱发电',
    docs: 'https://github.com/LiuYuYang01/ThriveX-Blog',
    author: {
      name: user?.name,
      email: user?.email,
      link: web?.url,
    },
    image: user?.avatar,
    feed: web?.url + '/api/rss',
  });

  list.forEach((item) => {
    feed.addItem({
      id: item.id + '',
      title: 'title' in item ? item?.title : truncateContent(item?.content),
      link: 'title' in item ? web?.url + '/article/' + item?.id : web?.url + '/record',
      description: 'title' in item ? item?.description : item?.content,
      content: item?.content,
      author: user?.name
        ? [
          {
            name: user.name,
            email: user.email,
            link: web?.url,
          },
        ]
        : [],
      copyright: 'ThriveX 现代化博客管理系统',
      date: new Date(+item?.createTime),
    });
  });

  const xml = feed.rss2();

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}

// 截取说说内容
function truncateContent(content: string) {
  const maxLength = 20;

  if (content.length > maxLength) {
    return content.substring(0, maxLength) + '...';
  } else {
    return content;
  }
}
