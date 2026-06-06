import { Request } from '@/utils';
import { Comment } from '@/types/app/comment';

// 新增评论
export const addCommentDataAPI = async (data: Comment) => {
    return await Request('POST', `/comment`, data);
}

// 获取评论列表
export const getCommentListAPI = async (params?: Page) => {
    return await Request<Paginate<Comment[]>>('GET', `/comment`, {
        params: params ?? {}
    });
}

// 获取当前文章中所有评论
export const getArticleCommentListAPI = async (articleId: number, params?: Page) => {
    return await Request<Paginate<Comment[]>>('GET', `/comment/article/${articleId}`, {
        params: params ?? {}
    });
}