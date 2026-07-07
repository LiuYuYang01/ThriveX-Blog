import { useState } from 'react';
import { createAvatar } from '@dicebear/core';

import { pixelArt } from '@dicebear/collection';

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
