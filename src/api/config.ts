import { Request } from '@/utils';
import { Config, PublicConfig } from '@/types/app/config';

// 获取网站配置
export const getWebConfigDataAPI = <T>(name: string) => Request<T>('GET', `/web_config/name/${name}`)

// 获取高德地图配置
export const getGaodeMapConfigDataAPI = () => Request('GET', `/env_config/gaode_map`)

// 获取公开环境配置
export const getPublicConfigDataAPI = () => Request<PublicConfig>('GET', `/env_config/public_config`)

// 根据名称获取页面配置
export const getPageConfigDataByNameAPI = (name: string) => Request<Config>('GET', `/page_config/name/${name}`)
