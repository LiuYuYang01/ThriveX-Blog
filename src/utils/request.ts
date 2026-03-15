import { params } from './url';

// 最新调整：在 .env 文件中配置项目后端 API 地址
const url = process.env.NEXT_PUBLIC_PROJECT_API
// 配置页面缓存时间
const cachingTime = +process.env.NEXT_PUBLIC_CACHING_TIME!

export const Request = async <T>(method: string, api: string, data?: any, caching = true) => {
    const query = params(data?.params ?? {});
    
    try {
        const res = await fetch(`${url}${api}${query}`, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            [method === 'POST' ? 'body' : '']: JSON.stringify(data ? data : {}),
            next: { revalidate: caching ? cachingTime : 1 }
        })

        return res?.json() as Promise<ResponseData<T>>;
    } catch (error) {
        console.log('捕获到异常：', error);
        return { code: 500, message: 'Request failed', data: {} as T };
    }
}
