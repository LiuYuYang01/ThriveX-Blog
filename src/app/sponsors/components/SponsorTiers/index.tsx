import { LuCheck, LuMail, LuSparkles } from 'react-icons/lu';

import { sponsorTiers, type SponsorTier, type SponsorTierId } from '../../data';

const contactHref = 'mailto:liuyuyang1024@yeah.net?subject=ThriveX%20%E8%B5%9E%E5%8A%A9';

const tierAccent: Record<SponsorTierId, string> = {
  special: 'border-primary/35 bg-linear-to-br from-primary/10 via-surface to-surface',
  platinum: 'border-[#c7d2fe] bg-linear-to-br from-[#eef2ff] to-surface dark:border-[#3b4570] dark:from-[#1e2540]/50 dark:to-surface',
  gold: 'border-[#fde68a] bg-linear-to-br from-[#fffbeb] to-surface dark:border-[#5c4a1a] dark:from-[#3d2e12]/40 dark:to-surface',
  silver: 'border-border bg-surface/90',
  bronze: 'border-border bg-surface/90',
  generous: 'border-border bg-surface/80',
  individual: 'border-border bg-surface/80',
};

const tierBadge: Record<SponsorTierId, string> = {
  special: 'bg-primary text-white',
  platinum: 'bg-[#4f6ef7] text-white dark:bg-[#818cf8]',
  gold: 'bg-[#d97706] text-white dark:bg-[#fbbf24] dark:text-[#1c1917]',
  silver: 'bg-[#94a3b8] text-white dark:bg-[#64748b]',
  bronze: 'bg-[#b45309] text-white dark:bg-[#c2410c]',
  generous: 'bg-primary/15 text-primary',
  individual: 'bg-[#f1f5f9] text-[#64748b] dark:bg-[#343c49] dark:text-[#94a3b8]',
};

function TierBenefits({ benefits }: { benefits: string[] }) {
  return (
    <ul className="mt-5 space-y-2.5">
      {benefits.map((benefit) => (
        <li key={benefit} className="flex gap-2.5 text-[13px] leading-relaxed text-[#5f6979] dark:text-[#aab5c6]">
          <LuCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          <span>{benefit}</span>
        </li>
      ))}
    </ul>
  );
}

function SpecialTierCard({ tier, index }: { tier: SponsorTier; index: number }) {
  return (
    <article
      className={`sponsors-fade-up relative overflow-hidden rounded-3xl border p-6 sm:p-8 ${tierAccent[tier.id]}`}
      style={{ animationDelay: `${0.08 + index * 0.06}s` }}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-primary/15 blur-3xl" aria-hidden="true" />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${tierBadge[tier.id]}`}>
              <LuSparkles className="size-3.5" aria-hidden="true" />
              最高级别
            </span>
            {tier.vacant ? (
              <span className="rounded-full border border-dashed border-primary/40 px-2.5 py-1 text-[11px] font-semibold text-primary">
                目前空缺
              </span>
            ) : null}
          </div>
          <h3 className="mt-4 text-2xl font-extrabold tracking-[-0.03em] sm:text-[1.75rem]">{tier.name}</h3>
          <p className="mt-2 text-sm text-[#7a8494] dark:text-[#99a5b8]">独占曝光位，适合希望获得最大品牌声量的合作方。</p>
          <TierBenefits benefits={tier.benefits} />
        </div>

        <a
          href={contactHref}
          className="inline-flex h-11 shrink-0 cursor-pointer items-center justify-center gap-2 self-start rounded-full bg-primary px-5 text-sm font-semibold text-white hover:opacity-90"
        >
          <LuMail className="size-4" aria-hidden="true" />
          联系洽谈
        </a>
      </div>
    </article>
  );
}

const tierLabel: Partial<Record<SponsorTierId, string>> = {
  platinum: '企业首选',
  gold: '高曝光',
  silver: '中号 Logo',
  bronze: '小号 Logo',
};

