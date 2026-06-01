export interface Cate {
    id?: number,
    name: string,
    mark: string,
    url: string,
    icon: string,
    level: number,
    type: 'cate' | 'nav',
    count: number,
    order: number,
    children: Cate[]
}

export interface CateArticleCount {
    name: string,
    count: number
}