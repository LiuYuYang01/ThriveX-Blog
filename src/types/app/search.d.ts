// 统一搜索结果：文章按标题命中，闪念按内容命中
export interface SearchArticleItem {
    id: number,
    title: string
}

export interface SearchRecordItem {
    id: number,
    snippet: string
}

export interface SearchResult {
    articles: SearchArticleItem[],
    records: SearchRecordItem[]
}
