import { LuTextQuote } from 'react-icons/lu';

interface SummaryProps {
  content: string;
}

export default function Summary({ content }: SummaryProps) {
  const text = content.trim();
  if (!text) return null;

  return (
    <aside
      className="relative overflow-hidden rounded-xl border border-[#e8f2fc] bg-[#ecf7fe]/55 px-5 py-4 dark:border-gray-700/55 dark:bg-[#28323f]/55"
      data-nosnippet
    >
      <div className="absolute top-0 bottom-0 left-0 w-0.75 rounded-l-xl bg-primary dark:bg-primary/80" />

      <LuTextQuote
        className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 rotate-12 text-7xl text-primary/4 dark:text-gray-700/50"
        aria-hidden
      />

      <div className="relative z-10">
        <header className="mb-2.5 flex items-center gap-2.5">
          <h2 className="m-0 text-sm font-semibold tracking-wide text-gray-700 dark:text-gray-200">文章摘要</h2>
        </header>
        <p className="m-0 text-[15px] leading-relaxed tracking-wide text-gray-500 dark:text-gray-400">{text}</p>
      </div>
    </aside>
  );
}
