export interface Record {
    id?: number,
    content: string,
    images: string | string[],
    video?: string,
    likeCount?: number,
    mood?: string,
    location?: string,
    top?: boolean,
    createTime?: string | Dayjs;
}