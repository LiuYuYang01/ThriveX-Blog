'use client';

import { useState, type ReactNode } from 'react';
import { toast } from 'react-toastify';

interface CopyInputProps {
  label: string;
  value?: string;
  icon: ReactNode;
  isCode?: boolean;
  highlight?: boolean;
  truncate?: boolean;
}

export default function CopyInput({ label, value, icon, isCode = false, highlight = false, truncate = false }: CopyInputProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success(`已复制: ${label}`, { autoClose: 1500 });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group flex items-center gap-3 p-3 bg-white/50 dark:bg-gray-800/30 rounded-xl border border-gray-200/50 dark:border-gray-700/30 hover:border-primary/50 dark:hover:border-primary/30 hover:bg-white/80 dark:hover:bg-gray-800/50">
      <div className={`shrink-0 w-10 h-10 flex items-center justify-center rounded-lg group-hover:text-primary ${highlight ? 'bg-primary/10 text-primary dark:bg-primary/30 dark:text-primary' : 'bg-gray-100 text-gray-500 dark:bg-gray-700/50 dark:text-gray-400'}`}>
        {icon}
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-0.5">
          {label}
        </span>
        <div className={`text-sm ${isCode ? 'font-mono text-xs tracking-tight' : 'font-medium'} text-gray-800 dark:text-gray-200 ${truncate ? 'truncate' : ''}`}>
          {value || 'Wait for loading...'}
        </div>
      </div>

      <button
        onClick={handleCopy}
        className="shrink-0 p-2 mr-1 rounded-lg text-gray-400 cursor-pointer hover:bg-primary/10 hover:text-primary active:scale-95 dark:hover:bg-primary/30"
        title="点击复制"
      >
        {copied ? (
          <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )}
      </button>
    </div>
  );
}
