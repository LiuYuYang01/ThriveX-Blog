import { Feed } from 'feed';
import { NextResponse } from 'next/server';

import { getArticlePagingCacheAPI } from '@/lib/article';
import { getAuthorDataCacheAPI, getWebConfigCacheAPI } from '@/lib/config';
import { getRecordListCacheAPI } from '@/lib/record';

export async function GET() {
  const web = await getWebConfigCacheAPI();
  const user = await getAuthorDataCacheAPI();
  const { data: article } = await getArticlePagingCacheAPI({ pageNum: 1, pageSize: 8 });
  const { data: record } = await getRecordListCacheAPI({ pageNum: 1, pageSize: 8 });

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
