import { Request } from '@/utils'
import { Record } from '@/types/app/record'

// 获取说说列表
export const getRecordListAPI = (data?: QueryData) => Request<Record[]>('POST', `/record/list`, {
    data: { ...data?.query },
})

// 分页获取说说列表
export const getRecordPagingAPI = (data?: QueryData) => Request<Paginate<Record[]>>('POST', `/record/paging?page=${data?.pagination?.page}&size=${data?.pagination?.size ? data.pagination?.size : 8}`)