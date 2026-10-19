---
title: Markdown 与小组件
description: 支持的语法，以及 tx-widget 自定义组件清单
order: 1
updated: 2026-10-16
---

文章和文档共用 `src/app/article/components/MD`，它基于 `react-markdown`，插件栈如下：

- `remark-gfm` — 表格、删除线、任务列表、自动链接
- `remark-math` + `rehype-katex` — 行内与块级公式
- `rehype-highlight` — 代码高亮，行内可直接点复制
- `rehype-raw` — 允许原始 HTML
- `rehype-callouts` — Obsidian 风格提示块
- `rehype-semantic-blockquotes` — 语义化引用

标题层级自动抽取成目录，表格、任务列表这些 GFM 语法都能直接用。

## tx-widget 小组件

除了标准语法，还有一个自定义的 `tx-widget` 代码块，用来插入富组件。管理端在编辑器里插入，博客端渲染成对应组件。

支持 17 种类型：

| 分类 | 类型 |
| --- | --- |
| 媒体 | `bilibili`、`youtube`、`netease`、`douyin`、`audio` |
| 排版 | `tabs`、`timeline`、`steps`、`collapse`、`comparison`、`article-ref` |
| 强调 | `cta`、`callout`、`link-card`、`rating`、`gallery`、`diff` |

调用形式是在代码块里写一段 JSON：

````text
```tx-widget
{
  "type": "steps",
  "items": [
    { "title": "拉取镜像" },
    { "title": "启动容器" }
  ]
}
```
````

`type` 之外的字段随类型变化，具体结构见 `src/app/article/components/MD/widgets/types.ts`。

## 让文章更好读

如果一段内容超过 10 行，代码块会折叠并显示「展开代码」，点击任意位置也可以展开——长代码不该把首屏推走。
