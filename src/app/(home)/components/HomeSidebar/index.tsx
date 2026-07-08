import Sidebar from '@/components/Sidebar';
import { getThemeConfigCacheAPI } from '@/lib/theme';

export default async () => {
  const theme = await getThemeConfigCacheAPI();

  return (
    <Sidebar
      sidebar={theme?.right_sidebar ?? []}
      social={theme?.social ?? []}
      recoArticleIds={theme?.reco_article ?? []}
    />
  );
};
