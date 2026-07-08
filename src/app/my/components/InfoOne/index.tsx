'use client';

import { useEffect } from 'react';
import OptimizedImage from '@/components/OptimizedImage';

import AOS from 'aos';
import 'aos/dist/aos.css';
import { InfoOne } from '@/types/app/my';

export default ({ data }: { data: InfoOne }) => {
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <>
      <div data-aos="zoom-in" className="mt-8 sm:mt-16  ">
        <div className="flex flex-col-reverse sm:flex-row justify-between items-center">
          <div className="w-full text-center sm:text-start sm:w-6/12 mt-6 sm:mt-0 text-[#353a40] dark:text-[#fff]">
            <div className="text-xl lg:text-4xl my-0 lg:my-5 text-[#738bff]">
              I am <span className="name">{data?.name}</span>
            </div>
            <div className="text-xl lg:text-4xl my-2 sm:my-4 lg:my-5">{data?.profession}</div>
            <div className="text-sm text-[#666] dark:text-[#8c9ab1] leading-6 lg:leading-8">{data?.introduction}</div>
          </div>

          <div className="overflow-hidden relative w-[40%] h-[40%] rounded-full shadow-lg aspect-square">
            {data?.avatar ? (
              <OptimizedImage src={data.avatar} alt={data?.name} fill className="object-cover" sizes="(max-width: 640px) 40vw, 380px" />
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};
