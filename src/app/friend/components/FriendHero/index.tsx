'use client';

import Link from 'next/link';
import { Web as WebConfig } from '@/types/app/config';
import { User } from '@/types/app/user';
import OptimizedImage from '@/components/OptimizedImage';
import CopyInput from '../CopyInput';
import MagneticCard from '../MagneticCard';
import ScrollReveal from '../ScrollReveal';
import TiltCard from '../TiltCard';

interface FriendHeroProps {
  web?: WebConfig;
  author?: User;
}

export default function FriendHero({ web, author }: FriendHeroProps) {
  return (
    <section className="relative">
      <ScrollReveal>
        <TiltCard className="w-full">
          <div className="relative bg-white/70 dark:bg-gray-800/40 border border-white/50 dark:border-gray-700/30 rounded-3xl shadow-2xl overflow-hidden">
            <div className="absolute inset-0 rounded-3xl bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-[120px]" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/10 rounded-tr-[80px]" />

            <div className="absolute top-6 right-6 w-2 h-2 rounded-full bg-primary/50" />
            <div className="absolute bottom-8 left-8 w-1.5 h-1.5 rounded-full bg-primary/50" />
            <div className="absolute top-1/3 right-12 w-1 h-1 rounded-full bg-primary/50" />

            <div className="p-8 md:p-10 lg:p-12 relative">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                <div className="lg:col-span-5 flex flex-col justify-center items-center text-center">
                  <div className="relative w-48 h-48 flex items-center justify-center">
                    <div className="pointer-events-none absolute inset-0 rounded-full border-2 border-dashed border-primary/30 dark:border-primary/20" />
                    <div className="pointer-events-none absolute inset-4 rounded-full border border-dashed border-primary/20 dark:border-primary/15" />

                    <div className="relative group/avatar cursor-pointer">
                      <div className="absolute -inset-2 rounded-full bg-primary opacity-30 blur-lg group-hover/avatar:opacity-50" />
                      <div className="relative w-36 h-36 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-gray-800 shadow-2xl overflow-hidden bg-white dark:bg-gray-900">
                        <OptimizedImage
                          src={author?.avatar || '/favicon.ico'}
                          alt="Site Logo"
                          fill
                          className="object-cover transition-[scale,rotate] duration-500 group-hover/avatar:scale-105 group-hover/avatar:rotate-6"
                          sizes="160px"
                        />
                      </div>
                    </div>
                  </div>

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

                <div className="hidden lg:block absolute left-[41.666%] top-1/2 -translate-y-1/2 w-px h-3/4">
                  <div className="w-full h-full bg-linear-to-b from-transparent via-primary/50 dark:via-primary/30 to-transparent" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary/50 ring-4 ring-white/80 dark:ring-gray-800/80" />
                </div>

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
  );
}

export function OwnerCard() {
  return (
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
                  className="relative w-14 h-14 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-md transition-[scale,rotate] duration-500 group-hover:scale-110 group-hover:rotate-3"
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
  );
}
