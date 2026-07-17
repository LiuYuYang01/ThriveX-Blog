import { Metadata } from 'next';
import { connection } from 'next/server';
import { getPageConfigCacheAPI } from '@/lib/config';
import { Resume } from '@/types/app/resume';
import ResumePage from './resume';

export async function generateMetadata(): Promise<Metadata> {
  await connection();
  const { data } = await getPageConfigCacheAPI('resume');
  const value = data?.value as Resume | undefined;
  const name = value?.personalInfo?.name || '匿名用户';
  const title = value?.personalInfo?.title || '前端开发工程师';

  return {
    title: `${name} - ${title}`,
    description: `${name} - ${title} 的个人简历`,
  };
}

export default async () => {
  await connection();
  const { data } = await getPageConfigCacheAPI('resume');
  return <ResumePage data={data?.value} />;
};
