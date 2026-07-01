'use client';

import { useEffect } from 'react';

import { getWebConfigDataAPI } from '@/api/config';
import { useAuthorStore, useConfigStore } from '@/stores';
import { Web, Theme, Other } from '@/types/app/config';
import { getAuthorDataAPI } from '@/api/user';

export default () => {
  const setAuthor = useAuthorStore((state) => state.setAuthor);

  // 获取作者信息
  const getAuthorData = async () => {
    const { data: user } = await getAuthorDataAPI();
    setAuthor(user);
  };

  const { setWeb, setTheme, setOther } = useConfigStore();

  // 获取项目配置
  const getConfigData = async () => {
    const webResponse = await getWebConfigDataAPI<{ value: Web }>('web');
    const web = webResponse?.data?.value as Web;
    setWeb(web);

    const themeResponse = await getWebConfigDataAPI<{ value: Theme }>('theme');
    const theme = themeResponse?.data?.value as Theme;
    setTheme(theme);

    const otherResponse = await getWebConfigDataAPI<{ value: Other }>('other');
    const other = otherResponse?.data?.value as Other;
    setOther(other);
  };

  useEffect(() => {
    getAuthorData();
    getConfigData();
  }, []);

  return null;
};
