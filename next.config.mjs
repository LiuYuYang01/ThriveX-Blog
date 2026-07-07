/** @type {import('next').NextConfig} */
const nextConfig = {
    // 关闭严格模式
    reactStrictMode: false,
    output: 'standalone',
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