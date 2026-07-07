'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { InfoTwo } from '@/types/app/my';
import './index.scss';

export default ({ data }: { data: InfoTwo }) => {
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <section className="mt-16">
      <div className="about-me">
        <div className="info-left">
          {data.left_tags.map((t, index) => (
            <span key={index} className="tag dark:text-white dark:bg-[#36404d] dark:border-[#4e5969]  ">
              {t}
            </span>
          ))}
        </div>

        <div className="avatar">
          <img src={data.avatar_url} alt={data.author} className="avatar-img dark:border-[rgba(56,64,76)]!" />
        </div>

        <div className="info-right">
          {data.right_tags.map((t, index) => (
            <span key={index} className="tag dark:text-white dark:bg-[#36404d] dark:border-[#4e5969]  ">
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="about-me-2 flex flex-col">
        <button className="trigger dark:bg-black-b border! dark:border-[#4e5969] dark:text-white">{data.author}</button>

        <Link href={data.know_me} target="_blank" className="text-xs text-[#2764b2] mt-3">
          去了解我
        </Link>
      </div>
    </section>
  );
};
