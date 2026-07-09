/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === 'development';

const nextConfig = {
    // 关闭严格模式
    reactStrictMode: false,
    output: 'standalone',
    cacheComponents: true,
    cacheLife: {
        config: {
            // 客户端缓存时间：每300秒后缓存失效，重新请求服务端
            // 开发环境极短缓存，生产环境正常缓存
            stale: isDev ? 1 : 300,
            // 服务端缓存时间：每3600秒后缓存失效，获取最新数据，如果没有过期情况下直接返回缓存的数据
            revalidate: isDev ? 1 : 3600,
            // 兜底删除：24小时后缓存强制清除
            expire: isDev ? 1 : 86400,
        },
        blog: {
            stale: isDev ? 1 : 300,
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