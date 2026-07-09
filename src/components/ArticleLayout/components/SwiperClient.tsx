'use client';

import dynamic from 'next/dynamic';
import { Swiper as SwiperType } from '@/types/app/swiper';

const Swiper = dynamic(() => import('@/components/Swiper'), { ssr: false });

export default ({ data }: { data: SwiperType[] }) => <Swiper data={data} />;
