import Image from 'next/image';
import StudySvg from '@/assets/svg/other/study.svg';
import SidebarCard from '@/components/Sidebar/SidebarCard';
import IconCloudClient from '@/components/Sidebar/Study/components/IconCloudClient';
import { getPageConfigCacheAPI } from '@/lib/config';
import { MyData } from '@/types/app/my';
export default async () => {
  const { data } = await getPageConfigCacheAPI('my');
  const { technology_stack } = data?.value as MyData;
  
  return (
    <SidebarCard
      title={<><Image src={StudySvg} alt="学无止境" width={33} height={23} className="mr-2" /> 学无止境</>}
      contentClassName="mt-4 flex justify-center"
    >
      <IconCloudClient iconSlugs={technology_stack ?? []} />
    </SidebarCard>
  );
};
