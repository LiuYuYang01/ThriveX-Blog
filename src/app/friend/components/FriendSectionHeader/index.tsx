'use client';

import ApplyForAdd from '../ApplyForAdd';
import ScrollReveal from '../ScrollReveal';

export default function FriendSectionHeader({ type, showApply }: { type: string; showApply: boolean }) {
  return (
    <ScrollReveal delay={100}>
      <div className="flex items-center gap-4 mb-8">
        <div className="relative">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 z-10 relative px-2">
            {type}
          </h3>
          <span className="absolute bottom-1 left-0 w-full h-3 bg-primary/20 -skew-x-12 rounded-xs" />
        </div>
        <div className="h-px flex-1 bg-linear-to-r from-gray-200 to-transparent dark:from-gray-800" />
        {showApply && (
          <div className="shrink-0">
            <ApplyForAdd />
          </div>
        )}
      </div>
    </ScrollReveal>
  );
}
