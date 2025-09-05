import Image from 'next/image';
import IconCloud from '@/app/my/component/IconCloud';
import StudySvg from '@/assets/svg/other/study.svg';
import {getPageConfigDataByNameAPI} from '@/api/config';
import {Config} from '@/types/app/config';
import {MyData} from '@/types/app/my';


export default async () => {
    const {data} = (await getPageConfigDataByNameAPI('my')) || {data: {} as Config};
    const {  technology_stack } = data.value as MyData;
    return (
        <div className="flex flex-col tw_container bg-white dark:bg-black-b p-4 mb-5 tw_title">
            <div className="tw_title w-full dark:text-white">
                <Image src={StudySvg} alt="最新评论" width={33} height={23} className="mr-2"/> 学无止境
            </div>

            <div className="mt-4 flex justify-center w-5/6">
                <IconCloud iconSlugs={technology_stack}/>
            </div>
        </div>
    );
};
