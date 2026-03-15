import { Request } from '@/utils'
import { Tag } from '@/types/app/tag'
import { Article } from '@/types/app/article';

// 获取标签列表
export const getTagListAPI = async () => {
    return await Request<Tag[]>('POST', `/tag/list`);
}

// 获取标签列表+文章数量统计
export const getTagListWithArticleCountAPI = async () => {
    return await Request<Tag[]>('GET', `/tag/article/count`);
}

// 获取指定标签中的所有文章
export const getTagArticleListAPI = async (id: number, page: number) => {
    return await Request<Paginate<Article[]>>('GET', `/article/tag/${id}?page=${page}`)
}

// 分页获取标签数据
export const getTagPagingAPI = async (data: QueryData) => {
    return await Request<Paginate<Tag[]>>('POST', `/tag/paging?page=${data.pagination?.page}&&size=8`, data.query);
}