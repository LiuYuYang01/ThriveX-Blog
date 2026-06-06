import { Request } from '@/utils';
import { Wall, Cate } from '@/types/app/wall';

// 新增留言
export const addWallDataAPI = async (data: Wall) => {
    return await Request('POST', `/wall`, data);
}

// 获取留言分类列表
export const getCateListAPI = async () => {
    return await Request<Cate[]>('GET', `/wall/cate`);
}

// 获取当前分类中所有留言
export const getCateWallListAPI = async (cateId: number, params?: Page) => {
    return await Request<Paginate<Wall[]>>('GET', `/wall/cate/${cateId}`, { params: params ?? {} });
}