import { params } from './url';
import { getApiUrl, getCachingTime } from './config';

export const Request = async <T>(method: string, api: string, data?: any, caching = true) => {
    const url = getApiUrl();
    const cachingTime = getCachingTime();
    
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
