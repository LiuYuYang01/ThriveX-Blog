export default () => (
  <div className="rounded-2xl shadow-xl overflow-hidden bg-white dark:bg-black-b/95 backdrop-blur-xs border border-slate-200/80 dark:border-slate-700/50" aria-hidden>
    <div className="p-6 sm:p-10 lg:p-12 space-y-12">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl bg-neutral-200/60 dark:bg-neutral-800/60" />
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-10 animate-pulse rounded-lg bg-neutral-200/60 dark:bg-neutral-800/60" />
        ))}
      </div>
    </div>
  </div>
);
