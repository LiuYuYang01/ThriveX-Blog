'use client';

import { useState } from 'react';
import {
  LuBookOpen,
  LuCheck,
  LuCode,
  LuCopy,
  LuFileText,
  LuLayers,
  LuPackage,
} from 'react-icons/lu';
import { thriveDocs } from '../data';
import type { ThriveDoc } from '../types';

const TOKEN_RE =
  /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|<\/?[A-Z][A-Za-z0-9.]*|[A-Za-z_$][\w$]*(?==)|\b(?:const|let|var|type|interface|import|from|return|useState|useForm|true|false|null|undefined)\b|\b\d+\b|[{}()[\].,;:=<>/])/g;

function getTokenClass(token: string) {
  if (/^["'`]/.test(token)) return 'text-amber-200';
  if (/^<\/?[A-Z]/.test(token)) return 'text-sky-300';
  if (/^[A-Za-z_$][\w$]*(?==)/.test(token)) return 'text-emerald-300';
  if (/^(const|let|var|type|interface|import|from|return)$/.test(token)) return 'text-fuchsia-300';
  if (/^(useState|useForm)$/.test(token)) return 'text-cyan-300';
  if (/^(true|false|null|undefined)$/.test(token)) return 'text-orange-300';
  if (/^\d+$/.test(token)) return 'text-violet-300';
  if (/^[{}()[\].,;:=<>/]$/.test(token)) return 'text-neutral-500';
  return '';
}

function HighlightedCode({ code }: { code: string }) {
  const parts = code.split(TOKEN_RE);

  return (
    <>
      {parts.map((part, index) => {
        if (!part) return null;
        const className = getTokenClass(part);
        return className ? (
          <span key={`${part}-${index}`} className={className}>
            {part}
          </span>
        ) : (
          <span key={`${part}-${index}`}>{part}</span>
        );
      })}
    </>
  );
}

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200/70 bg-neutral-950 text-neutral-100 dark:border-neutral-700/70">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
        <span className="inline-flex items-center gap-2 text-xs text-neutral-400">
          <LuCode className="h-3.5 w-3.5" />
          TSX
        </span>
        <button
          type="button"
          onClick={copyCode}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-1 text-xs text-neutral-300 transition-colors hover:bg-white/10 hover:text-white"
        >
          {copied ? <LuCheck className="h-3.5 w-3.5" /> : <LuCopy className="h-3.5 w-3.5" />}
          {copied ? '已复制' : '复制'}
        </button>
      </div>
      <pre className="max-h-[420px] overflow-auto p-4 font-mono text-xs leading-6 scrollbar-thin">
        <code>
          <HighlightedCode code={code} />
        </code>
      </pre>
    </div>
  );
}

function PropsTable({ doc }: { doc: ThriveDoc }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200/70 bg-surface dark:border-neutral-700/60">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-neutral-100/80 text-xs uppercase tracking-wide text-neutral-500 dark:bg-neutral-800/70 dark:text-neutral-400">
            <tr>
              <th className="px-4 py-3 font-medium">属性</th>
              <th className="px-4 py-3 font-medium">类型</th>
              <th className="px-4 py-3 font-medium">默认值</th>
              <th className="px-4 py-3 font-medium">说明</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200/70 dark:divide-neutral-700/60">
            {doc.props.map((prop) => (
              <tr key={prop.name}>
                <td className="px-4 py-3 align-top">
                  <code className="rounded-md bg-neutral-100 px-1.5 py-0.5 text-xs text-foreground dark:bg-neutral-800">
                    {prop.name}
                  </code>
                  {prop.required ? (
                    <span className="ml-2 rounded-full bg-red-50 px-2 py-0.5 text-[11px] text-red-500 dark:bg-red-500/10">
                      必填
                    </span>
                  ) : null}
                </td>
                <td className="px-4 py-3 align-top">
                  <code className="text-xs text-primary">{prop.type}</code>
                </td>
                <td className="px-4 py-3 align-top text-neutral-500">
                  {prop.defaultValue ? (
                    <code className="rounded-md bg-neutral-100 px-1.5 py-0.5 text-xs dark:bg-neutral-800">
                      {prop.defaultValue}
                    </code>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="px-4 py-3 align-top leading-6 text-neutral-600 dark:text-neutral-300">
                  {prop.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ComponentSection({ doc }: { doc: ThriveDoc }) {
  return (
    <section id={doc.id} className="scroll-mt-28 pb-12">
      <div className="mb-6 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {doc.category}
          </span>
          <span className="text-xs text-neutral-400">{doc.source}</span>
        </div>
        <h2 className="text-2xl font-semibold tracking-normal text-foreground">{doc.title}</h2>
        <p className="max-w-3xl text-sm leading-7 text-neutral-500 dark:text-neutral-400">
          {doc.description}
        </p>
      </div>

      <div className="grid gap-6">
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
            <LuPackage className="h-4 w-4 text-primary" />
            导入方式
          </h3>
          <CodeBlock code={doc.importCode} />
        </div>

        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
            <LuLayers className="h-4 w-4 text-primary" />
            使用场景
          </h3>
          <ul className="grid gap-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
            {doc.usage.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {doc.examples.map((example) => (
          <div key={example.title} className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)]">
            <div>
              <h3 className="mb-2 text-sm font-semibold text-foreground">{example.title}</h3>
              <p className="mb-3 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                {example.description}
              </p>
              {example.preview}
            </div>
            <div className="lg:pt-8">
              <CodeBlock code={example.code} />
            </div>
          </div>
        ))}

        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
            <LuFileText className="h-4 w-4 text-primary" />
            属性说明
          </h3>
          <PropsTable doc={doc} />
        </div>

        {doc.notes?.length ? (
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
            <h3 className="mb-2 text-sm font-semibold text-foreground">注意事项</h3>
            <ul className="grid gap-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
              {doc.notes.map((note) => (
                <li key={note} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default function ThriveDocsPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-neutral-200/70 bg-surface/80 px-5 pb-14 pt-24 backdrop-blur dark:border-neutral-800 dark:bg-surface/60 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-semibold tracking-normal text-foreground sm:text-5xl">
              ThriveUI 组件文档
            </h1>
            <p className="mt-4 text-base leading-8 text-neutral-500 dark:text-neutral-400">
              面向多项目复用的 ThriveUI 使用手册。文档内容和示例跟随组件库维护，
              当前项目只负责挂载路由，方便后续迁移到其他项目或独立组件库。
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:px-10">
        <aside className="lg:sticky lg:top-24 lg:h-[calc(100dvh-7rem)]">
          <nav className="rounded-2xl border border-neutral-200/70 bg-surface p-3 dark:border-neutral-700/60">
            <a
              href="#overview"
              className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm text-neutral-600 transition-colors hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              <LuBookOpen className="h-4 w-4" />
              总览
            </a>
            {thriveDocs.map((doc) => (
              <a
                key={doc.id}
                href={`#${doc.id}`}
                className="flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm text-neutral-600 transition-colors hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                <span>{doc.title}</span>
                <span className="text-[11px] text-neutral-400">{doc.category}</span>
              </a>
            ))}
          </nav>
        </aside>

        <div className="min-w-0">
          {thriveDocs.map((doc) => (
            <ComponentSection key={doc.id} doc={doc} />
          ))}
        </div>
      </div>
    </main>
  );
}
