import { Request } from '@/utils'
import { Footprint } from '@/types/app/footprint'

// 获取足迹
export const getFootprintDataAPI = (id?: number) => Request<Footprint>('GET', `/footprint/${id}`)

// 获取足迹列表
export const getFootprintListAPI = () => Request<Footprint[]>('POST', '/footprint/list');