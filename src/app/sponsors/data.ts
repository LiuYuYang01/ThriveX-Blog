export type SponsorType = 'funding' | 'token' | 'server';

export type SponsorTierId =
  | 'special'
  | 'platinum'
  | 'gold'
  | 'silver'
  | 'bronze'
  | 'generous'
  | 'individual';

export interface SponsorRecord {
  id: number;
  name: string;
  initials: string;
  kind: '个人' | '品牌';
  type: SponsorType;
  contribution: string;
  period: string;
  note: string;
  ongoing?: boolean;
  logo?: string;
  url?: string;
  tagline?: string;
}

export interface SponsorTier {
  id: SponsorTierId;
  name: string;
  price?: string;
  vacant?: boolean;
  highlight?: boolean;
  benefits: string[];
}

export const sponsorTiers: SponsorTier[] = [
  {
    id: 'special',
    name: '特别赞助商',
    vacant: true,
    highlight: true,
    benefits: [
      '全球独家赞助商（目前空缺，欢迎联系）',
      '博客首页首屏无需滚动可见的独家 Logo 展示位',
      '通过作者社交账号对主要产品独家发布进行特别喊话与定期转发',
      '所有级别 Logo 展示位中最显眼的位置',
    ],
  },
  {
    id: 'platinum',
    name: '铂金赞助商',
    price: '¥2,000 / 月',
    highlight: true,
    benefits: [
      '博客首页明显的 Logo 展示位',
      '文章页等内容页侧边栏明显的 Logo 展示位',
      'ThriveX-Blog 与 ThriveX-Admin 仓库 README 上明显的 Logo 展示位',
    ],
  },
  {
    id: 'gold',
    name: '金牌赞助商',
    price: '¥500 / 月',
    benefits: [
      '博客首页大号 Logo 展示位',
      'ThriveX-Blog 与 ThriveX-Admin 仓库 README 上大号 Logo 展示位',
    ],
  },
  {
    id: 'silver',
    name: '银牌赞助商',
    price: '¥250 / 月',
    benefits: ['ThriveX-Blog 与 ThriveX-Admin 的 BACKERS.md 中号 Logo 展示位'],
  },
  {
    id: 'bronze',
    name: '铜牌赞助商',
    price: '¥100 / 月',
    benefits: ['ThriveX-Blog 与 ThriveX-Admin 的 BACKERS.md 小号 Logo 展示位'],
  },
  {
    id: 'generous',
    name: '慷慨支持者',
    price: '¥50 / 月',
    benefits: ['在 BACKERS.md 名单上展示，且排在其他个人支持者之前'],
  },
  {
    id: 'individual',
    name: '个人支持者',
    price: '¥5 / 月',
    benefits: ['在 BACKERS.md 名单上展示你的名字'],
  },
];

export const sponsorRecords: SponsorRecord[] = [
  {
    id: 1,
    name: '星屿云',
    initials: '星屿',
    kind: '品牌',
    type: 'server',
    contribution: '2 核 4G 云服务器',
    period: '2026.04 — 至今',
    note: '为博客与图片服务提供稳定的运行环境。',
    tagline: '云原生基础设施合作伙伴',
    logo: '/images/sponsors/xingyu-cloud.svg',
    ongoing: true,
  },
  {
    id: 2,
    name: 'NovaMind',
    initials: 'NM',
    kind: '品牌',
    type: 'token',
    contribution: 'AI API · 500 万 Tokens',
    period: '2026.06',
    note: '用于文章摘要、灵感辅助与站内 AI 功能实验。',
    tagline: '智能模型能力赞助方',
    logo: '/images/sponsors/novamind.svg',
  },
  {
    id: 3,
    name: '林间有风',
    initials: '林风',
    kind: '个人',
    type: 'funding',
    contribution: '¥ 520',
    period: '2026.05.20',
    note: '愿你一直写下去，也一直保有分享的热情。',
  },
  {
    id: 4,
    name: '北岸数据',
    initials: '北岸',
    kind: '品牌',
    type: 'server',
    contribution: '对象存储 · 100 GB / 年',
    period: '2026.03 — 2027.03',
    note: '用于保存文章配图与站点静态资源。',
    tagline: '数据存储与静态资源支持',
    logo: '/images/sponsors/beian-data.svg',
    ongoing: true,
  },
  {
    id: 5,
    name: '不具名的朋友',
    initials: '匿名',
    kind: '个人',
    type: 'funding',
    contribution: '¥ 200',
    period: '2026.02.14',
    note: '一份没有署名，但被认真记住的支持。',
  },
  {
    id: 6,
    name: 'Prompt Harbor',
    initials: 'PH',
    kind: '品牌',
    type: 'token',
    contribution: 'AI API · 120 万 Tokens',
    period: '2026.01',
    note: '支持站内智能搜索与内容实验。',
    tagline: 'Prompt 与检索能力赞助',
    logo: '/images/sponsors/prompt-harbor.svg',
  },
  {
    id: 7,
    name: '山川',
    initials: '山川',
    kind: '个人',
    type: 'funding',
    contribution: '¥ 488',
    period: '2025.12.31',
    note: '新的一年，也请继续做喜欢的事。',
  },
];

export const brandSponsors = sponsorRecords.filter((record) => record.kind === '品牌');