function TierCard({ tier, index }: { tier: SponsorTier; index: number }) {
  return (
    <article
      className={`sponsors-fade-up flex h-full flex-col overflow-hidden rounded-2xl border p-5 sm:p-6 ${tierAccent[tier.id]}`}
      style={{ animationDelay: `${0.1 + index * 0.05}s` }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          {tierLabel[tier.id] ? (
            <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${tierBadge[tier.id]}`}>
              {tierLabel[tier.id]}
            </span>
          ) : null}
          <h3 className={`text-xl font-bold tracking-[-0.02em] ${tierLabel[tier.id] ? 'mt-3' : ''}`}>{tier.name}</h3>
        </div>
        {tier.price ? (
          <div className="text-right">
            <strong className="block text-lg font-extrabold tracking-[-0.03em] tabular-nums text-foreground sm:text-xl">
              {tier.price.split(' / ')[0]}
            </strong>
            <span className="text-[12px] text-[#9a9590] dark:text-[#8b939e]">/ 月</span>
          </div>
        ) : null}
      </div>

      <div className="mb-5 flex-1">
        <TierBenefits benefits={tier.benefits} />
      </div>

      <a
        href={contactHref}
        className="mt-auto inline-flex h-10 cursor-pointer items-center justify-center rounded-full border border-border bg-background/70 px-4 text-[13px] font-semibold text-foreground hover:border-primary/40 hover:text-primary"
      >
        选择此等级
      </a>
    </article>
  );
}

function CompactTierRow({ tier, index }: { tier: SponsorTier; index: number }) {
  return (
    <li
      className="sponsors-fade-up flex flex-col gap-3 border-b border-border bg-surface/90 px-4 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-5"
      style={{ animationDelay: `${0.12 + index * 0.05}s` }}
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${tierBadge[tier.id]}`}>
            {tier.name}
          </span>
          {tier.price ? (
            <span className="text-sm font-bold tabular-nums text-foreground">{tier.price}</span>
          ) : null}
        </div>
        <p className="mt-1.5 text-[13px] leading-relaxed text-[#7a8494] dark:text-[#99a5b8]">{tier.benefits[0]}</p>
      </div>
      <a
        href={contactHref}
        className="inline-flex h-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border px-4 text-[12px] font-semibold text-foreground hover:border-primary/40 hover:text-primary"
      >
        支持
      </a>
    </li>
  );
}

export default function SponsorTiers() {
  const special = sponsorTiers.find((tier) => tier.id === 'special')!;
  const platinum = sponsorTiers.find((tier) => tier.id === 'platinum')!;
  const gold = sponsorTiers.find((tier) => tier.id === 'gold')!;
  const mid = sponsorTiers.filter((tier) => tier.id === 'silver' || tier.id === 'bronze');
  const personal = sponsorTiers.filter((tier) => tier.id === 'generous' || tier.id === 'individual');

  return (
    <section id="tiers" className="scroll-mt-24 py-12 sm:py-14">
      <div className="mb-8">
        <h2 className="mt-2 text-2xl font-bold tracking-[-0.025em] sm:text-[1.65rem]">赞助等级</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#7a8494] dark:text-[#99a5b8]">
          以下等级面向 ThriveX 博客站点与开源仓库的曝光权益。按月赞助可获得对应 Logo / 名单展示位，也可一次性捐赠，欢迎按需洽谈。
        </p>
      </div>

      <div className="space-y-4">
        <SpecialTierCard tier={special} index={0} />

        <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <TierCard tier={platinum} index={1} />
          <TierCard tier={gold} index={2} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {mid.map((tier, index) => (
            <TierCard key={tier.id} tier={tier} index={3 + index} />
          ))}
        </div>

        <ul className="overflow-hidden rounded-2xl border border-border shadow-[0_1px_0_rgba(0,0,0,0.02)]">
          {personal.map((tier, index) => (
            <CompactTierRow key={tier.id} tier={tier} index={5 + index} />
          ))}
        </ul>
      </div>
    </section>
  );
}
