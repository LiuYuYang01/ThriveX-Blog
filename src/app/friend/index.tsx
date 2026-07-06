'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Web } from '@/types/app/web';
import { useConfigStore, useAuthorStore } from '@/stores';
import ApplyForAdd from './components/ApplyForAdd';

const friendCardBase = 'transition-[translate,box-shadow] duration-300 ease-out group-hover:-translate-y-1';
const friendCardPinned = `${friendCardBase} group-hover:border-primary/50 group-hover:shadow-xl group-hover:shadow-primary/10`;
const friendCardNormal = `${friendCardBase} group-hover:border-primary/40 group-hover:shadow-lg group-hover:shadow-black/10 dark:group-hover:bg-[#1e293b] dark:group-hover:shadow-black/30`;
const friendAvatarSquare = 'transition-[scale] duration-300 ease-out group-hover:scale-110';
const friendAvatarRound = 'transition-[rotate] duration-300 ease-out group-hover:rotate-6';
const friendTitle = 'group-hover:text-primary';
const friendDesc = 'group-hover:text-gray-600 dark:group-hover:text-gray-300';

const Icons = {
  Copy: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  Check: () => (
    <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  Link: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  ),
  Rss: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9a6 6 0 016 6m-6-9a9 9 0 019 9M3 3a18 18 0 0118 18M5 21h0" />
    </svg>
  ),
  User: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )
};

// 默认头像
const DEFAULT_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Ccircle fill='%23e5e7eb' cx='32' cy='32' r='32'/%3E%3Cpath fill='%239ca3af' d='M32 32a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm0 8c-8 0-16 4-16 12v4h32v-4c0-8-8-12-16-12z'/%3E%3C/svg%3E";

const CopyInput = ({ label, value, icon, isCode = false, highlight = false, truncate = false }: any) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success(`已复制: ${label}`, { autoClose: 1500 });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group flex items-center gap-3 p-2 pl-3 bg-white dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700/80 hover:border-primary/50">
      <div className={`shrink-0 w-9 h-9 flex items-center justify-center rounded-lg group-hover:text-primary ${highlight ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-700/50 dark:text-gray-400'}`}>
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
        className="shrink-0 p-2 mr-1 rounded-lg text-gray-400 cursor-pointer transition-[scale] duration-300 ease-out hover:bg-gray-100 hover:text-primary active:scale-95 dark:hover:bg-gray-700"
        title="点击复制"
      >
        {copied ? <Icons.Check /> : <Icons.Copy />}
      </button>
    </div>
  );
};

