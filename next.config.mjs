/** @type {import('next').NextConfig} */
const nextConfig = {
    // 关闭严格模式
    reactStrictMode: false,
    output: 'standalone',
    // 配置图片来源
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.liuyuyang.net',
            },
            {
                protocol: 'https',
                hostname: '**.liuyuyang.net',
            },
            {
                protocol: 'https',
                hostname: 'liuyuyang.net',
            },
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