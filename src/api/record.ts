import { Request } from '@/utils'
import { Record } from '@/types/app/record'

// 分页获取说说列表
export const getRecordListAPI = (params?: Page) => Request<Paginate<Record[]>>('GET', `/record`, { params })

// 递增说说点赞数（count 为本次累计增量，由前端防抖合并后提交）
export const likeRecordAPI = (id: number, count: number) =>
  Request<number>('POST', `/record/${id}/like`, { count }, false)
