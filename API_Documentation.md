# ThriveX 博客系统 - API 和组件文档

> **项目简介**  
> ThriveX 是一个基于 Next.js 15 + React 19 的现代化博客管理系统，采用 TypeScript 开发，具有高颜值的界面设计和丰富的功能特性。

## 📖 目录

- [项目架构](#项目架构)
- [API 接口文档](#api-接口文档)
- [组件库文档](#组件库文档)
- [工具函数库](#工具函数库)
- [自定义 Hooks](#自定义-hooks)
- [状态管理](#状态管理)
- [类型定义](#类型定义)
- [使用示例](#使用示例)

## 🏗️ 项目架构

```
src/
├── api/           # API 接口
├── app/           # Next.js App Router 页面
├── components/    # 可复用组件
├── hooks/         # 自定义 Hooks
├── lib/           # 第三方库配置
├── stores/        # 状态管理
├── types/         # TypeScript 类型定义
├── utils/         # 工具函数
├── assets/        # 静态资源
└── styles/        # 样式文件
```

## 🔌 API 接口文档

### 文章相关 API

#### `getArticleDataAPI(id: number, password?: string)`
获取指定文章的详细数据

**参数:**
- `id` (number): 文章ID
- `password` (string, 可选): 加密文章的密码

**返回值:** `Promise<ResponseData<Article>>`

**示例:**
```typescript
import { getArticleDataAPI } from '@/api/article';

// 获取普通文章
const article = await getArticleDataAPI(123);

// 获取加密文章
const encryptedArticle = await getArticleDataAPI(123, 'password123');
```

#### `getArticleListAPI()`
获取所有文章列表

**返回值:** `Promise<ResponseData<Article[]>>`

**示例:**
```typescript
import { getArticleListAPI } from '@/api/article';

const articles = await getArticleListAPI();
console.log(articles.data); // 文章数组
```

#### `getArticlePagingAPI(data: QueryData)`
分页获取文章数据

**参数:**
- `data` (QueryData): 查询参数对象
  - `pagination.page` (number): 页码
  - `pagination.size` (number): 每页数量
  - `query` (FilterData, 可选): 过滤条件

**返回值:** `Promise<ResponseData<Paginate<Article[]>>>`

**示例:**
```typescript
import { getArticlePagingAPI } from '@/api/article';

const result = await getArticlePagingAPI({
  pagination: { page: 1, size: 10 },
  query: { key: '搜索关键词' }
});
```

#### `getRandomArticleListAPI()`
获取随机文章列表

**返回值:** `Promise<ResponseData<Article[]>>`

#### `getRecommendedArticleListAPI()`
获取推荐文章列表

**返回值:** `Promise<ResponseData<Article[]>>`

#### `recordViewAPI(id: number)`
增加文章浏览量

**参数:**
- `id` (number): 文章ID

**返回值:** `Promise<ResponseData<void>>`

### 分类相关 API

#### `getCateListAPI()`
获取所有分类列表

**返回值:** `Promise<ResponseData<Cate[]>>`

**示例:**
```typescript
import { getCateListAPI } from '@/api/cate';

const categories = await getCateListAPI();
```

#### `getCateArticleListAPI(id: number, page: number)`
获取指定分类下的文章列表

**参数:**
- `id` (number): 分类ID
- `page` (number): 页码

**返回值:** `Promise<ResponseData<Article[]>>`

#### `getCateArticleCountAPI()`
获取各分类的文章数量统计

**返回值:** `Promise<ResponseData<any>>`

### 标签相关 API

#### `getTagListAPI()`
获取所有标签列表

**返回值:** `Promise<ResponseData<Tag[]>>`

#### `getTagListWithArticleCountAPI()`
获取标签列表（包含文章数量）

**返回值:** `Promise<ResponseData<TagWithCount[]>>`

#### `getTagArticleListAPI(id: number, page: number)`
获取指定标签下的文章列表

**参数:**
- `id` (number): 标签ID
- `page` (number): 页码

**返回值:** `Promise<ResponseData<Article[]>>`

### 评论相关 API

#### `addCommentDataAPI(data: Comment)`
添加评论

**参数:**
- `data` (Comment): 评论数据对象

**返回值:** `Promise<ResponseData<Comment>>`

**示例:**
```typescript
import { addCommentDataAPI } from '@/api/comment';

const comment = await addCommentDataAPI({
  articleId: 123,
  content: '这是一条评论',
  nickname: '访客',
  email: 'user@example.com'
});
```

#### `getCommentListAPI()`
获取所有评论列表

**返回值:** `Promise<ResponseData<Comment[]>>`

#### `getArticleCommentListAPI(articleId: number, paginate: Page)`
获取指定文章的评论列表

**参数:**
- `articleId` (number): 文章ID
- `paginate` (Page): 分页参数

**返回值:** `Promise<ResponseData<Comment[]>>`

### 配置相关 API

#### `getWebConfigDataAPI<T>(name: string)`
获取网站配置数据

**参数:**
- `name` (string): 配置名称

**返回值:** `Promise<ResponseData<T>>`

**示例:**
```typescript
import { getWebConfigDataAPI } from '@/api/config';
import { Web } from '@/types/app/config';

const webConfig = await getWebConfigDataAPI<{ value: Web }>('web');
```

## 🧩 组件库文档

### 布局组件

#### `Container`
页面容器组件，提供响应式布局

**Props:**
- `children` (React.ReactNode): 子组件

**用法:**
```tsx
import Container from '@/components/Container';

<Container>
  <div>页面内容</div>
</Container>
```

**特性:**
- 自动居中布局
- 响应式宽度：lg: 950px, xl: 1200px
- 内置 padding 和 margin

#### `Header`
网站头部导航组件

**特性:**
- 暗黑模式切换
- 响应式导航菜单
- 滚动时样式变化
- 分类导航下拉菜单

**用法:**
```tsx
import Header from '@/components/Header';

<Header />
```

#### `Footer`
网站底部组件

**特性:**
- 版权信息展示
- 友情链接
- 社交媒体链接

### 交互组件

#### `Loading`
加载动画组件

**用法:**
```tsx
import Loading from '@/components/Loading';

<Loading />
```

**特性:**
- SVG 动画效果
- 全屏遮罩
- 支持暗黑模式

#### `Pagination`
分页组件

**Props:**
- `total` (number): 总页数
- `page` (number): 当前页码
- `size` (number, 可选): 每页大小
- `path` (string, 可选): 路径前缀
- `className` (string, 可选): 自定义样式类

**用法:**
```tsx
import Pagination from '@/components/Pagination';

<Pagination
  total={10}
  page={1}
  path="/articles"
  className="mt-4"
/>
```

#### `Search`
搜索组件

**特性:**
- 实时搜索
- 防抖处理
- 搜索历史
- 搜索建议

### 功能组件

#### `Show`
条件渲染组件

**Props:**
- `when` (boolean): 显示条件
- `children` (React.ReactNode): 子组件

**用法:**
```tsx
import Show from '@/components/Show';

<Show when={isVisible}>
  <div>只在条件为真时显示</div>
</Show>
```

#### `Skeleton`
骨架屏组件

**Props:**
- `loading` (boolean): 是否显示骨架屏
- `children` (React.ReactNode): 实际内容

**用法:**
```tsx
import Skeleton from '@/components/Skeleton';

<Skeleton loading={isLoading}>
  <div>实际内容</div>
</Skeleton>
```

#### `Empty`
空状态组件

**Props:**
- `description` (string, 可选): 描述文本
- `image` (string, 可选): 自定义图片

**用法:**
```tsx
import Empty from '@/components/Empty';

<Empty description="暂无数据" />
```

### 特效组件

#### `Confetti`
彩带动画组件

**用法:**
```tsx
import Confetti from '@/components/Confetti';

<Confetti />
```

#### `Ripple`
水波纹效果组件

**Props:**
- `children` (React.ReactNode): 子组件

**用法:**
```tsx
import Ripple from '@/components/Ripple';

<Ripple>
  <button>点击有水波纹效果</button>
</Ripple>
```

#### `Starry`
星空背景组件

**用法:**
```tsx
import Starry from '@/components/Starry';

<Starry />
```

#### `Lantern`
灯笼装饰组件

**用法:**
```tsx
import Lantern from '@/components/Lantern';

<Lantern />
```

### 内容组件

#### `ArticleLayout`
文章布局组件

**Props:**
- `article` (Article): 文章数据
- `layout` (ArticleLayout): 布局类型

**用法:**
```tsx
import ArticleLayout from '@/components/ArticleLayout';

<ArticleLayout
  article={articleData}
  layout="card"
/>
```

#### `Slide`
轮播图组件

**Props:**
- `images` (string[]): 图片URL数组
- `autoPlay` (boolean, 可选): 自动播放
- `interval` (number, 可选): 播放间隔

**用法:**
```tsx
import Slide from '@/components/Slide';

<Slide
  images={['/img1.jpg', '/img2.jpg']}
  autoPlay={true}
  interval={3000}
/>
```

#### `Swiper`
滑动组件

**Props:**
- `children` (React.ReactNode): 子组件
- `spaceBetween` (number, 可选): 间距
- `slidesPerView` (number, 可选): 每页显示数量

**用法:**
```tsx
import Swiper from '@/components/Swiper';

<Swiper spaceBetween={20} slidesPerView={3}>
  <div>Slide 1</div>
  <div>Slide 2</div>
  <div>Slide 3</div>
</Swiper>
```

### 工具组件

#### `Typed`
打字机效果组件

**Props:**
- `strings` (string[]): 要显示的字符串数组
- `typeSpeed` (number, 可选): 打字速度
- `backSpeed` (number, 可选): 删除速度

**用法:**
```tsx
import Typed from '@/components/Typed';

<Typed
  strings={['Hello World!', 'Welcome to ThriveX!']}
  typeSpeed={50}
  backSpeed={30}
/>
```

#### `Tools`
工具栏组件

**特性:**
- 回到顶部
- 暗黑模式切换
- 分享功能
- 全屏功能

**用法:**
```tsx
import Tools from '@/components/Tools';

<Tools />
```

#### `RandomAvatar`
随机头像生成组件

**Props:**
- `seed` (string): 生成种子
- `size` (number, 可选): 头像大小

**用法:**
```tsx
import RandomAvatar from '@/components/RandomAvatar';

<RandomAvatar seed="user123" size={64} />
```

### 加密组件

#### `Encrypt`
内容加密组件

**Props:**
- `children` (React.ReactNode): 需要加密的内容
- `password` (string): 密码
- `onUnlock` (Function, 可选): 解锁回调

**用法:**
```tsx
import Encrypt from '@/components/Encrypt';

<Encrypt password="123456" onUnlock={handleUnlock}>
  <div>加密内容</div>
</Encrypt>
```

## 🛠️ 工具函数库

### 日期格式化

#### `dayFormat(timestamp: number | string)`
将时间戳格式化为相对时间

**参数:**
- `timestamp` (number | string): 时间戳

**返回值:** `string`

**示例:**
```typescript
import { dayFormat } from '@/utils';

console.log(dayFormat(Date.now())); // "今天"
console.log(dayFormat(Date.now() - 86400000)); // "昨天"
console.log(dayFormat(Date.now() - 172800000)); // "前天"
console.log(dayFormat(Date.now() - 604800000)); // "7 天前"
```

### HTML 解析工具

#### `HTMLParser.extractText(htmlString: string)`
从 HTML 字符串中提取纯文本

**参数:**
- `htmlString` (string): HTML 字符串

**返回值:** `string`

**示例:**
```typescript
import { HTMLParser } from '@/utils/htmlParser';

const html = '<p>Hello <strong>World</strong>!</p>';
const text = HTMLParser.extractText(html);
console.log(text); // "Hello World!"
```

#### `HTMLParser.sanitize(htmlString: string, options?)`
安全地清理 HTML 内容

**参数:**
- `htmlString` (string): HTML 字符串
- `options` (object, 可选): 清理选项

**返回值:** `string`

**示例:**
```typescript
import { HTMLParser } from '@/utils/htmlParser';

const dirtyHTML = '<script>alert("xss")</script><p>Safe content</p>';
const cleanHTML = HTMLParser.sanitize(dirtyHTML);
console.log(cleanHTML); // "<p>Safe content</p>"
```

### 异步处理工具

#### `to<T, U>(promise: Promise<T>)`
Promise 错误处理包装器

**参数:**
- `promise` (Promise<T>): 需要处理的 Promise

**返回值:** `Promise<[U, undefined] | [null, T]>`

**示例:**
```typescript
import { to } from '@/utils';

const [err, data] = await to(fetch('/api/data'));
if (err) {
  console.error('请求失败:', err);
} else {
  console.log('请求成功:', data);
}
```

### 工具函数

#### `getRandom(min: number, max: number)`
生成指定范围内的随机数

**参数:**
- `min` (number): 最小值
- `max` (number): 最大值

**返回值:** `number`

**示例:**
```typescript
import { getRandom } from '@/utils';

const randomNum = getRandom(1, 100);
console.log(randomNum); // 1-100 之间的随机数
```

#### `cn(...inputs: ClassValue[])`
CSS 类名合并工具

**参数:**
- `inputs` (ClassValue[]): 类名数组

**返回值:** `string`

**示例:**
```typescript
import { cn } from '@/lib/utils';

const className = cn(
  'base-class',
  isActive && 'active',
  'another-class'
);
```

### 网络请求工具

#### `Request<T>(method: string, api: string, data?: any, caching?: boolean)`
统一的 HTTP 请求函数

**参数:**
- `method` (string): 请求方法 (GET, POST, PUT, DELETE)
- `api` (string): API 端点
- `data` (any, 可选): 请求数据
- `caching` (boolean, 可选): 是否缓存

**返回值:** `Promise<ResponseData<T>>`

**示例:**
```typescript
import Request from '@/utils/request';

// GET 请求
const response = await Request<User>('GET', '/user/123');

// POST 请求
const newUser = await Request<User>('POST', '/user', {
  name: 'John',
  email: 'john@example.com'
});
```

## 🎣 自定义 Hooks

### `useDebounce(func: Function, wait: number)`
防抖 Hook

**参数:**
- `func` (Function): 需要防抖的函数
- `wait` (number): 防抖延迟时间（毫秒）

**返回值:** `Function`

**示例:**
```typescript
import useDebounce from '@/hooks/useDebounce';

function SearchComponent() {
  const [query, setQuery] = useState('');
  
  const debouncedSearch = useDebounce((searchTerm: string) => {
    // 执行搜索操作
    console.log('搜索:', searchTerm);
  }, 300);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  return (
    <input
      type="text"
      value={query}
      onChange={handleInputChange}
      placeholder="搜索..."
    />
  );
}
```

## 📦 状态管理

### Config Store
全局配置状态管理

**状态:**
- `isDark` (boolean): 是否暗黑模式
- `web` (Web): 网站配置
- `theme` (Theme): 主题配置

**方法:**
- `setIsDark(status: boolean)`: 设置暗黑模式
- `setWeb(data: Web)`: 设置网站配置
- `setTheme(data: Theme)`: 设置主题配置

**示例:**
```typescript
import { useConfigStore } from '@/stores';

function ThemeToggle() {
  const { isDark, setIsDark } = useConfigStore();

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <button onClick={toggleTheme}>
      {isDark ? '🌞' : '🌙'}
    </button>
  );
}
```

## 📋 类型定义

### 响应数据类型

#### `ResponseData<T>`
API 响应数据结构

```typescript
interface ResponseData<T> {
    code: number;        // 状态码
    message: string;     // 响应消息
    data: T;            // 响应数据
}
```

#### `Paginate<T>`
分页数据结构

```typescript
interface Paginate<T> {
    next: boolean;      // 是否有下一页
    prev: boolean;      // 是否有上一页
    page: number;       // 当前页码
    size: number;       // 每页大小
    pages: number;      // 总页数
    total: number;      // 总记录数
    result: T;          // 数据结果
}
```

### 文章相关类型

#### `Article`
文章数据结构

```typescript
interface Article {
    id?: number;
    title: string;              // 标题
    description: string;        // 描述
    content: string;           // 内容
    cover: string;             // 封面图
    cateIds: string;           // 分类ID（逗号分隔）
    cateList: Cate[];          // 分类列表
    tagIds: string;            // 标签ID（逗号分隔）
    tagList: Tag[];            // 标签列表
    view?: number;             // 浏览量
    comment?: number;          // 评论数
    config: Config;            // 配置信息
    prev: { id: number; title: string };  // 上一篇
    next: { id: number; title: string };  // 下一篇
    createTime?: string;       // 创建时间
}
```

#### `Config`
文章配置结构

```typescript
interface Config {
    id?: number;
    articleId?: number;
    top: number;               // 置顶级别
    status: Status;            // 状态：show | no_home | hide
    isEncrypt: number;         // 是否加密
    isDel: number;            // 是否删除
    password: string;         // 加密密码
}
```

### 分类和标签类型

#### `Cate`
分类数据结构

```typescript
interface Cate {
    id?: number;
    name: string;              // 分类名称
    description?: string;      // 分类描述
    cover?: string;           // 分类封面
    sort?: number;            // 排序
    createTime?: string;      // 创建时间
}
```

#### `Tag`
标签数据结构

```typescript
interface Tag {
    id?: number;
    name: string;             // 标签名称
    color?: string;           // 标签颜色
    createTime?: string;      // 创建时间
}
```

### 评论类型

#### `Comment`
评论数据结构

```typescript
interface Comment {
    id?: number;
    articleId: number;        // 文章ID
    parentId?: number;        // 父评论ID
    content: string;          // 评论内容
    nickname: string;         // 昵称
    email: string;           // 邮箱
    website?: string;        // 网站
    avatar?: string;         // 头像
    ip?: string;             // IP地址
    address?: string;        // 地址
    isTop: number;           // 是否置顶
    createTime?: string;     // 创建时间
    children?: Comment[];    // 子评论
}
```

### 配置类型

#### `Web`
网站配置类型

```typescript
interface Web {
    name: string;             // 网站名称
    title: string;            // 网站标题
    subhead: string;          // 副标题
    description: string;      // 网站描述
    keyword: string;          // 关键词
    author: string;           // 作者
    email: string;           // 邮箱
    domain: string;          // 域名
    favicon: string;         // 网站图标
    logo: string;            // 网站Logo
    cover: string;           // 封面图
}
```

#### `Theme`
主题配置类型

```typescript
interface Theme {
    primaryColor: string;     // 主色调
    layout: ArticleLayout;    // 文章布局
    showTools: boolean;       // 显示工具栏
    showLantern: boolean;     // 显示灯笼
    showSakura: boolean;      // 显示樱花
}
```

## 💡 使用示例

### 1. 创建文章列表页面

```tsx
import { useState, useEffect } from 'react';
import { getArticlePagingAPI } from '@/api/article';
import Container from '@/components/Container';
import Loading from '@/components/Loading';
import Pagination from '@/components/Pagination';
import { Article } from '@/types/app/article';

export default function ArticleList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    size: 10
  });

  useEffect(() => {
    fetchArticles();
  }, [pagination.page]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await getArticlePagingAPI({
        pagination: {
          page: pagination.page,
          size: pagination.size
        }
      });
      
      if (response?.data) {
        setArticles(response.data.result);
        setPagination(prev => ({
          ...prev,
          total: response.data.pages
        }));
      }
    } catch (error) {
      console.error('获取文章失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Container>
      <div className="article-list">
        {articles.map(article => (
          <div key={article.id} className="article-item">
            <h2>{article.title}</h2>
            <p>{article.description}</p>
            <div className="article-meta">
              <span>浏览量: {article.view}</span>
              <span>评论: {article.comment}</span>
            </div>
          </div>
        ))}
      </div>
      
      <Pagination
        total={pagination.total}
        page={pagination.page}
        className="mt-8"
      />
    </Container>
  );
}
```

### 2. 创建搜索组件

```tsx
import { useState } from 'react';
import { getArticlePagingAPI } from '@/api/article';
import useDebounce from '@/hooks/useDebounce';
import { Article } from '@/types/app/article';

export default function SearchComponent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useDebounce(async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await getArticlePagingAPI({
        pagination: { page: 1, size: 10 },
        query: { key: searchTerm }
      });
      
      if (response?.data) {
        setResults(response.data.result);
      }
    } catch (error) {
      console.error('搜索失败:', error);
    } finally {
      setLoading(false);
    }
  }, 300);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  return (
    <div className="search-component">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="搜索文章..."
        className="search-input"
      />
      
      {loading && <div>搜索中...</div>}
      
      <div className="search-results">
        {results.map(article => (
          <div key={article.id} className="search-result-item">
            <h3>{article.title}</h3>
            <p>{article.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 3. 使用主题配置

```tsx
import { useConfigStore } from '@/stores';
import { Switch } from '@heroui/react';

export default function ThemeSettings() {
  const { isDark, setIsDark, theme, setTheme } = useConfigStore();

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    // 应用到 document
    document.documentElement.classList.toggle('dark', !isDark);
  };

  const updateThemeColor = (color: string) => {
    setTheme({
      ...theme,
      primaryColor: color
    });
    // 应用到 CSS 变量
    document.documentElement.style.setProperty('--primary-color', color);
  };

  return (
    <div className="theme-settings">
      <div className="setting-item">
        <label>暗黑模式</label>
        <Switch
          isSelected={isDark}
          onValueChange={toggleDarkMode}
        />
      </div>
      
      <div className="setting-item">
        <label>主题色</label>
        <input
          type="color"
          value={theme.primaryColor || '#3b82f6'}
          onChange={(e) => updateThemeColor(e.target.value)}
        />
      </div>
    </div>
  );
}
```

### 4. HTML 内容处理

```tsx
import { HTMLParser } from '@/utils/htmlParser';
import { useEffect, useState } from 'react';

export default function ArticleContent({ htmlContent }: { htmlContent: string }) {
  const [processedContent, setProcessedContent] = useState('');

  useEffect(() => {
    // 清理和安全化 HTML 内容
    const sanitized = HTMLParser.sanitize(htmlContent, {
      allowedTags: ['p', 'br', 'strong', 'em', 'a', 'img', 'h1', 'h2', 'h3', 'code', 'pre'],
      allowedAttributes: ['href', 'src', 'alt', 'title'],
      maxLength: 10000
    });
    
    setProcessedContent(sanitized);
  }, [htmlContent]);

  // 提取纯文本用于摘要
  const textContent = HTMLParser.extractText(htmlContent);
  const summary = textContent.slice(0, 200) + '...';

  return (
    <article>
      <div className="article-summary">
        {summary}
      </div>
      <div 
        className="article-content"
        dangerouslySetInnerHTML={{ __html: processedContent }}
      />
    </article>
  );
}
```

### 5. 错误处理示例

```tsx
import { to } from '@/utils';
import { getArticleDataAPI } from '@/api/article';

export default function ArticlePage({ id }: { id: number }) {
  const [article, setArticle] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticle();
  }, [id]);

  const loadArticle = async () => {
    setLoading(true);
    setError('');
    
    const [err, response] = await to(getArticleDataAPI(id));
    
    if (err) {
      setError('文章加载失败');
      console.error('Error loading article:', err);
    } else if (response?.data) {
      setArticle(response.data);
    } else {
      setError('文章不存在');
    }
    
    setLoading(false);
  };

  if (loading) return <Loading />;
  if (error) return <div className="error-message">{error}</div>;
  if (!article) return <div>文章不存在</div>;

  return (
    <div className="article-page">
      <h1>{article.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: article.content }} />
    </div>
  );
}
```

## 📝 环境配置

在使用 API 前，请确保正确配置环境变量：

```env
# .env.local
NEXT_PUBLIC_PROJECT_API=http://localhost:8080/api
NEXT_PUBLIC_CACHING_TIME=3600
```

## 🚀 快速开始

1. **安装依赖**
   ```bash
   npm install
   # 或
   pnpm install
   ```

2. **配置环境变量**
   ```bash
   cp .env.example .env.local
   # 编辑 .env.local 文件
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   # 或
   pnpm dev
   ```

4. **访问应用**
   打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 📞 技术支持

如果您在使用过程中遇到问题，可以通过以下方式获取帮助：

- 📧 邮箱：liuyuyang1024@yeah.net
- 🌐 项目官网：https://thrivex.liuyuyang.net/
- 📖 在线文档：https://docs.liuyuyang.net/
- 🔗 项目预览：https://liuyuyang.net/

---

**© 2024 ThriveX Blog System. All rights reserved.**