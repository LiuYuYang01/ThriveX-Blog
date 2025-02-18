# 使用官方的Node.js镜像作为基础镜像
FROM node:20-alpine

# # 设置工作目录
WORKDIR /thrive

# 配置 npm 镜像源
RUN npm config set registry https://registry.npmmirror.com

# 复制package.json和package-lock.json
COPY package*.json .

# 安装依赖
RUN npm install

# 复制所有文件到工作目录
COPY . .

# 构建Next.js应用
RUN npm run build

# 暴露应用运行的端口
EXPOSE 9001

# 启动Next.js应用
CMD ["npm", "start"]