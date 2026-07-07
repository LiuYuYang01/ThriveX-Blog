'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Web } from '@/types/app/web';
import { useConfigStore, useAuthorStore } from '@/stores';
import ApplyForAdd from './components/ApplyForAdd';

// 默认头像
const DEFAULT_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Ccircle fill='%23e5e7eb' cx='32' cy='32' r='32'/%3E%3Cpath fill='%239ca3af' d='M32 32a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm0 8c-8 0-16 4-16 12v4h32v-4c0-8-8-12-16-12z'/%3E%3C/svg%3E";

// 3D透视卡片组件（useRef + 直接操作DOM，避免mousemove时React重渲染）
const TiltCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * -8;
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 8;
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  }, []);

  return (
    <div
      ref={cardRef}
      className={`transition-transform duration-200 ease-out ${className}`}
      style={{ transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};

// 磁性卡片组件（useRef + 直接操作DOM，避免mousemove时React重渲染）
const MagneticCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    const distance = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
    const maxDistance = Math.max(rect.width, rect.height);
    if (distance < maxDistance) {
      const strength = (1 - distance / maxDistance) * 15;
      cardRef.current.style.transform = `translate(${(mouseX / rect.width) * strength}px, ${(mouseY / rect.height) * strength}px)`;
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'translate(0px, 0px)';
  }, []);

  return (
    <div
      ref={cardRef}
      className={`transition-transform duration-300 ease-out ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};

// 滚动动画包装器（useRef + 直接操作DOM，避免滚动时React重渲染）
const ScrollReveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.classList.remove('opacity-0', 'translate-y-8', 'scale-95');
          }, delay);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className="transition-[opacity,translate,scale] duration-700 ease-out opacity-0 translate-y-8 scale-95"
    >
      {children}
    </div>
  );
};

// 复制输入框组件
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
};

// 友链卡片组件
const FriendCard = ({ item, type, index }: { item: Web; type: string; index: number }) => {
  const isPinned = type === '全站置顶';

  return (
    <ScrollReveal delay={index * 80}>
      <Link href={item.url} target="_blank" className="group block h-full">
        <MagneticCard className="h-full">
          <div
            className={`h-full relative overflow-hidden rounded-2xl border group-hover:shadow-xl group-hover:shadow-primary/10 ${
              isPinned
                ? 'bg-primary/5 dark:bg-primary/10 border-primary/20 dark:border-primary/30'
                : 'bg-white/80 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/30'
            }`}
          >
            {/* 悬停光效 */}
            <div className="absolute inset-0 bg-linear-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {/* 置顶标识 */}
            {isPinned && (
              <div className="absolute top-3 right-3 px-2.5 py-1 bg-primary text-[10px] font-bold text-white rounded-full shadow-lg shadow-primary/30">
                PINNED
              </div>
            )}

            <div className={`relative p-5 flex items-center ${isPinned ? 'gap-4' : 'gap-4'}`}>
              {/* 头像 */}
              <div className="relative shrink-0">
                <div className={`absolute inset-0 rounded-full bg-primary opacity-0 group-hover:opacity-30 blur-md`} />
                <img
                  src={item.image}
                  alt={item.title}
                  className={`relative w-14 h-14 rounded-full object-cover bg-gray-100 dark:bg-gray-800 border-2 border-white dark:border-gray-700 shadow-md transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}
                  onError={(e) => {
                    const el = e.target as HTMLImageElement;
                    if (el.src !== DEFAULT_AVATAR) el.src = DEFAULT_AVATAR;
                  }}
                />
              </div>

              {/* 内容 */}
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary truncate">
                  {item.title}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                  {item.description || '暂无介绍...'}
                </p>
              </div>

              {/* 箭头指示 */}
              <div className="shrink-0 opacity-0 transition-[opacity,translate] duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </div>
        </MagneticCard>
      </Link>
    </ScrollReveal>
  );
};

