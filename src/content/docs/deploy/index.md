---
title: 部署
description: 用 docker-compose 跑起完整的三端环境
order: 1
updated: 2026-10-16
---

仓库根目录的 `docker-compose.yml` 编排了四个服务，这是最省事的启动方式：

| 服务 | 容器名 | 端口 | 说明 |
| --- | --- | --- | --- |
| `mysql` | `thrivex-mysql` | `3307:3306` | 数据库，端口故意对外偏移，避开本机已有的 3306 |
| `thrivex-server` | `thrivex-server` | `9003:9003` | Spring Boot 后端 |
| `thrivex-blog` | `thrivex-blog` | `9001:9001` | Next.js 前台 |
| `thrivex-admin` | `thrivex-admin` | `9002:80` | 管理端，构建产物是静态文件，容器内跑 80 |

## 启动顺序是硬约束

`thrivex-server` 依赖 `mysql` 通过健康检查，`thrivex-blog` 和 `thrivex-admin` 又依赖 `thrivex-server`。首次启动时 MySQL 要执行 `ThriveX-Server/ThriveX.sql` 建表，后端健康检查给了 60 秒 `start_period`，不要在这个窗口内手动重启下游容器。

## 初次启动

`docker-compose.yml` 里每一项配置都写了默认值，不放 `.env` 也能直接跑；需要改密码或站点地址时再放：

```bash
# .env，按需覆盖默认值
MYSQL_ROOT_PASSWORD=你的密码
MYSQL_DATABASE=ThriveX
NEXT_PUBLIC_PROJECT_API=https://你的域名/api

docker compose up -d --build
```

起来之后先访问 `http://localhost:9002`，走一遍初始化向导创建管理员账号。后端提供了初始化状态接口，前端会在检测到系统未初始化时自动跳转到向导页。

> 数据库密码等敏感配置一律走环境变量，不要写进代码里提交上去。
