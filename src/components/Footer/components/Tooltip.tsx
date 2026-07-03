'use client';

import { Tooltip } from '@/ThriveUI';

export default ({ children, content }: { children: React.ReactNode; content: string }) => {
  return (
    <Tooltip showArrow content={content}>
      {children}
    </Tooltip>
  );
};
