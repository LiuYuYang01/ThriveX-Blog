import { Request } from '@/utils';
import { Article } from '@/types/app/article';

// 获取指定文章数据
export const getArticleDataAPI = async (id: number, password?: string) => {
    return await Request<Article>('GET', `/article${!password ? `/${id}` : `/${id}?password=${password}`}`);
}

//  获取文章列表
export const getArticlePagingAPI = async (params?: Page & { key?: string }) => {
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