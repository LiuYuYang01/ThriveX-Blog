---
title: 开发
description: 目录约定、请求封装与主题变量
order: 2
updated: 2026-10-16
---

这一节写的是在这个仓库里改代码时需要遵守的约定。

## 目录

- `src/app` — 路由。页面内私有组件放 `src/app/**/components`
- `src/components` — 跨页面复用的公共组件
- `src/ThriveUI` — ThriveUI 组件库，独立于业务
- `src/lib` — 服务端数据获取，统一在服务端直连后端
- `src/api` — 客户端请求封装
- `src/types` — 类型声明，和 `src/api` 对应维护
- `src/stores` — zustand 全局状态
- `src/utils` — 纯工具函数

导入统一用 `@/` 别名指向 `src`。

## 数据获取分两段

`src/lib` 里的函数跑在服务端，可以直接读后端；`src/api` 里的函数跑在浏览器，走 `src/utils/request.ts` 的封装。页面里不要裸用 axios，也不要在 Server Component 里调 `src/api`。
