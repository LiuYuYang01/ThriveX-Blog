/** @type {import('next').NextConfig} */
const nextConfig = {
    // 关闭严格模式
    reactStrictMode: false,
    output: 'standalone',
    cacheComponents: true,
    cacheLife: {
        config: {
            // 客户端缓存时间：每300秒后缓存失效，重新请求服务端
            stale: 300,
            // 服务端缓存时间：每3600秒后缓存失效，获取最新数据，如果没有过期情况下直接返回缓存的数据
            revalidate: 3600,
            // 兜底删除：24小时后缓存强制清除
            expire: 86400,
        },
        blog: {
            stale: 300,
            revalidate: 3600,
            expire: 86400,
        },
    },
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