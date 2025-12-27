export interface WebType {
  id: number;
  name: string;
  order: number;
  isAdmin: number;
}

export interface Web {
  id: number;
  title: string;
  description: string;
  email: string;
  image: string;
  url: string;
  rss: string;
  order: number;
  typeId: number;
  type: WebType;
  auditStatus: number;
  createTime?: string;
  turnstile_token: string;
}
