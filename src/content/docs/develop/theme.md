---
title: 主题与样式
description: 颜色变量、字体与切换过渡
order: 2
updated: 2026-10-16
---

## 颜色

全站颜色都是 Tailwind 4 的 `@theme` 里定义的 CSS 变量，亮色写在 `:root`，暗色覆盖在 `.dark` 下：

| 变量 | 亮色 | 暗色 | 用途 |
| --- | --- | --- | --- |
| `--color-primary` | `#539dfd` | 同左 | 强调色 |
| `--color-background` | `#f9f9f9` | `#232931` | 页面底色 |
| `--color-surface` | `#ffffff` | `#2c333e` | 卡片、面板 |
| `--color-foreground` | `#333333` | `#e5e7eb` | 正文 |
| `--color-border` | `#eeeeee` | `#4e5969` | 描边 |

暗色模式靠 `@custom-variant dark (&:where(.dark, .dark *))` 开启，写 `dark:` 前缀即可。

> 按项目规范，颜色和背景色不要加过渡动画，否则切换主题时会出现拖影。

## 字体

`layout.tsx` 里用 `next/font/local` 加载了 LXGW WenKai（霞鹜文楷），挂在 `<html>` 上，全站生效。不要在子组件里另设字体栈。

## 主题切换

`src/components/ThemeTransition` 负责切换动效（星空、山脊、多层天体），切换逻辑走 `src/utils/themeTransition.ts`。业务代码里要用程序化切换，调这个工具函数，不要直接写 `classList.toggle('dark')`，否则会绕过过渡。
