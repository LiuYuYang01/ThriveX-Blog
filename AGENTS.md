# 项目规则

## 核心技术栈

React 19、TypeScript、TailwindCSS 4.1、antd: 5.27.1

参考当前目录中的 `package.json` 文件，要求生成的代码与项目已有的技术栈保持一致。

## 代码规范

使用最小化的代码完成功能

### 代码质量

注释该有的也要有，要求简单明了


### 组件方面

一、不要过度封装组件，父子组件关联性小情况下可以拆分，但关联性强，需要把很多值传来传去的情况下尽可能不要封装

二、公共组件放在 `src\components`，其他组件比如页面组件放在当前目录的 `components` 下，比如部门页面：`src\pages\dict` 只在当前页面用到的组件放在 `src\pages\dict\components` 下

三、组件命名语义化并采用大驼峰命名法：`DictUserList`
组件格式：`DictUserList/index.tsx`，这样的话在对组件进行扩展时，比如样式可以写在：`DictUserList/index.scss`

## UI

基于当前项目UI风格以及主要颜色，保持一致的 `UI` 设计，不要擅做主张。能被点击的东西，比如按钮都加上 `TailwindCSS` 的 `cursor-pointer`

## 图标

所有图标采用 `react-icons` 库中的图标组件

## 目录结构约定

- `src/pages`：页面（路由入口），页面内私有组件放 `src/pages/**/components`
- `src/components`：跨页面复用的公共组件
- `src/api`：接口封装（按业务拆分文件）
- `src/types`：接口/业务相关类型声明（与 `src/api` 对应维护）
- `src/utils`：通用工具与请求封装（优先复用现有工具）
- `src/stores`：全局状态（zustand），模块放 `src/stores/modules`
- `src/hooks`：自定义 hooks（复用优先于新增）
- `src/i18n`：多语言资源与初始化
- `src/styles`：全局样式

## 编码规范

- 默认使用 TypeScript，尽量避免 `any`；
- 新增代码不用写注释，除非逻辑过于复杂或者命名无法表达清楚时
- 导入路径优先使用别名 `@/`（保持与项目现状一致）

## UI 与样式

- 组件优先使用 antd（5.x），布局与细节样式优先使用 TailwindCSS（4.x）不要使用废弃或旧的代码
- 避免随意新增全局样式；确需全局覆盖时集中维护在 `src/styles/global.css`
- 颜色/字号/间距优先沿用现有页面与 antd 规范，保持统一的交互与视觉

## 路由与页面接入

- 新增页面路由统一在 `src/components/RouterList/index.tsx` 注册
- 如页面需要标题同步/权限校验，保持与现有 `pageTitleMap`、`allowedPaths` 等逻辑一致

## 请求与类型

- 请求统一复用 `src/utils/request.ts` 的封装（不要直接在页面里裸用 axios）
- 新增接口优先添加到 `src/api/**.ts`，并在 `src/types/**.d.ts` 补充对应类型
- 页面内对接口数据做展示前，优先在请求后做数据适配（避免到处散落字段兼容逻辑）

## 状态管理

- 全局状态使用 zustand（`src/stores`），页面级状态优先用 React 本地状态/自定义 hooks
- store 命名与导出方式保持与现有模块一致，避免重复造轮子

## 国际化

- 文案默认走 i18next（`src/i18n`），新增 key 同步维护 `src/i18n/locales/zh.json` 与 `en.json`
- 避免在组件中硬编码大量中文/英文字符串

## 开发自检

- 必须确保 `npm run lint` 通过
- 避免把密钥写入仓库；环境相关配置放在 `.env.*` 中并遵循现有约定
- 每次写完功能都需要运行一下：`npm run lint` 检查代码
