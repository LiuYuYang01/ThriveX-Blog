import { Cate } from './cate'
import { Tag } from './tag'

export type Status = 'show' | 'no_home' | 'hide'

export interface Config {
    id?: number,
    articleId?: number,
    top: number,
    status: Status,
    isEncrypt: boolean,
    isDel: number,
    /** 访问密码：服务端不再下发明文，仅提交时携带 */
    password?: string,
    /** 服务端只读标记：是否已设置过访问密码 */
    hasPassword?: boolean
}

export interface Article {
    id?: number,
    title: string,
    description: string,
    content: string,
    cover: string,
    cateIds: string,
    cateList: Cate[]
    tagIds: string,
    tagList: Tag[]
    view?: number
    comment?: number,
    likeCount?: number,
    shareCount?: number,
    isTop?: boolean,
    config: Config,
    prev: { id: number, title: string },
    next: { id: number, title: string },
    createTime: string,
}