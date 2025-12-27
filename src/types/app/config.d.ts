export interface Social {
  name: string;
  url: string;
}

// 系统信息
export interface System {
  osName: string;
  osVersion: string;
  totalMemory: number;
  availableMemory: number;
  memoryUsage: number;
}

// 网站信息
export interface Web {
  url: string;
  title: string;
  subhead: string;
  favicon: string;
  description: string;
  keyword: string;
  footer: string;
  icp: string;
  create_time: number;
}

export type ArticleLayout = 'classics' | 'card' | 'waterfall' | '';
export type RightSidebar = 'author' | 'hotArticle' | 'randomArticle' | 'newComments' | 'runTime' | 'study';

// 主题配置
export interface Theme {
  is_article_layout: string;
  right_sidebar: RightSidebar[];
  light_logo: string;
  dark_logo: string;
  swiper_image: string;
  swiper_text: string[];
  reco_article: number[];
  social: Social[];
  covers: string;
  record_name: string;
  record_info: string;
}

// 其他配置
export interface Other {
  baidu_token: string;
  hcaptcha_key: string;
  turnstile_site_key: string;
}

export type EnvConfigName = 'baidu_statis' | 'email' | 'gaode_map' | 'gaode_coordinate';

export interface Config {
  id: string;
  name: string;
  value: any;
  notes: string;
}
