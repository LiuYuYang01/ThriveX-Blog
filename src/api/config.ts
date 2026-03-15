import { Request } from '@/utils';
import { Config } from '@/types/app/config';

// 获取网站配置
export const getWebConfigDataAPI = <T>(name: string) => Request<T>('GET', `/web_config/name/${name}`)

// 修改网站配置
export const editWebConfigDataAPI = (name: string, data: object) => Request<Config>('PATCH', `/web_config/json/name/${name}`, { data })


// 获取高德地图配置
export const getGaodeMapConfigDataAPI = () => Request('GET', `/env_config/gaode_map`)

// 根据名称获取页面配置
export const getPageConfigDataByNameAPI = (name: string) => Request<Config>('GET', `/page_config/name/${name}`)