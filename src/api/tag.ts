import { Request } from '@/utils'
import { Tag } from '@/types/app/tag'
import { Article } from '@/types/app/article';

// 获取标签列表
export const getTagListAPI = async () => {
    return await Request<Paginate<Tag[]>>('GET', `/tag`);
}

// 获取指定标签中的所有文章
export const getTagArticleListAPI = async (id: number, params?: Page) => {
    return await Request<Paginate<Article[]>>('GET', `/tag/${id}/articles`, { params: params ?? {} })
}