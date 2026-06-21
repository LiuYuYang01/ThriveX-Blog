import { Request } from '@/utils';
import { Config, PageConfig } from '@/types/app/config';

// 获取网站配置
export const getWebConfigDataAPI = <T>(name: string) => Request<T>('GET', `/web_config/name/${name}`)

// 根据名称获取页面配置
export const getPageConfigDataByNameAPI = (name: string) => Request<PageConfig>('GET', `/page_config/name/${name}`)

// 获取公开配置
export const getPublicConfigAPI = () => Request<Config>('GET', '/env_config/public_config');