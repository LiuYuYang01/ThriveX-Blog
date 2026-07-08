'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import NotFoundSvg from '@/assets/svg/other/404.svg';
import { Button } from '@/ThriveUI';

export default function NotFound() {
  const router = useRouter();

  return (
    <>
      <div className="absolute w-screen h-screen bg-white dark:bg-black-b z-999">
        <div className="w-full h-[73vh] mt-20">
          <div className="w-full h-full flex justify-center items-center flex-wrap">
            <Image src={NotFoundSvg} alt="404" className="w-full xl:w-140 lg:w-140 md:w-md" />

            <div className="xl:w-lg lg:w-104 md:w-[20rem] sm:text-start mx-4 text-center">
              <h1 className="text-5xl sm:text-8xl font-bold">404</h1>
              <h2 className="text-3xl sm:text-3xl font-bold my-4">Page not found</h2>
              <p>您正在访问的页面不存在或已被删除</p>
              <Button className="mt-6" color="primary" variant="shadow" onPress={() => router.push('/')}>
                返回首页
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
