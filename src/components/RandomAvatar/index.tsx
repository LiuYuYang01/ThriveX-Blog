'use client';

import { useEffect, useState } from 'react';
import { createAvatar } from '@dicebear/core';
import { pixelArt } from '@dicebear/collection';

/** 生成随机像素风头像，无头像时作为默认展示 */
export default ({ className, seed = 'default' }: { className: string; seed?: string }) => {
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    setAvatar(
      createAvatar(pixelArt, {
        seed,
        size: 128,
      }).toDataUri(),
    );
  }, [seed]);

  if (!avatar) {
    return <div className={`${className} bg-slate-200 dark:bg-slate-700`} aria-hidden />;
  }

  return <img src={avatar} alt="Avatar" className={className} />;
};
