import { Request } from '@/utils';
import { Comment } from '@/types/app/comment';

// 新增评论
export const addCommentDataAPI = async (data: Comment) => {
    return await Request('POST', `/comment`, data);
}

// 获取评论列表
export const getCommentListAPI = async (paginate?: Page) => {
    return await Request<Paginate<Comment[]>>('GET', `/comment`, {
        params: paginate ? {
            pageNum: paginate.pageNum ?? 1,
            pageSize: paginate.pageSize ?? 5,
        } : {}
    });
}

// 获取当前文章中所有评论
export const getArticleCommentListAPI = async (articleId: number, paginate?: Page) => {
    return await Request<Paginate<Comment[]>>('GET', `/comment/article/${articleId}`, {
        params: paginate ? {
            pageNum: paginate.pageNum,
            pageSize: paginate.pageSize,
        } : {}
    });
}