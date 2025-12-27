export interface Cate {
  id: number;
  name: string;
  mark: string;
  order: number;
}

export interface Wall {
  id: number;
  name: string;
  cateId: number;
  cate: Cate;
  color: string;
  content: string;
  email: string;
  auditStatus: number;
  createTime: string;
  turnstile_token: string;
}
