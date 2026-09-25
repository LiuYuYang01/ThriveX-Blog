export interface Social {
    name: string;
    url: string;
}

// 系统信息
export interface System {
    osName: string,
    osVersion: string,
    totalMemory: number,
    availableMemory: number,
    memoryUsage: number
}

// 网站信息
export interface Web {
    url: string,
    title: string,
    subhead: string,
    favicon: string,
    description: string,
    keyword: string,
    footer: string,
    icp: string,
    create_time: number,
}

export type ArticleLayout = 'classics' | 'card' | 'waterfall' | ''
export type RightSidebar = 'author' | 'hotArticle' | 'randomArticle' | 'newComments' | 'runTime' | 'study'
// 文章头图风格：slide 轮播大图 / editorial 杂志编辑风
export type ArticleHeroStyle = 'slide' | 'editorial'
// 菜单栏布局：classic 经典通栏 / capsule 悬浮胶囊
export type HeaderLayout = 'classic' | 'capsule'

// 主题配置
export interface Theme {
    is_article_layout: string,
    article_hero?: ArticleHeroStyle,
    // 菜单栏布局，默认 classic
    header_layout?: HeaderLayout,
    right_sidebar: RightSidebar[],
    light_logo: string,
    dark_logo: string,
    swiper_image: string,
    swiper_text: string[],
    reco_article: number[],
    social: Social[],
    covers: string,
    record_name: string,
    record_avatar?: string,
    record_cover?: string,
    record_info?: string,
    // 闪念展现模式：modal 弹窗 / page 页面
    record_mode?: 'modal' | 'page'
}

// 其他配置
export interface Other {
    baidu_token: string,
    hcaptcha_key: string,
}


export type EnvConfigName = 'baidu_statis' | 'email' | 'gaode_map' | 'gaode_coordinate'

export interface EnvConfigKey {
    key: string
}

// 公开环境配置
export interface PublicConfig {
    baidu_statis_key: EnvConfigKey | null
    hcaptcha_key: EnvConfigKey | null
    gaode_map_kay: EnvConfigKey | null
}

export interface Config {
    id: string,
    name: string,
    value: any,
    notes: string
}