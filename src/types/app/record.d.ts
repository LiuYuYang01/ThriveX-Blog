export interface Record {
    id?: number,
    content: string,
    images: string | string[],
    likeCount?: number,
    mood?: string,
    location?: string,
    createTime?: string | Dayjs;
}