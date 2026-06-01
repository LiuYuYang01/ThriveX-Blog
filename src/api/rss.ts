import { Rss } from '@/types/app/rss';
import { Request } from '@/utils';

// 获取订阅的内容
export const getRssListAPI = (params?: Page) => Request<Paginate<Rss[]>>('GET', `/rss`, {
    params: params ?? {}
})