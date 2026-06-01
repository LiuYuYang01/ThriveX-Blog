import { Request } from '@/utils'
import { Record } from '@/types/app/record'

// 分页获取说说列表
export const getRecordListAPI = (params?: Page) => Request<Paginate<Record[]>>('GET', `/record`, { params })
