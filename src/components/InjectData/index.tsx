'use client';

import { useEffect } from 'react';

import { getPublicConfigAPI, getWebConfigDataAPI } from '@/api/config';
import { useAuthorStore, useConfigStore } from '@/stores';
import { Web, Theme } from '@/types/app/config';
import { getAuthorDataAPI } from '@/api/user';
import { loadRuntimeConfig } from '@/utils/config';

export default () => {
  const setAuthor = useAuthorStore((state) => state.setAuthor);

  const getAuthorData = async () => {
    const { data: user } = await getAuthorDataAPI();
    setAuthor(user);
  };

  const { setWeb, setTheme, setConfig } = useConfigStore();

  const getConfigData = async () => {
    const webResponse = await getWebConfigDataAPI<{ value: Web }>('web');
    const web = webResponse?.data?.value as Web;
    setWeb(web);

    const themeResponse = await getWebConfigDataAPI<{ value: Theme }>('theme');
    const theme = themeResponse?.data?.value as Theme;
    setTheme(theme);

    const { data } = await getPublicConfigAPI();
    setConfig(data);
  };

  useEffect(() => {
    loadRuntimeConfig().then(() => {
      getAuthorData();
      getConfigData();
    });
  }, []);

  return null;
};