export default ({ data }: { data: { [string: string]: { order: number; list: Web[] } } }) => {
  const web = useConfigStore((state) => state.web);
  const author = useAuthorStore((state) => state.author);

  return (
    <>
      <title>😇 朋友圈</title>
      <meta name="description" content="😇 朋友圈" />

      {/* 全局背景装饰（静态，无动画） */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <div className="min-h-screen relative z-10">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-28 space-y-16">
          
          {/* Hero区域 - 个人空间站 */}
          <section className="relative">
            <ScrollReveal>
              <TiltCard className="w-full">
                <div className="relative bg-white/70 dark:bg-gray-800/40 border border-white/50 dark:border-gray-700/30 rounded-3xl shadow-2xl overflow-hidden">
                  {/* 动态边框光效 */}
                  <div className="absolute inset-0 rounded-3xl bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  
                  {/* 角落装饰 */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-[120px]" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/10 rounded-tr-[80px]" />
                  
                  {/* 动态小圆点装饰 */}
                  <div className="absolute top-6 right-6 w-2 h-2 rounded-full bg-primary/50" />
                  <div className="absolute bottom-8 left-8 w-1.5 h-1.5 rounded-full bg-primary/50" />
                  <div className="absolute top-1/3 right-12 w-1 h-1 rounded-full bg-primary/50" />

                  <div className="p-8 md:p-10 lg:p-12 relative">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                      {/* 头像区 */}
                      <div className="lg:col-span-5 flex flex-col justify-center items-center text-center relative">
                        {/* 能量光环 */}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full border-2 border-dashed border-primary/30 dark:border-primary/20" />
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full border border-dashed border-primary/20 dark:border-primary/15" />

                        {/* 头像 */}
                        <div className="relative group/avatar cursor-pointer">
                          <div className="absolute -inset-2 rounded-full bg-primary opacity-30 blur-lg group-hover/avatar:opacity-50" />
                          <div className="relative w-36 h-36 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-gray-800 shadow-2xl overflow-hidden bg-white dark:bg-gray-900">
                            <img
                              src={author?.avatar || '/favicon.ico'}
                              alt="Site Logo"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover/avatar:scale-105 group-hover/avatar:rotate-6"
                            />
                          </div>
                        </div>

                        {/* 标题与描述 */}
                        <div className="space-y-2 mt-8">
                          <h2 className="text-3xl font-bold text-primary">
                            {web?.title}
                          </h2>
                          <p className="text-gray-500 dark:text-gray-400 font-medium flex items-center justify-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            {web?.description}
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          </p>
                        </div>
                      </div>

                      {/* 分隔线 */}
                      <div className="hidden lg:block absolute left-[41.666%] top-1/2 -translate-y-1/2 w-px h-3/4">
                        <div className="w-full h-full bg-linear-to-b from-transparent via-primary/50 dark:via-primary/30 to-transparent" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary/50 ring-4 ring-white/80 dark:ring-gray-800/80" />
                      </div>

                      {/* 信息区 */}
                      <div className="lg:col-span-7 w-full">
                        <div className="rounded-2xl p-6 relative overflow-hidden">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                icon={
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                  </svg>
                                }
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
                                icon={
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9a6 6 0 016 6m-6-9a9 9 0 019 9M3 3a18 18 0 0118 18M5 21h0" />
                                  </svg>
                                }
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
              </TiltCard>
            </ScrollReveal>
          </section>

          {/* 友链列表 */}
          {Object.keys(data)?.map((type, sectionIndex) => (
            <section key={type} className="relative">
              <ScrollReveal delay={100}>
                <div className="flex items-center gap-4 mb-8">
                  <div className="relative">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 z-10 relative px-2">
                      {type}
                    </h3>
                    <span className="absolute bottom-1 left-0 w-full h-3 bg-primary/20 -skew-x-12 rounded-sm" />
                  </div>
                  <div className="h-px flex-1 bg-linear-to-r from-gray-200 to-transparent dark:from-gray-800" />
                  {sectionIndex === 0 && (
                    <div className="shrink-0">
                      <ApplyForAdd />
                    </div>
                  )}
                </div>
              </ScrollReveal>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {/* 置顶作者卡片 */}
                {type === '全站置顶' && (
                  <ScrollReveal delay={150}>
                    <Link href="https://liuyuyang.net" target="_blank" className="group block h-full">
                      <MagneticCard className="h-full">
                        <div className="h-full relative overflow-hidden rounded-2xl bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 group-hover:shadow-xl group-hover:shadow-primary/10">
                          <div className="absolute inset-0 bg-linear-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="absolute top-3 right-3 px-2.5 py-1 bg-primary text-[10px] font-bold text-white rounded-full shadow-lg shadow-primary/30">
                            OWNER
                          </div>
                          <div className="relative p-5 flex items-center gap-4">
                            <div className="relative shrink-0">
                              <div className="absolute inset-0 rounded-full bg-primary opacity-0 group-hover:opacity-30 blur-md" />
                              <img
                                src="https://q1.qlogo.cn/g?b=qq&nk=3311118881&s=640"
                                alt="项目作者"
                                className="relative w-14 h-14 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-md transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary">
                                宇阳
                              </h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                                ThriveX 博客管理系统作者
                              </p>
                            </div>
                            <div className="shrink-0 opacity-0 transition-[opacity,translate] duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100">
                              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </MagneticCard>
                    </Link>
                  </ScrollReveal>
                )}

                {/* 友链卡片列表 */}
                {data[type].list?.map((item: Web, index: number) => (
                  <FriendCard key={item.id} item={item} type={type} index={index} />
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
