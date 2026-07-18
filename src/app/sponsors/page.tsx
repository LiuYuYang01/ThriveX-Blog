import type { Metadata } from 'next';
import { LuArrowDown, LuArrowRight, LuHeart } from 'react-icons/lu';

import BrandPartners from './components/BrandPartners';
import SponsorLedger from './components/SponsorLedger';
import SponsorTiers from './components/SponsorTiers';
import { brandSponsors, sponsorRecords, type SponsorType } from './data';

import './sponsors.scss';

export const metadata: Metadata = {
  title: '赞助鸣谢',
  description: '记录每一位以资金、AI Token 或服务器资源支持这个小站的朋友与品牌。',
};

const avatarPalette = [
  'bg-[#f59e0b]',
  'bg-[#14b8a6]',
  'bg-[#6366f1]',
  'bg-[#f43f5e]',
  'bg-[#0ea5e9]',
  'bg-[#10b981]',
  'bg-[#8b5cf6]',
];

const personalSections: {
  id: string;
  type: SponsorType;
  title: string;
  description: string;
}[] = [
  {
    id: 'funding',
    type: 'funding',
    title: '资金赞助',
    description: '直接资金支持，覆盖运营与开发开销',
  },
];

export default function SponsorsPage() {
  const heroAvatars = [...brandSponsors, ...sponsorRecords.filter((r) => r.kind === '个人')].slice(0, 6);
  const personalCount = sponsorRecords.filter((r) => r.kind === '个人').length;

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-32 left-1/2 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-primary/15 blur-[100px]" />
        <div className="absolute top-[28%] -left-24 h-[360px] w-[360px] rounded-full bg-[#6eb0ff]/12 blur-[90px]" />
        <div className="absolute top-[55%] -right-20 h-[320px] w-[320px] rounded-full bg-[#14b8a6]/10 blur-[90px]" />
        <div
          className="absolute inset-0 opacity-[0.35] dark:opacity-[0.2]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, color-mix(in oklab, var(--color-foreground) 12%, transparent) 1px, transparent 0)',
            backgroundSize: '28px 28px',
            maskImage: 'linear-gradient(to bottom, black 0%, black 35%, transparent 75%)',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1080px] px-5 sm:px-8">
        <section className="grid items-center gap-12 pt-28 pb-16 sm:pt-32 sm:pb-20 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10 lg:pb-24">
          <div>
            <h1
              className="sponsors-fade-up text-[clamp(2.6rem,6vw,4.4rem)] font-extrabold leading-[1.05] tracking-[-0.04em]"
              style={{ animationDelay: '0.12s' }}
            >
              感谢每一位
              <br />
              <span className="bg-linear-to-r from-primary via-[#6eb0ff] to-[#3d87f0] bg-clip-text text-transparent dark:from-[#7eb6ff] dark:via-primary dark:to-[#a8cfff]">
                赞助者
              </span>
            </h1>

            <p
              className="sponsors-fade-up mt-6 max-w-[480px] text-[15px] leading-[1.8] text-[#5f6979] dark:text-[#aab5c6]"
              style={{ animationDelay: '0.22s' }}
            >
              ThriveX 能够持续开源与迭代，离不开每一位个人与品牌的支持。选择适合的赞助等级，一起把这个项目做得更好。
            </p>

            <div className="sponsors-fade-up mt-8 flex flex-wrap items-center gap-3" style={{ animationDelay: '0.32s' }}>
              <a
                href="#tiers"
                className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-[#18202b] px-5 text-sm font-semibold text-white hover:opacity-90 dark:bg-white dark:text-[#18202b]"
              >
                查看赞助等级
                <LuArrowDown className="size-4" aria-hidden="true" />
              </a>
              <a
                href="#become"
                className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-border bg-surface/80 px-5 text-sm font-semibold text-foreground backdrop-blur-sm hover:border-primary/40"
              >
                成为赞助者
              </a>
            </div>

            <div
              className="sponsors-fade-up mt-10 flex items-center gap-6 text-sm text-[#7a8494] dark:text-[#99a5b8]"
              style={{ animationDelay: '0.4s' }}
            >
              <div>
                <strong className="block text-2xl font-extrabold tracking-[-0.04em] text-foreground tabular-nums">
                  {brandSponsors.length}
                </strong>
                <span className="text-xs tracking-[0.04em]">品牌伙伴</span>
              </div>
              <div className="h-8 w-px bg-border" aria-hidden="true" />
              <div>
                <strong className="block text-2xl font-extrabold tracking-[-0.04em] text-foreground tabular-nums">
                  {personalCount}
                </strong>
                <span className="text-xs tracking-[0.04em]">个人赞助</span>
              </div>
            </div>
          </div>

          <div
            className="sponsors-fade-up relative mx-auto aspect-square w-full max-w-[380px] lg:mx-0"
            style={{ animationDelay: '0.2s' }}
            aria-hidden="true"
          >
            <div className="absolute inset-[12%] rounded-full border border-primary/15" />
            <div className="absolute inset-[24%] rounded-full border border-dashed border-primary/20" />
            <div className="sponsors-float absolute inset-[36%] flex items-center justify-center rounded-full border border-primary/25 bg-surface/70 shadow-panel backdrop-blur-md">
              <div className="text-center">
                <LuHeart className="mx-auto size-7 text-primary" />
                <p className="mt-2 text-xs font-semibold tracking-[0.12em] text-primary">THANK YOU</p>
              </div>
            </div>

            {heroAvatars.map((record, index) => {
              const angle = (360 / heroAvatars.length) * index - 90;
              const radius = 42;
              const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
              const y = 50 + radius * Math.sin((angle * Math.PI) / 180);

              return (
                <div
                  key={record.id}
                  className="absolute"
                  style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
                >
                  <div
                    className={`sponsors-float flex size-12 items-center justify-center rounded-full text-[12px] font-bold text-white shadow-panel ring-2 ring-background sm:size-14 sm:text-[13px] ${avatarPalette[index % avatarPalette.length]}`}
                    style={{ animationDelay: `${index * 0.4}s` }}
                  >
                    {record.initials.slice(0, 2)}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <SponsorTiers />

        <BrandPartners brands={brandSponsors} />

        {personalSections.map((section) => {
          const records = sponsorRecords.filter((record) => record.type === section.type && record.kind === '个人');
          if (!records.length) return null;

          return (
            <section key={section.id} id={section.id} className="scroll-mt-24 py-12 sm:py-14">
              <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold tracking-[-0.02em] sm:text-2xl">{section.title}</h2>
                  <p className="mt-1 text-sm text-[#7a8494] dark:text-[#99a5b8]">{section.description}</p>
                </div>
                <div className="shrink-0 rounded-full border border-border bg-surface/80 px-3 py-1 text-[12px] font-medium text-[#7a8494] backdrop-blur-sm dark:text-[#99a5b8]">
                  {records.length} 位
                </div>
              </div>
              <SponsorLedger records={records} type={section.type} />
            </section>
          );
        })}

        <section id="become" className="scroll-mt-24 py-10 sm:py-14">
          <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-primary/5 px-8 py-14 text-center sm:px-12">
            <div className="pointer-events-none absolute -left-16 top-1/2 size-48 -translate-y-1/2 rounded-full bg-primary/15 blur-3xl" aria-hidden="true" />
            <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-[#6eb0ff]/20 blur-3xl" aria-hidden="true" />

            <div className="relative">
              <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-2xl bg-primary text-white shadow-panel">
                <LuHeart className="size-5" aria-hidden="true" />
              </div>
              <h2 className="text-[1.7rem] font-extrabold tracking-[-0.03em] sm:text-3xl">成为赞助者</h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#5f6979] dark:text-[#aab5c6]">
                如果你想支持 ThriveX，无论是按月赞助、一次性捐赠，还是提供 Token / 服务器资源，都欢迎联系我。
              </p>
              <a
                href="mailto:liuyuyang1024@yeah.net?subject=ThriveX%20%E8%B5%9E%E5%8A%A9"
                className="mt-8 inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-[0_8px_24px_-6px_rgba(83,157,253,0.55)] hover:opacity-90"
              >
                联系我
                <LuArrowRight className="size-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

        <footer className="flex flex-col items-center gap-2 border-t border-border py-10 text-[13px] text-[#9a9590] sm:flex-row sm:justify-between dark:text-[#8b939e]">
          <span>感谢每一位赞助者</span>
          <span>
            {brandSponsors.length} 家品牌 · {personalCount} 位个人
          </span>
        </footer>
      </div>
    </main>
  );
}
