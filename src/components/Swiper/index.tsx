'use client';

import { Button } from '@heroui/react';
import { useState, useEffect, useRef } from 'react';
import { BiChevronRight } from 'react-icons/bi';
import { BiChevronLeft } from 'react-icons/bi';
import { Swiper as SwiperType } from '@/types/app/swiper';

export default ({ data, className }: { data: SwiperType[]; className?: string }) => {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handlePrev = () => {
    setCurrent((current) => {
      if (current === 0) {
        return data?.length - 1;
      }
      return current - 1;
    });
  };

  const handleNext = () => {
    setCurrent((current) => {
      if (current >= data?.length - 1) {
        return 0;
      }
      return current + 1;
    });
  };

  useEffect(() => {
    if (!isHovered) {
      intervalRef.current = setInterval(() => {
        setCurrent((current) => (current >= data?.length - 1 ? 0 : current + 1));
      }, 4000);
    }
    return () => clearInterval(intervalRef.current as NodeJS.Timeout);
  }, [isHovered]);

  return (
    <>
      <div className={`group relative w-full h-[200px] mb-2 sm:h-[270px] lg:h-[350px] rounded-2xl overflow-hidden after:content-[''] after:w-full after:h-[60%] after:absolute after:bottom-0 after:left-0 after:bg-[linear-gradient(to_top,#2c333e,transparent)] ${className}`} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <div onClick={handlePrev} className="flex justify-center items-center w-11 h-11 bg-[#fff3] rounded-full hover:bg-transparent hover:backdrop-blur-md hover:scale-110 group-hover:opacity-100 opacity-0 transition-[transform,opacity] absolute top-1/2 left-3.5 -translate-y-1/2 z-20 cursor-pointer">
          <BiChevronLeft className="text-4xl text-gray-100" />
        </div>

        {data?.map((item, index) => (
          <div key={index} className={`absolute top-0 left-0 w-full h-full ${index === current ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
            <img key={index} src={item.image} alt={item.title} className="w-full h-full object-cover" width={1694} height={700} />

            <div className="flex flex-col absolute bottom-7 left-5 z-10 gap-2 animation_bottom">
              <h2 className="text-white text-xl lg:text-2xl font-bold text_shadow">{item.title}</h2>
              <Button color="primary" variant="shadow" endContent={<BiChevronRight className="text-2xl" />} className="!w-28 mt-2 hover:translate-x-2 transition-transform" onPress={() => window.open(item.url, '_blank')}>
                立刻围观
              </Button>
            </div>
          </div>
        ))}

        <div onClick={handleNext} className="flex justify-center items-center w-11 h-11 bg-[#fff3] rounded-full hover:bg-transparent hover:backdrop-blur-md hover:scale-110 group-hover:opacity-100 opacity-0 transition-[transform,opacity] absolute top-1/2 right-3.5 -translate-y-1/2 z-20 cursor-pointer">
          <BiChevronRight className="text-4xl text-gray-100" />
        </div>

        <div className="absolute bottom-5 right-8 z-20 flex items-center gap-2">
          {data?.map((_, index) => (
            <div key={index} onClick={() => setCurrent(index)} className={`w-6 h-1 rounded-full hover:bg-white hover:w-8 ${index === current ? '!bg-[#539dfd] w-8 shadow-[0_0_10px_#539dfd]' : 'bg-[#fff5]'} transition-shadow cursor-pointer`} />
          ))}
        </div>
      </div>
    </>
  );
};
