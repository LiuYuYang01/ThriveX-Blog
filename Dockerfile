# 使用国内代理 Node20 镜像
FROM docker.m.daocloud.io/library/node:20-alpine AS base
# 安装 Alpine兼容库
RUN apk add --no-cache libc6-compat
# 设置应用目录
WORKDIR /app
#关闭 Next.js 遥测
ENV NEXT_TELEMETRY_DISABLED=1
# 使用依赖安装阶段
FROM base AS deps
#复制依赖清单
COPY package.json package-lock.json ./
# 使用锁文件安装依赖
RUN npm ci
# 使用构建阶段
FROM base AS builder
#复制已安装依赖
COPY --from=deps /app/node_modules ./node_modules
#复制项目源码
COPY . .
# 接收接口地址
ARG NEXT_PUBLIC_PROJECT_API
# 写入接口地址
ENV NEXT_PUBLIC_PROJECT_API=$NEXT_PUBLIC_PROJECT_API
# 构建 standalone产物
RUN npm run build
# 使用运行阶段
FROM base AS runner
# 设置生产环境
ENV NODE_ENV=production
# 设置容器端口
ENV PORT=9001
#监听所有网卡
ENV HOSTNAME=0.0.0.0
# 创建运行用户组
RUN addgroup --system --gid 1001 nodejs
# 创建非 root 用户
RUN adduser --system --uid 1001 nextjs
# 创建 Next.js 缓存目录
RUN mkdir .next
# 授权缓存目录
RUN chown nextjs:nodejs .next
#复制 standalone 服务
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
#复制静态资源
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# 切换非 root 用户
USER nextjs
# 暴露应用端口
EXPOSE 9001
# 启动 standalone 服务
CMD ["node", "server.js"]
