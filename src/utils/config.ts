let configCache: Record<string, string> | null = null;

export const getApiUrl = (): string =>
  configCache?.NEXT_PUBLIC_PROJECT_API || process.env.NEXT_PUBLIC_PROJECT_API || '';

export const getCachingTime = (): number =>
  +(configCache?.NEXT_PUBLIC_CACHING_TIME || process.env.NEXT_PUBLIC_CACHING_TIME || 1);

export const loadRuntimeConfig = async (): Promise<void> => {
  if (typeof window === 'undefined') return;
  
  // 本地开发使用 .env / .env.local，线上使用 public/config.json
  if (process.env.NODE_ENV === 'development') return;

  try {
    const res = await fetch('/config.json', { cache: 'no-store' });
    if (res.ok) configCache = await res.json();
  } catch {
    // 忽略 config.json 加载失败，回退到环境变量
    console.error('加载配置失败');
  }
};
