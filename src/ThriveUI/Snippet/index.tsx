'use client';

import { useState, type ReactNode } from 'react';
import { LuCheck, LuCopy } from 'react-icons/lu';
import { toast } from 'react-toastify';

export interface SnippetProps {
  children: ReactNode;
  symbol?: string;
  className?: string;
}

export function Snippet({ children, symbol = '$', className = '' }: SnippetProps) {
  const [copied, setCopied] = useState(false);
  const text = String(children);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('已复制');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('复制失败');
    }
  };

  return (
    <div
      className={`flex items-center gap-2 rounded-xl border border-neutral-200/80 bg-neutral-50 px-3 py-2 font-mono text-sm dark:border-neutral-700/60 dark:bg-neutral-800/40 ${className}`}
    >
      {symbol ? <span className="select-none text-neutral-400">{symbol}</span> : null}
      <code className="min-w-0 flex-1 truncate text-foreground">{children}</code>
      <button
        type="button"
        onClick={() => void copy()}
        aria-label="复制"
        className="shrink-0 cursor-pointer rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-200/80 hover:text-foreground dark:hover:bg-neutral-700"
      >
        {copied ? <LuCheck className="h-4 w-4" /> : <LuCopy className="h-4 w-4" />}
      </button>
    </div>
  );
}

export default Snippet;
