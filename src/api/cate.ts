import { Article } from '@/types/app/article'
import { Cate, CateArticleCount } from '@/types/app/cate'
import { Request } from '@/utils';

// 获取分类列表
export const getCateListAPI = async () => {
    return await Request<Paginate<Cate[]>>('GET', '/cate?pattern=tree')
}

// 获取指定分类中的所有文章
export const getCateArticleListAPI = async (id: number, page: number) => {
    return await Request<Paginate<Article[]>>('GET', `/article/cate/${id}?page=${page}`)
}

// 获取每个分类的文章数量
export const getCateArticleCountAPI = async () => {
    return await Request<CateArticleCount[]>('GET', '/cate/article/count')
}