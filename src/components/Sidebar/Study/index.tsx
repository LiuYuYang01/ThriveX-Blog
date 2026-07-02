import Image from 'next/image';
import IconCloud from '@/app/my/components/IconCloud';
import StudySvg from '@/assets/svg/other/study.svg';
import SidebarCard from '@/components/Sidebar/SidebarCard';
import { getPageConfigDataByNameAPI } from '@/api/config';
import { MyData } from '@/types/app/my';

export default async () => {
  const { data } = await getPageConfigDataByNameAPI('my');
  const { technology_stack } = data?.value as MyData;
  
  return (
    <SidebarCard
      title={<><Image src={StudySvg} alt="学无止境" width={33} height={23} className="mr-2" /> 学无止境</>}
      contentClassName="mt-4 flex justify-center w-5/6"
    >
      <IconCloud iconSlugs={technology_stack ?? []} />
    </SidebarCard>
  );
};
