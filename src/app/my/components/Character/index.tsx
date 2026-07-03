'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Progress, Tooltip } from '@/ThriveUI';
import INFJ from '@/assets/image/INFJ.png';
import { BiQuestionMark } from 'react-icons/bi';

import AOS from 'aos';
import 'aos/dist/aos.css';

interface Props {
  data: {
    value: number;
    text1: string;
    text2: string;
    content: string;
    color: string;
  }[];
}

export default ({ data }: Props) => {
  // 提前把颜色写好，否则会导致样式丢失
  const colors = ['[&>div]:bg-[#4298b4]', '[&>div]:bg-[#e4ae3a]', '[&>div]:bg-[#33a474]', '[&>div]:bg-[#88619a]', '[&>div]:bg-[#f25e62]'];

  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <div data-aos="fade-down" className="w-full md:w-7/12 flex flex-col mr-0 md:mr-20">
      <div className="text-center text-xl mb-8">我的性格</div>

      <div className="flex flex-col sm:flex-row justify-between items-center">
        <div className="flex sm:block w-[40%]">
          <div className="text-[30px] sm:text-[40px] text-[#33a474] font-medium font-sans">提倡者</div>
          <div className="text-[#666] dark:text-[#8c9ab1] hidden sm:block">INFJ</div>
          <Image src={INFJ} alt="性格" width={200}></Image>
          <Link href="https://www.16personalities.com/ch/infj-人格" className="block w-full mt-2 text-center text-[#666] text-xs hover:text-[#33a474]">
            了解一下
          </Link>
        </div>

        <div className="w-full sm:w-[65%] mt-10 sm:mt-0 space-y-10">
          {data?.map(({ value, text1, text2, content, color }, index) => {
            return (
              <div key={index} className="flex justify-center items-center">
                <span className="min-w-[80px] dark:text-[#8c9ab1] text-xs sm:text-base">{text1}</span>

                <div className="relative w-full max-w-md">
                  <Progress value={value} className={`relative ${colors[index]}`} />
                  <div className="absolute -top-[25px] -translate-x-1/2 left-0 h-full flex items-center justify-center" style={{ left: `${value}%` }}>
                    <span className={`flex items-center text-[${color}]`}>
                      {value}%
                      <Tooltip content={content}>
                        <BiQuestionMark className="w-5 h-5 ml-2 rounded-full p-[2px] bg-[#eee] dark:bg-black-b cursor-pointer" />
                      </Tooltip>
                    </span>
                  </div>
                </div>

                <span className="text-end min-w-[80px] dark:text-[#8c9ab1] text-xs sm:text-base">{text2}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
