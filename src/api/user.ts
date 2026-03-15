import { User } from '@/types/app/user'
import { Request } from '@/utils'

// 获取作者信息
export const getAuthorDataAPI = async () => {
    return await Request<User>('GET', '/user/author')
}