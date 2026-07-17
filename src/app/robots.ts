import { MetadataRoute } from 'next';
import { connection } from 'next/server';
import { getWebConfigCacheAPI } from '@/lib/config';

export default async function robots(): Promise<MetadataRoute.Robots> {
  await connection();
  const webConfig = await getWebConfigCacheAPI();

  const baseUrl = webConfig?.url || 'https://liuyuyang.net';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
