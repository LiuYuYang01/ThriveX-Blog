/** @type {import('next').NextConfig} */

// 开发环境标志
const isDev = process.env.NODE_ENV === 'development';
// 如果是开发环境则无缓存，生产环境可通过 CACHE_CLIENT_STALE 配置，默认300秒（5分钟）
const clientStale = isDev ? 1 : Number(process.env.CACHE_CLIENT_STALE ?? 300);

const nextConfig = {
    // 关闭严格模式
    reactStrictMode: false,
    output: 'standalone',
    cacheComponents: true,
    cacheLife: {
        config: {
            // 客户端缓存时间：缓存期间内不会请求服务端
            stale: clientStale,
            // 服务端缓存时间：每3600秒后缓存失效，获取最新数据，如果没有过期情况下直接返回缓存的数据
            revalidate: isDev ? 1 : 3600,
            // 兜底删除：24小时后缓存强制清除
            expire: isDev ? 1 : 86400,
        },
        blog: {
            stale: clientStale,
            revalidate: isDev ? 1 : 3600,
            expire: isDev ? 1 : 86400,
        },
    },
    // React Compiler：自动 memo，减少 useMemo/useCallback 样板代码
    reactCompiler: true,
    // 启用 Turbopack 文件系统缓存，加快开发时候的构建速度
    experimental: {
        turbopackFileSystemCacheForDev: true,
    },
    // 配置图片来源
    images: {
        qualities: [75, 80, 90, 100],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
            {
                protocol: 'http',
                hostname: '**',
            }
        ],
    },
};

export default nextConfig;