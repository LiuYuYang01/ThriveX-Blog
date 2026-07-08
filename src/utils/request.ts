import { params } from './url';

export const Request = async <T>(method: string, api: string, data?: any) => {
    const url = process.env.NEXT_PUBLIC_PROJECT_API || '';
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
        return { code: 500, message: 'Request failed', data: {} as T };
    }
};
