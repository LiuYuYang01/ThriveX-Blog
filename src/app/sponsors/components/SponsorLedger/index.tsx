import type { SponsorRecord, SponsorType } from '../../data';

interface SponsorLedgerProps {
  records: SponsorRecord[];
  type: SponsorType;
}

const avatarColors = [
  'bg-[#f59e0b]',
  'bg-[#14b8a6]',
  'bg-[#6366f1]',
  'bg-[#f43f5e]',
  'bg-[#0ea5e9]',
  'bg-[#10b981]',
  'bg-[#8b5cf6]',
  'bg-[#f97316]',
  'bg-[#64748b]',
];

const tagClass: Record<SponsorType, string> = {
  funding: 'bg-[#fffbeb] text-[#b45309] dark:bg-[#3d2e12] dark:text-[#fbbf24]',
  token: 'bg-primary/10 text-primary',
  server: 'bg-[#eef2ff] text-[#4f6ef7] dark:bg-[#1e2540] dark:text-[#a5b4fc]',
};

export default function SponsorLedger({ records, type }: SponsorLedgerProps) {
  const personalRecords = records.filter((record) => record.kind === '个人');

  if (!personalRecords.length) return null;

  return (
    <ul className="overflow-hidden rounded-2xl border border-border bg-surface/80 shadow-[0_1px_0_rgba(0,0,0,0.02)] backdrop-blur-sm">
      {personalRecords.map((record, index) => (
        <li
          key={record.id}
          className="sponsors-row sponsors-fade-up grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-border px-4 py-4 last:border-b-0 hover:bg-[#f8fafc] sm:grid-cols-[auto_minmax(0,1fr)_auto_auto] sm:gap-5 sm:px-6 dark:hover:bg-[#343c49]"
          style={{ animationDelay: `${0.05 + index * 0.06}s` }}
        >
          <div
            className={`flex size-11 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white ring-2 ring-background ${avatarColors[record.id % avatarColors.length]}`}
            aria-hidden="true"
          >
            {record.initials.slice(0, 2)}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-foreground">{record.name}</h3>
              {record.ongoing ? (
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${tagClass[type]}`}>
                  <span className="size-1.5 rounded-full bg-current opacity-70" aria-hidden="true" />
                  长期
                </span>
              ) : null}
            </div>
            <p className="mt-0.5 truncate text-[13px] text-[#8b939e] dark:text-[#9aa3af]">{record.note}</p>
          </div>

          <div className="text-right text-[13px] font-semibold whitespace-nowrap text-foreground">
            {record.contribution}
          </div>

          <time className="hidden font-mono text-[12px] whitespace-nowrap text-[#9a9590] sm:block dark:text-[#8b939e]">
            {record.period}
          </time>
        </li>
      ))}
    </ul>
  );
}
