export interface Record {
    id?: number,
    content: string,
    images: string | string[],
    likeCount?: number,
    createTime?: string | Dayjs;
}