export default ({ data }: { data: { [string: string]: { order: number; list: Web[] } } }) => {
  const web = useConfigStore((state) => state.web);
  const author = useAuthorStore((state) => state.author);

  return (
    <>
      <title>😇 朋友圈</title>
      <meta name="description" content="😇 朋友圈" />

      {/* 全局背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-size-[64px_64px]" />
        <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute top-1/4 right-0 w-96 h-96 rounded-full bg-violet-400/5 blur-[80px]" />
        <div className="absolute bottom-1/4 left-0 w-80 h-80 rounded-full bg-cyan-400/5 blur-[80px]" />
      </div>

      <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a]">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-28 relative z-20 space-y-16">

          <section className="relative group w-full mx-auto">
            {/* 卡片背后的光晕装饰 */}
            <div className="absolute -inset-0.5 bg-linear-to-r from-primary/30 to-purple-600/30 rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />

            {/* 卡片主体 */}
            <div className="relative bg-white/70 dark:bg-[#1e293b]/60 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 rounded-3xl shadow-2xl overflow-hidden ring-1 ring-gray-900/5">
              {/* 角落装饰 */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-bl from-primary/15 to-transparent dark:from-primary/20 rounded-bl-[100px]" />
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-linear-to-tr from-purple-500/15 to-transparent dark:from-purple-500/20 rounded-tr-[80px]" />
              <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary/40 dark:bg-primary/50 animate-pulse" />
              <div className="absolute bottom-6 left-6 w-1.5 h-1.5 rounded-full bg-purple-500/50 dark:bg-purple-400/40" />
              <div className="absolute top-1/3 right-8 w-1 h-1 rounded-full bg-gray-400/60 dark:bg-gray-500/50" />

              <div className="p-6 md:p-8 lg:p-10 relative">
                <div className="grid grid-cols-1 lg:grid-cols-12 pt-8 sm:pt-0 lg:gap-12 items-center">
                  <div className="lg:col-span-5 flex flex-col justify-center items-center text-center relative">
                    {/* 头像区背景装饰圆 */}
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-44 h-44 rounded-full border border-dashed border-primary/20 dark:border-primary/30 z-0" />

                    {/* Logo/头像展示区 */}
                    <div
                      className="relative group/avatar cursor-pointer animate-avatar-in"
                    >
                      {/* 旋转光晕边框 */}
                      <div className="absolute -inset-1 rounded-full opacity-60 blur group-hover/avatar:opacity-100 transition-opacity duration-500 animate-tilt bg-linear-to-r from-primary/40 to-purple-500/40" />
                      <div className="relative w-32 h-32 md:w-36 md:h-36 rounded-full p-1.5 bg-white dark:bg-gray-800 mb-4 transition-[scale] duration-300 group-hover/avatar:scale-105 animate-avatar-float">
                        <img
                          src={author?.avatar || '/favicon.ico'}
                          alt="Site Logo"
                          className="w-full h-full rounded-full object-cover border border-gray-100 dark:border-gray-700 shadow-inner bg-white dark:bg-gray-900 transition-[rotate] duration-300 group-hover/avatar:rotate-6"
                        />
                      </div>
                    </div>

                    {/* 标题与描述 */}
                    <div className="space-y-1 relative mt-8 sm:mt-4">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
                          {web?.title}
                        </h2>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium flex items-center justify-center gap-1.5 mt-2.5">
                        <span className="inline-block w-1 h-1 rounded-full bg-gray-400/70 dark:bg-gray-500/60" />
                        {web?.description}
                        <span className="inline-block w-1 h-1 rounded-full bg-gray-400/70 dark:bg-gray-500/60" />
                      </p>
                    </div>
                  </div>

                  {/* 中间装饰线（仅大屏） */}
                  <div className="hidden lg:block absolute left-[41.666%] top-1/2 -translate-y-1/2 w-px h-3/4 border-l border-dashed border-gray-200 dark:border-gray-600/60" />
                  <div className="hidden lg:block absolute left-[41.666%] top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary/30 dark:bg-primary/40 ring-4 ring-white dark:ring-[#1e293b]" />

                  <div className="lg:col-span-7 w-full relative">
                    <div className="rounded-2xl p-6 relative overflow-hidden">
                      {/* 信息区内部小装饰 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* 1. 站点名称 */}
                        <div className="md:col-span-1">
                          <CopyInput
                            label="Site Title"
                            value={web?.title}
                            icon={<span className="font-serif font-bold text-lg">T</span>}
                          />
                        </div>

                        <div className="md:col-span-1">
                          <CopyInput
                            label="Site Desc"
                            value={web?.description}
                            icon={<span className="font-serif font-bold text-lg">D</span>}
                            truncate
                          />
                        </div>

                        <div className="md:col-span-2">
                          <CopyInput
                            label="URL Address"
                            value={web?.url}
                            icon={<Icons.Link />}
                            isCode
                          />
                        </div>

                        <div className="md:col-span-2">
                          <CopyInput
                            label="Avatar Source"
                            value={author?.avatar}
                            icon={<div className="text-[10px] font-bold">IMG</div>}
                            isCode
                            truncate
                          />
                        </div>

                        <div className="md:col-span-2">
                          <CopyInput
                            label="RSS Feed"
                            value={web?.url ? `${web.url}/api/rss` : ''}
                            icon={<Icons.Rss />}
                            isCode
                            highlight
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </section>

          {Object.keys(data)?.map((type, index) => (
            <section key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex items-center gap-4 mb-8">
                <div className="relative">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 z-10 relative px-2">
                    {type}
                  </h3>
                  <span className="absolute bottom-1 left-0 w-full h-3 bg-primary/20 -skew-x-12 rounded-sm"></span>
                </div>
                <div className="h-px flex-1 bg-linear-to-r from-gray-200 to-transparent dark:from-gray-800"></div>
                {index === 0 && (
                  <div className="shrink-0">
                    <ApplyForAdd />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {type === '全站置顶' && (
                  <Link href="https://liuyuyang.net" target="_blank" className="group block h-full">
                    <div className={`h-full flex items-center p-5 bg-linear-to-br from-primary/5 to-purple-500/5 dark:from-primary/10 dark:to-purple-500/10 border border-primary/20 dark:border-primary/30 rounded-2xl relative overflow-hidden ${friendCardPinned}`}>
                      <div className="absolute top-0 right-0 px-2 py-1 bg-primary text-[10px] font-bold text-white rounded-bl-xl shadow-sm">OWNER</div>
                      <img
                        src="https://q1.qlogo.cn/g?b=qq&nk=3311118881&s=640"
                        alt="项目作者"
                        className={`w-16 h-16 rounded-full border-2 border-white dark:border-gray-700 shadow-md ${friendAvatarRound}`}
                      />
                      <div className="ml-4 flex-1 min-w-0">
                        <h4 className={`text-base font-bold text-gray-900 dark:text-white ${friendTitle}`}>宇阳</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 font-medium">ThriveX 博客管理系统作者</p>
                      </div>
                    </div>
                  </Link>
                )}

                {data[type].list?.map((item: Web) => (
                  <Link key={item.id} href={item.url} target="_blank" className="group block h-full">
                    {type === '全站置顶' ? (
                      <div className={`h-full flex items-center p-5 bg-linear-to-br from-primary/5 to-purple-500/5 dark:from-primary/10 dark:to-purple-500/10 border border-primary/20 dark:border-primary/30 rounded-2xl ${friendCardPinned}`}>
                        <img
                          src={item.image}
                          alt={item.title}
                          className={`w-16 h-16 rounded-full border-2 border-white dark:border-gray-700 shadow-md object-cover bg-gray-100 dark:bg-gray-800 ${friendAvatarRound}`}
                          onError={(e) => {
                            const el = e.target as HTMLImageElement;
                            if (el.src !== DEFAULT_AVATAR) el.src = DEFAULT_AVATAR;
                          }}
                        />
                        <div className="ml-4 flex-1 min-w-0">
                          <h4 className={`text-base font-bold text-gray-900 dark:text-white truncate ${friendTitle}`}>
                            {item.title}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 font-medium">
                            {item.description || '暂无介绍...'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className={`h-full flex items-start p-4 bg-white dark:bg-[#1e293b]/80 backdrop-blur-sm border border-gray-100 dark:border-gray-700/60 rounded-2xl ${friendCardNormal}`}>
                        <div className="relative shrink-0">
                          <img
                            src={item.image}
                            alt={item.title}
                            className={`w-12 h-12 rounded-xl object-cover bg-gray-100 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 ${friendAvatarSquare}`}
                            onError={(e) => {
                              const el = e.target as HTMLImageElement;
                              if (el.src !== DEFAULT_AVATAR) el.src = DEFAULT_AVATAR;
                            }}
                          />
                        </div>
                        <div className="ml-4 flex-1 min-w-0">
                          <h4 className={`text-sm font-bold text-gray-800 dark:text-gray-100 truncate ${friendTitle}`}>
                            {item.title}
                          </h4>
                          <p className={`text-xs text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed line-clamp-1 ${friendDesc}`}>
                            {item.description || '暂无介绍...'}
                          </p>
                        </div>
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </main>

        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    </>
  );
};
