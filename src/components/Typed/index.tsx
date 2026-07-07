'use client';

import { useEffect, useRef } from 'react';
import Typed from 'typed.js';

interface Props {
  className?: string;
  swiperText?: string[];
}

export default ({ className, swiperText = [] }: Props) => {
  const el = useRef(null);

  useEffect(() => {
    if (!swiperText.length) return;

    const typed = new Typed(el.current, {
      strings: swiperText,
      typeSpeed: 100,
      backSpeed: 30,
      loop: true,
    });

    return () => typed.destroy();
  }, [swiperText]);

  return <span ref={el} className={className} />;
};
