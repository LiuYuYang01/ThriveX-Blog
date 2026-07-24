import type { Metadata } from 'next';
import { readFileSync } from 'node:fs';
import path from 'node:path';

import MD from '@/app/article/components/MD';
import Summary from '@/app/article/components/Summary';
import ArticleTOC from '@/app/article/components/ArticleTOC';
import { extractArticleHeadings } from '@/utils/article';

export const metadata: Metadata = {
  title: '文章小组件演示',
  description: '预览 ThriveX 文章自定义小组件效果，便于决定保留哪些组件',
  robots: {
    index: false,
    follow: false,
  },
};

function loadDemoMarkdown() {
  const filePath = path.join(process.cwd(), 'src/app/demo/widgets/content.md');
  return readFileSync(filePath, 'utf-8');
}

export default function WidgetsDemoPage() {
  const content = loadDemoMarkdown();
  const headings = extractArticleHeadings(content);

  return (
    <main className="min-h-screen bg-[#f7f8fa] pb-20 pt-24 dark:bg-black-a">
      <div className="mx-auto w-[92%] max-w-4xl">
        <header className="mb-8 rounded-2xl border border-[#e8eef6] bg-white px-6 py-7 shadow-[0_10px_30px_rgba(83,157,253,0.08)] dark:border-[#3d4654] dark:bg-[#1b2230]">
          <p className="mb-2 text-sm tracking-wide text-primary">DEMO</p>
          <h1 className="text-2xl font-semibold text-[#1f2937] dark:text-slate-100 sm:text-3xl">
            文章小组件演示
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#667085] dark:text-slate-400 sm:text-base">
            这页不依赖数据库，直接渲染模拟 Markdown。看完效果后告诉我要保留哪些组件即可。
          </p>
        </header>

        <div className="rounded-2xl border border-[#e8eef6] bg-white px-4 py-6 dark:border-[#3d4654] dark:bg-[#161b26] sm:px-8">
          <ArticleTOC headings={headings}>
            <Summary content="当前保留：媒体嵌入、Tabs / 时间线 / 步骤、画廊、CTA。统一用 tx-widget 语法插入。" />
            <MD data={content} headings={headings} />
          </ArticleTOC>
        </div>
      </div>
    </main>
  );
}
