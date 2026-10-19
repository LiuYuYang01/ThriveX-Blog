---
title: 缓存与构建
description: cacheComponents、CACHE_CLIENT_STALE 与 standalone 产物
order: 2
updated: 2026-10-16
---

`next.config.mjs` 开了 `cacheComponents`，页面里凡是异步取数的函数都显式声明了缓存策略，读懂这几个数字比读代码更重要。

## 三段缓存时间

| 变量 | 含义 | 开发环境 | 生产默认 |
| --- | --- | --- | --- |
| `stale` | 客户端缓存多久内不再请求服务端 | `1` | `CACHE_CLIENT_STALE`，默认 300 秒 |
| `revalidate` | 服务端缓存多久后重新取数 | `1` | 3600 秒 |
| `expire` | 兜底强制清除时间 | `1` | 86400 秒 |

开发环境三个值全是 1 秒，所以本地改完刷新就能看到效果，不用清缓存。

## 一个容易踩的坑

页面组件里调用 `await connection()` 的意思是「明确声明这里要实时渲染，不要走缓存」。`src/app/layout.tsx` 和大部分页面的 `generateMetadata` 都这么做，因为站点标题、SEO、公告这些内容要跟随后台配置实时变化。

```ts
export async function generateMetadata(): Promise<Metadata> {
  await connection();
  const data = await getWebConfigCacheAPI();
  // ...
}
```

反过来，文档页这种内容随代码走的页面不需要 `connection()`，它从磁盘读文件，走构建期静态生成。

## 产物形态

`output: 'standalone'` 会产出一个自带 `node_modules` 的最小运行目录，容器镜像因此小很多。构建完成后要执行一次 `postbuild`（`scripts/copy-standalone-assets.mjs`），把 `public` 和 `.next/static` 复制进 standalone 目录，否则容器里静态资源会 404。
