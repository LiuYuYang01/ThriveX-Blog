import { LuArrowUpRight, LuBuilding2 } from 'react-icons/lu';

import OptimizedImage from '@/components/OptimizedImage';

import type { SponsorRecord, SponsorType } from '../../data';

const typeLabel: Record<SponsorType, string> = {
  funding: '资金赞助',
  token: 'Token 赞助',
  server: '服务器赞助',
};

const typeBadge: Record<SponsorType, string> = {
  funding: 'bg-[#fffbeb] text-[#b45309] dark:bg-[#3d2e12] dark:text-[#fbbf24]',
  token: 'bg-primary/10 text-primary',
  server: 'bg-[#eef2ff] text-[#4f6ef7] dark:bg-[#1e2540] dark:text-[#a5b4fc]',
};

interface BrandPartnersProps {
  brands: SponsorRecord[];
}

function BrandCard({ brand, index }: { brand: SponsorRecord; index: number }) {
  const content = (
    <>
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100" aria-hidden="true" />

      <div className="relative shrink-0">
        <div className="absolute inset-0 rounded-2xl bg-primary/20 opacity-0 blur-md group-hover:opacity-100" aria-hidden="true" />
        <div className="relative flex size-[72px] items-center justify-center overflow-hidden rounded-2xl border border-border bg-[#f4f7fa] sm:size-20 dark:bg-[#252d38]">
          {brand.logo ? (
            <OptimizedImage
              src={brand.logo}
              alt={`${brand.name} logo`}
              width={80}
              height={80}
              className="size-full object-cover"
            />
          ) : (
            <span className="text-lg font-bold text-primary">{brand.initials.slice(0, 2)}</span>
          )}
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-lg font-bold tracking-[-0.02em] text-foreground group-hover:text-primary">{brand.name}</h3>
          {brand.ongoing ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
              <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
              长期合作
            </span>
          ) : null}
        </div>

        <p className="mt-1 text-[13px] font-medium text-[#5f6979] dark:text-[#aab5c6]">
          {brand.tagline || brand.contribution}
        </p>

        <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-[#8b939e] dark:text-[#9aa3af]">{brand.note}</p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${typeBadge[brand.type]}`}>
            {typeLabel[brand.type]}
          </span>
          <span className="text-[12px] font-semibold text-foreground">{brand.contribution}</span>
          <span className="text-[12px] text-[#9a9590] dark:text-[#8b939e]">{brand.period}</span>
          {brand.url ? (
            <LuArrowUpRight
              className="ml-auto size-4 text-[#9a9590] opacity-0 group-hover:opacity-100 dark:text-[#8b939e]"
              aria-hidden="true"
            />
          ) : null}
        </div>
      </div>
    </>
  );

  const className =
    'sponsors-fade-up group relative flex gap-4 overflow-hidden rounded-2xl border border-border bg-surface/90 p-5 shadow-[0_1px_0_rgba(0,0,0,0.02)] backdrop-blur-sm hover:-translate-y-1 hover:border-primary/30 sm:gap-5 sm:p-6';

  if (brand.url) {
    return (
      <a
        href={brand.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${className} cursor-pointer`}
        style={{ animationDelay: `${0.08 + index * 0.07}s` }}
      >
        {content}
      </a>
    );
  }

  return (
    <div className={className} style={{ animationDelay: `${0.08 + index * 0.07}s` }}>
      {content}
    </div>
  );
}

export default function BrandPartners({ brands }: BrandPartnersProps) {
  if (!brands.length) return null;

  return (
    <section id="brands" className="scroll-mt-24 py-12 sm:py-14">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="mt-2 text-2xl font-bold tracking-[-0.025em] sm:text-[1.65rem]">品牌合作伙伴</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#7a8494] dark:text-[#99a5b8]">
            感谢以下品牌以资源与能力长期支持这个小站，特此图文致谢。
          </p>
        </div>
        <div className="inline-flex items-center gap-2 self-start rounded-full border border-border bg-surface/80 px-3 py-1.5 text-[12px] font-medium text-[#7a8494] backdrop-blur-sm dark:text-[#99a5b8]">
          <LuBuilding2 className="size-3.5 text-primary" aria-hidden="true" />
          {brands.length} 家品牌
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {brands.map((brand, index) => (
          <BrandCard key={brand.id} brand={brand} index={index} />
        ))}
      </div>
    </section>
  );
}
