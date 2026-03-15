import { Request } from '@/utils'
import { Swiper } from '@/types/app/swiper'

// 获取轮播图
export const getSwiperDataAPI = (id?: number) => Request<Swiper>('GET', `/swiper/${id}`)

// 获取轮播图数据列表
export const getSwiperListAPI = () => Request<Swiper[]>('POST', `/swiper/list`)