import { params } from './url';

export const Request = async <T>(method: string, api: string, data?: any, caching = true) => {
    const url = process.env.NEXT_PUBLIC_PROJECT_API || '';
    const cachingTime = +(process.env.NEXT_PUBLIC_CACHING_TIME || 1);
    
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
