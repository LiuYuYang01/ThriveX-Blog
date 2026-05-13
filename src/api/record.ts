import { Request } from '@/utils'
import { Record } from '@/types/app/record'

// 分页获取说说列表
export const getRecordPagingAPI = (params?: Page) => Request<Paginate<Record[]>>('GET', `/record`, { params })

// export const getRecordPagingAPI = (data?: QueryData) => Request<Paginate<Record[]>>('GET', `/record?page=${data?.pagination?.page}&size=${data?.pagination?.size ? data.pagination?.size : 8}`)