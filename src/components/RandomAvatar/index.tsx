'use client';

import { useState } from 'react';
import { createAvatar } from '@dicebear/core';

import { pixelArt } from '@dicebear/collection';

/** 生成随机像素风头像，无头像时作为默认展示 */
export default ({ className }: { className: string }) => {
  const [avatar] = useState(() => {
    const seed = Math.random().toString(36).substring(2, 15);
    return createAvatar(pixelArt, {
      seed,
      size: 128,
    }).toDataUri();
  });

  return <img src={avatar} alt="Avatar" className={className} />;
};
