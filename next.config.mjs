/** @type {import('next').NextConfig} */
const nextConfig = {
  // 关闭严格模式
  reactStrictMode: false,
  // 配置图片来源
  images: {
    domains: [
      'res.liuyuyang.net',
      'q1.qlogo.cn',
      'bu.dusays.com',
      'p2.music.126.net',
      'p1.music.126.net'
    ]
  }
}

export default nextConfig
