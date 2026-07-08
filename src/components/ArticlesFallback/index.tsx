export default ({ count = 4 }: { count?: number }) => {
  return (
    <div className="space-y-2" aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="panel h-[190px] animate-pulse bg-neutral-200/60 md:h-60 lg:h-52 xl:h-60 dark:bg-neutral-800/60"
        />
      ))}
    </div>
  );
};
