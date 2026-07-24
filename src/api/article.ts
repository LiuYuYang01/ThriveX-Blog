import { Request } from '@/utils';
import { Article } from '@/types/app/article';

// 获取指定文章数据
export const getArticleDataAPI = async (id: number, password?: string) => {
    return await Request<Article>('GET', `/article${!password ? `/${id}` : `/${id}?password=${password}`}`);
}

// 获取文章列表（title 按标题模糊搜索）
export const getArticlePagingAPI = async (params?: Page & { title?: string }) => {
    return await Request<Paginate<Article[]>>('GET', `/article`, {
        params: params ?? {}
    });
}

// 获取随机文章列表
export const getRandomArticleListAPI = async () => {
    return await Request<Article[]>('GET', '/article/random');
}

// 获取推荐文章列表
export const getRecommendedArticleListAPI = async () => {
    return await Request<Article[]>('GET', '/article/hot');
}

// 递增浏览量
export const recordViewAPI = async (id: number) => {
    return await Request<void>('GET', `/article/view/${id}`);
}

// 递增文章点赞数（count 为本次累计增量，由前端防抖合并后提交）
export const likeArticleAPI = (id: number, count: number) =>
    Request<number>('POST', `/article/${id}/like`, { count })

// 递增文章分享数
export const shareArticleAPI = (id: number, count: number) =>
    Request<number>('POST', `/article/${id}/share`, { count })