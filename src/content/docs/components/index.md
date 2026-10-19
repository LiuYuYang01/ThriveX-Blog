---
title: 组件
description: ThriveUI 组件库与主题变量
order: 3
updated: 2026-10-16
---

`src/ThriveUI` 是独立于业务的一套组件库，和文章系统、后台配置都没有耦合，可以整体搬到别的项目。

## 现有组件

Button、Modal、Pagination、ClientPagination、Switch、Spinner、Tooltip、Popover、Accordion、Checkbox、Progress、Tabs、Card、Radio、Snippet、TextField、Form、PhotoPreview。

统一从 `src/ThriveUI/index.ts` 按需导出，同时带上各自的 `xxxProps` 类型。

## 一个组件该长什么样

写新的 ThriveUI 组件时，遵守这几点：

- 组件名大驼峰，目录 `组件名/index.tsx`，样式放 `组件名/index.scss`
- props 用 `interface` 声明并随组件一起导出
- 不引入 `src/components` 或 `@/lib` 里的任何东西，保持单向依赖
- 主题色一律用 `var(--color-primary)` 之类的 CSS 变量，不要写死十六进制
