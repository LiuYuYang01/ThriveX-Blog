export interface RecordComment {
  id?: number;
  name: string;
  avatar: string;
  email: string;
  url: string;
  content: string;
  recordId?: number;
  recordContent?: string;
  commentId?: number;
  replyName?: string;
  status?: number;
  children?: RecordComment[];
  createTime: string;
  h_captcha_response?: string | null;
}

export interface RecordCommentFilterQueryParams extends QueryParams {
  status?: 0 | 1;
  recordId?: number;
  content?: string;
}
