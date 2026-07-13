import Link from 'next/link';
import Image from 'next/image';
import { getAuthorDataCacheAPI, getWebConfigCacheAPI } from '@/lib/config';
import OptimizedImage from '@/components/OptimizedImage';
import Tooltip from './components/Tooltip';
import ICPBeian from './components/ICPBeian';

import animals from './images/animals.webp';

export default async () => {
  const [user, web] = await Promise.all([getAuthorDataCacheAPI(), getWebConfigCacheAPI()]);

  return (
    <>
      <div className='sticky bottom-0 z-30 translate-y-[25px] flex justify-center w-full bg-cover bg-center after:content-[""] after:w-full after:h-[60%] after:absolute after:bottom-[25px] after:left-0 after:bg-[linear-gradient(to_top,#fff,transparent)] dark:after:bg-[linear-gradient(to_top,#2c333e,transparent)]'>
        <div className="flex justify-center lg:w-[950px] xl:w-[1200px] mx-auto">
          <Image src={animals} alt="动物" width={660.34} height={79.99} priority className="relative z-40 hidden md:block" />
        </div>
      </div>

      <div className="bg-white dark:bg-black-b border-t border-[#eee] dark:border-[#3d4654] px-10">
        <div className="flex justify-center items-center py-4">
          {user?.avatar ? (
            <OptimizedImage src={user.avatar} alt="作者头像" width={80} height={80} className="w-20 h-20 rounded-full mr-8 avatar-animation shadow-[5px_11px_30px_20px_rgba(255,255,255,0.1)] object-cover" />
          ) : null}
          <h2 className="w-[90%] xl:w-3/6 text-sm sm:text-base dark:text-[#8c9ab1] line-clamp-4">{web?.footer}</h2>
        </div>

        {/* ICP备案（支持普通ICP和萌ICP） */}
        <ICPBeian icp={web?.icp} />

        {/* 
            为了项目的生态越来越强大，作者在这里恳请大家保留 ThriveX 博客系统版权
            在项目 Star 突破 2K 后大家可自由选择删除 or 保留版权
        */}
        <div className="flex justify-center py-4 border-t border-[#eee] dark:border-[#3d4654]">
          <Tooltip content="一款免费、开源、年轻、高颜值的现代化博客管理系统">
            <div className="flex justify-center items-center space-x-3">
              <img src="https://bu.dusays.com/2025/12/04/6930fdfbda057.png" width={30} height={30} alt="ThriveX 博客管理系统" />
              <Link href="https://github.com/LiuYuYang01/ThriveX-Admin" target="_blank" className="dark:text-white hover:text-primary">
                {' '}
                基于开源项目 ThriveX 构建
              </Link>
            </div>
          </Tooltip>
        </div>
      </div>
    </>
  );
};
