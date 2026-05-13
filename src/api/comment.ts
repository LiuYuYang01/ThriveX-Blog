import { Request } from '@/utils';
import { Comment } from '@/types/app/comment';

// 新增评论
export const addCommentDataAPI = async (data: Comment) => {
    return await Request('POST', `/comment`, data);
}


// 获取评论列表
export const getCommentListAPI = () => Request<Paginate<Comment[]>>('GET', `/comment`)

// 获取当前文章中所有评论
export const getArticleCommentListAPI = async (articleId: number, paginate: Page) => {
    return await Request<Paginate<Comment[]>>('POST', `/comment/article/${articleId}?page=${paginate.page}&pageSize=${paginate.size}`);
}