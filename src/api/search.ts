import { Request } from '@/utils';
import { SearchResult } from '@/types/app/search';

// 统一搜索：文章按标题、闪念按内容
export const getSearchAPI = async (params: { keyword: string; limit?: number }) => {
    return await Request<SearchResult>('GET', `/search`, { params });
}
