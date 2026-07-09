'use client';

import dynamic from 'next/dynamic';

const IconCloud = dynamic(() => import('@/app/my/components/IconCloud'), { ssr: false });

export default ({ iconSlugs }: { iconSlugs: string[] }) => <IconCloud iconSlugs={iconSlugs} />;
