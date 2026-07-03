import { Cate } from './cate'
import { Tag } from './tag'

export type Status = 'show' | 'no_home' | 'hide'

export interface Config {
    id?: number,
    articleId?: number,
    top: number,
    status: Status,
    isEncrypt: number,
    isDel: number,
    password: string
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
    config: Config,
    prev: { id: number, title: string },
    next: { id: number, title: string },
    createTime: string,
}