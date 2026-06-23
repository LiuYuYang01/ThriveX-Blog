import { Request } from '@/utils';
import { RecordComment } from '@/types/app/recordComment';

// 新增说说评论
export const addRecordCommentDataAPI = async (data: RecordComment) => {
  return await Request('POST', `/record/comment`, data);
};

// 获取指定说说下的评论
export const getRecordCommentListAPI = async (recordId: number, params?: Page) => {
  return await Request<Paginate<RecordComment[]>>('GET', `/record/${recordId}/comment`, {
    params: params ?? {},
  });
};
