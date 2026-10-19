/*
 * 知识库阅读台 — 方向约定
 *
 * THESIS: 一本摊开在桌上的参考手册，而不是一个文档后台。结构由发丝线、页边距和字体节奏撑起来，不用卡片堆和胶囊高亮。
 * OWN-WORLD: 全站 LXGW 文楷；#539dfd 只用在书签条、当前项和焦点上，是唯一强调色。亮色底 #f9f9f9 / 面板 #fff，暗色底 #232931 / 面板 #2c333e。所有控件保持扁平，12px 圆角，1px #eee 描边。
 * STORY: 读者一进来就看清自己在哪一节、还剩哪些页；正文按 65–75ch 的舒适行长读下去；读完有明确的翻页出口，全程不需要找路。
 * FIRST VIEWPORT: 三栏阅读台。左栏是纯文字目录（页边有一枚滑动的书签条标记当前项），中栏是约 72ch 的正文，标题下是一行描述和一条含阅读时长与更新日期的元信息，右栏是跟随滚动高亮的页内小节索引。没有 hero，没有引导语。
 * FORM: 沿用博客既有视觉体系做局部扩展（surface scope）。标志性交互是左侧书签条在目录项之间滑动位移，以及正文顶部 2px 的阅读进度细线。
 * FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LuArrowLeft, LuArrowRight, LuChevronDown } from 'react-icons/lu';

import MD from '@/app/article/components/MD';
import DocsNav from '@/app/docs/components/DocsNav';
import DocsProgress from '@/app/docs/components/DocsProgress';
import DocsToc from '@/app/docs/components/DocsToc';
import { getDoc, getDocSlugs, getDocTree, getFlatDocs } from '@/lib/docs';
import { extractArticleHeadings, getArticleReadingMinutes, getArticleWordCount } from '@/utils/article';

interface Props {
  params: Promise<{ slug?: string[] }>;
}

export function generateStaticParams() {
  return getDocSlugs().map((slug) => ({ slug: slug.split('/') }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug = [] } = await params;
  const doc = getDoc(slug);
  if (!doc) return { title: '文档未找到' };

  return {
    title: doc.title,
    description: doc.description,
    alternates: { canonical: doc.href },
  };
}

export default async function DocsPage({ params }: Props) {
  const { slug = [] } = await params;
  const doc = getDoc(slug);
  if (!doc) notFound();

  const nodes = getDocTree();
  const flat = getFlatDocs();
  const index = flat.findIndex((node) => node.href === doc.href);
  const prev = index > 0 ? flat[index - 1] : null;
  const next = index < flat.length - 1 ? flat[index + 1] : null;

  const headings = extractArticleHeadings(doc.content);
  const minutes = getArticleReadingMinutes(getArticleWordCount(doc.content));

  const pager = (
    <nav className="mt-16 grid gap-4 border-t border-border pt-8 sm:grid-cols-2">
      {prev ? (
        <Link
          href={prev.href}
          className="group cursor-pointer rounded-xl px-4 py-3 hover:bg-surface"
          aria-label={`上一页：${prev.title}`}
        >
          <span className="mb-1 flex items-center gap-1.5 text-xs text-foreground/70">
            <LuArrowLeft className="h-3.5 w-3.5" />
            上一页
          </span>
          <span className="block text-sm font-medium text-foreground">{prev.title}</span>
        </Link>
      ) : (
        <span />
      )}

      {next && (
        <Link
          href={next.href}
          className="group cursor-pointer rounded-xl px-4 py-3 text-right hover:bg-surface sm:col-start-2"
          aria-label={`下一页：${next.title}`}
        >
          <span className="mb-1 flex items-center justify-end gap-1.5 text-xs text-foreground/70">
            下一页
            <LuArrowRight className="h-3.5 w-3.5" />
          </span>
          <span className="block text-sm font-medium text-foreground">{next.title}</span>
        </Link>
      )}
    </nav>
  );

  return (
    <div className="mx-auto w-full max-w-[1200px] px-5 pt-[76px] sm:px-8 lg:px-10 lg:pt-[92px]">
      <details className="group mb-10 rounded-xl border border-border bg-surface px-4 py-3 lg:hidden [&::-webkit-details-marker]:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-foreground">
          文档目录
          <LuChevronDown className="h-4 w-4 text-foreground/50 transition-transform duration-300 group-open:rotate-180" />
        </summary>
        <div className="mt-4 border-t border-border pt-4">
          <DocsNav nodes={nodes} />
        </div>
      </details>

      <div className="grid gap-10 pb-24 lg:grid-cols-[14rem_minmax(0,1fr)_11rem] xl:gap-14">
        <aside className="hidden lg:block">
          <div className="sticky top-27 max-h-[calc(100dvh-140px)] overflow-y-auto pb-8">
            <DocsNav nodes={nodes} />
          </div>
        </aside>

        <main data-doc-column className="min-w-0">
          <header className="mb-10 mt-6">
            <h1 className="text-[1.75rem] font-semibold tracking-tight text-foreground sm:text-[2rem]">{doc.title}</h1>

            {doc.description && <p className="mt-3 text-base leading-7 text-foreground/70">{doc.description}</p>}

            <p className="mt-4 text-xs text-foreground/65">
              阅读约 {minutes} 分钟
              {doc.updated && <span> · 更新于 {doc.updated}</span>}
            </p>
          </header>

          <article>
            <MD data={doc.content} headings={headings} />
          </article>

          {pager}
        </main>

        <aside className="hidden lg:block">
          <div className="sticky top-[108px] max-h-[calc(100dvh-140px)] overflow-y-auto pb-8">
            <DocsToc headings={headings} />
          </div>
        </aside>
      </div>
    </div>
  );
}
