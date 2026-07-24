import { params } from './url';

const getApiUrl = () =>
    typeof window === 'undefined'
        ? process.env.PROJECT_API_INTERNAL || process.env.NEXT_PUBLIC_PROJECT_API || ''
        : process.env.NEXT_PUBLIC_PROJECT_API || '';

export const Request = async <T>(method: string, api: string, data?: any) => {
    const url = /^https?:\/\//.test(api) ? '' : getApiUrl();
    const query = params(data?.params ?? {});

    try {
        const res = await fetch(`${url}${api}${query}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            ...(method === 'POST' ? { body: JSON.stringify(data ?? {}) } : {}),
            cache: 'no-store',
        });

        return res?.json() as Promise<ResponseData<T>>;
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            throw error;
        }
        console.log('捕获到异常：', error);
        throw error;
    }
};
