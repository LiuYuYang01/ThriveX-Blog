import { Request } from '@/utils';
import { Wall, Cate } from '@/types/app/wall';

// 新增留言
export const addWallDataAPI = async (data: Wall) => {
    return await Request('POST', `/wall`, data);
}

// 获取留言列表
export const getWallListAPI = async () => {
    return await Request<Paginate<Wall[]>>('POST', `/wall/paging`);
}

// 获取留言分类列表
export const getCateListAPI = async () => {
    return await Request<Cate[]>('GET', `/wall/cate`);
}

// 获取当前分类中所有留言
export const getCateWallListAPI = async (cateId: number, page: number, size = 8) => {
    return await Request<Paginate<Wall[]>>('POST', `/wall/cate/${cateId}?page=${page}&size=${size}`, undefined, false);
}