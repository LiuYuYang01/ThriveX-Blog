'use client';

import { Button } from '@/ThriveUI';
import OptimizedImage from '@/components/OptimizedImage';
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
        <div onClick={handlePrev} className="flex justify-center items-center w-11 h-11 bg-[#fff3] rounded-full hover:bg-transparent hover:backdrop-blur-md hover:scale-110 group-hover:opacity-100 opacity-0 transition-[opacity,scale] duration-300 ease-out absolute top-1/2 left-3.5 -translate-y-1/2 z-20 cursor-pointer">
          <BiChevronLeft className="text-4xl text-gray-100" />
        </div>

        {data?.map((item, index) => (
          <div key={index} className={`absolute top-0 left-0 w-full h-full ${index === current ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
            <OptimizedImage src={item.image} alt={item.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 1200px" />

            <div className="flex flex-col absolute bottom-6 left-5 sm:bottom-8 sm:left-8 z-10 gap-3 animation_bottom max-w-[calc(100%-2.5rem)]">
              <h2 className="text-white text-lg sm:text-xl lg:text-2xl font-bold text_shadow line-clamp-2">{item.title}</h2>
              <Button
                color="primary"
                variant="shadow"
                size="sm"
                endContent={<BiChevronRight className="text-lg shrink-0" />}
                className="w-fit whitespace-nowrap px-4 hover:translate-x-1 transition-[translate] duration-200 ease-out"
                onPress={() => window.open(item.url, '_blank')}
              >
                立刻围观
              </Button>
            </div>
          </div>
        ))}

        <div onClick={handleNext} className="flex justify-center items-center w-11 h-11 bg-[#fff3] rounded-full hover:bg-transparent hover:backdrop-blur-md hover:scale-110 group-hover:opacity-100 opacity-0 transition-[opacity,scale] duration-300 ease-out absolute top-1/2 right-3.5 -translate-y-1/2 z-20 cursor-pointer">
          <BiChevronRight className="text-4xl text-gray-100" />
        </div>

        <div className="absolute bottom-5 right-8 z-20 flex items-center gap-2">
          {data?.map((_, index) => (
            <div
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-1 rounded-full cursor-pointer transition-[width,background-color,box-shadow] duration-300 ease-out hover:bg-white hover:w-8 ${
                index === current ? 'w-8 bg-primary! shadow-[0_0_10px_#539dfd]' : 'w-6 bg-[#fff5]'
              }`}
            />
          ))}
        </div>
      </div>
    </>
  );
};
