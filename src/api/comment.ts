import { Request } from '@/utils';
import { Comment } from '@/types/app/comment';

// 新增评论
export const addCommentDataAPI = async (data: Comment) => {
    return await Request('POST', `/comment`, data);
}

// 获取评论列表
export const getCommentListAPI = async () => {
    return await Request<Comment[]>('POST', `/comment/list`);
}

// 分页获取评论数据
export const getCommentPagingAPI = async () => {
    return await Request<Paginate<Comment[]>>('POST', `/comment/paging`);
}

// 获取当前文章中所有评论
export const getArticleCommentListAPI = async (articleId: number, paginate: Page) => {
    return await Request<Paginate<Comment[]>>('POST', `/comment/article/${articleId}?page=${paginate.page}&pageSize=${paginate.size}`);
}