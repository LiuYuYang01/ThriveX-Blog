import { getArticleDataAPI, recordViewAPI } from '@/api/article';
import { getWebConfigCacheAPI } from '@/lib/config';
import { getArticleCacheAPI } from '@/lib/article';
import { getThemeConfigCacheAPI } from '@/lib/theme';
import { getStableImage } from '@/utils';
import { Metadata } from 'next';
import { after } from 'next/server';

import Starry from '@/components/Starry';
import Slide from '@/components/Slide';

import Tag from '../components/Tag';
import Copyright from '../components/Copyright';
import UpAndDown from '../components/UpAndDown';
import RandomArticle from '../components/RandomArticle';
import Comment from '../components/Comment';
import { ArticleLikeProvider, ArticleLikeHero } from '../components/Like';
import { ArticleShareProvider } from '../components/Share';
import { ArticleActionBar } from '../components/ActionBar';
import MD from '../components/MD';
import Summary from '../components/Summary';
import ArticleTOC from '../components/ArticleTOC';
import { extractArticleHeadings } from '@/utils/article';

import { FaHotjar } from 'react-icons/fa';
import { AiOutlineComment } from 'react-icons/ai';
import { LuTimer } from 'react-icons/lu';

import dayjs from 'dayjs';
import Encrypt from '@/components/Encrypt';
import NotFound from '@/app/not-found';

interface Props {
  params: Promise<{ id: number }>;
  searchParams: Promise<{ password: string }>;
}

// 生成文章页面的 metadata
export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const id = params.id;

  const { data: article } = await getArticleCacheAPI(id);
  const webConfig = await getWebConfigCacheAPI();

  const baseUrl = webConfig?.url ?? 'https://liuyuyang.net';

  if (!article?.title) {
    return {
      title: '文章未找到',
    };
  }

  return {
    title: article.title,
    description: article.description ?? article.title,
    keywords: article.tagList?.map((tag) => tag.name).join(',') ?? '',
    authors: [{ name: webConfig?.title ?? 'ThriveX' }],
    openGraph: {
      type: 'article',
      locale: 'zh_CN',
      url: `${baseUrl}/article/${id}`,
      title: article.title,
      description: article.description ?? article.title,
      siteName: webConfig?.title ?? 'ThriveX',
      images: [
        {
          url: article.cover ?? webConfig?.favicon ?? '/favicon.ico',
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      publishedTime: new Date(+article.createTime).toISOString(),
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description ?? article.title,
      images: [article.cover ?? webConfig?.favicon ?? '/favicon.ico'],
    },
    alternates: {
      canonical: `/article/${id}`,
    },
  };
}

export default async (props: Props) => {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const id = params.id;
  const password = searchParams.password;

  const [{ code, data }, theme] = await Promise.all([
    password ? getArticleDataAPI(id, password) : getArticleCacheAPI(id),
    getThemeConfigCacheAPI(),
  ]);
  const heroSrc = getStableImage(data?.cover, theme?.covers, String(id));

  const errorCodes = [400, 404, 611];

  if (errorCodes.includes(code ?? 200)) {
    return <NotFound />;
  }

  // 记录文章访问量
  after(() => {
    void recordViewAPI(id);
  });

  const headings = extractArticleHeadings(data?.content);

  // 图标样式
  const iconSty = 'flex justify-center items-center w-5 h-5 rounded-full text-xs mr-1';

  // 如果文章没有加密或者密码正确，则显示文章
  if ((data?.config?.isEncrypt !== 1) || (password && data?.config?.isEncrypt === 1)) {
    return (
      <ArticleLikeProvider articleId={id} initialCount={data?.likeCount ?? 0}>
        <ArticleShareProvider articleId={id} initialCount={data?.shareCount ?? 0}>
        <div className="ArticlePage">
          <div id="article-hero">
            <Slide src={heroSrc}>
            {/* 星空背景组件 */}
            <Starry />

            <div className="absolute w-[80%] sm:w-[70%] lg:w-[60%] xl:w-[50%] top-[60%] md:top-1/2 left-1/2 -translate-x-1/2 translate-y-[-65%] text-white custom_text_shadow">
              <div className="text-xl mb-3 sm:text-2xl lg:text-3xl xl:text-4xl text-center sm:mb-4 md:mb-5">{data?.title}</div>

              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs sm:gap-x-10 sm:text-sm">
                <div className="flex items-center">
                  <span>{data?.cateList[0]?.name}</span>
                </div>

                <div className="flex items-center">
                  <span className={`${iconSty} bg-[#EA3B24]`}>
                    <FaHotjar />
                  </span>
                  <span>{data?.view}</span>
                </div>

                <div className="flex items-center">
                  <span className={`${iconSty} bg-[#4FA759]`}>
                    <AiOutlineComment />
                  </span>
                  <span>{data?.comment}</span>
                </div>

                <ArticleLikeHero className="mb-0" />

                <div className="flex items-center">
                  <span className={`${iconSty} bg-[#5A9CF8]`}>
                    <LuTimer />
                  </span>
                  <span>{dayjs(+data?.createTime).format('YYYY-MM-DD HH:mm')}</span>
                </div>
              </div>
            </div>
            </Slide>
          </div>

          <div className="w-[90%] xl:w-6/12 mx-auto mt-12 relative">
            <ArticleTOC headings={headings}>
              <Summary content={data?.description || ''} />
              <MD data={data?.content} headings={headings} />

            <ArticleActionBar
              commentCount={data?.comment ?? 0}
              share={{
                articleId: id,
                title: data.title,
                description: data.description || '',
                cover: data.cover || heroSrc,
                createTime: data.createTime,
                view: data.view,
              }}
            />

            <div className="w-full">
              <Tag data={data?.tagList} />

              <Copyright />
              <RandomArticle />
              <UpAndDown currentId={id} prev={data?.prev} next={data?.next} />
              <Comment articleId={id} articleTitle={data.title} />
            </div>
            </ArticleTOC>
          </div>
        </div>
        </ArticleShareProvider>
      </ArticleLikeProvider>
    );
  } else {
    return !password && <Encrypt id={id} />;
  }
};
