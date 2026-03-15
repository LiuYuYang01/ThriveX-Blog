import { Request } from '@/utils';
import { Web, WebType } from '@/types/app/web';

// 获取网站类型列表
export const getWebTypeListAPI = async () => {
    return await Request<WebType[]>('GET', `/link/type`);
}

// 获取网站列表
export const getWebListAPI = async () => {
    return await Request<Web[]>('POST', `/link/list`, undefined, false);
}

// 新增网站
export const addWebDataAPI = async (data: Web) => {
    return await Request('POST', `/link`, data);
}