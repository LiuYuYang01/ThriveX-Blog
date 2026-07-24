# 文章小组件演示

这是一篇用于预览自定义小组件的模拟文章。管理端通过 `tx-widget` 代码块（或链接别名）插入，博客端会渲染成对应组件。

## 媒体嵌入

### Bilibili

```tx-widget
{
  "type": "bilibili",
  "bvid": "BV1GJ411x7h7"
}
```

### YouTube

```tx-widget
{
  "type": "youtube",
  "id": "dQw4w9WgXcQ"
}
```

### 网易云音乐

```tx-widget
{
  "type": "netease",
  "id": "1824045033"
}
```

### 抖音（链接别名写法）

[douyin-video](7234567890123456789)

### 音频播放器

```tx-widget
{
  "type": "audio",
  "title": "演示音频",
  "artist": "ThriveX Demo",
  "src": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
}
```

## 内容结构

### Tabs 切换

```tx-widget
{
  "type": "tabs",
  "items": [
    { "title": "React", "content": "适合组件化与生态丰富的 Web 应用。" },
    { "title": "Vue", "content": "上手快，模板语法友好，适合中后台。" },
    { "title": "Svelte", "content": "编译期优化，运行时更轻。" }
  ]
}
```

### 时间线

```tx-widget
{
  "type": "timeline",
  "items": [
    { "time": "2024", "title": "起步", "content": "搭建博客基础能力。" },
    { "time": "2025", "title": "增强", "content": "补齐主题、评论与缓存。" },
    { "time": "2026", "title": "小组件", "content": "文章内可嵌入可交互模块。" }
  ]
}
```

### 步骤条

```tx-widget
{
  "type": "steps",
  "items": [
    { "title": "写 Markdown", "content": "在正文中插入 tx-widget 语法。" },
    { "title": "管理端预览", "content": "发布前确认组件参数。" },
    { "title": "博客渲染", "content": "读者看到的是真实小组件。" }
  ]
}
```

## 画廊

```tx-widget
{
  "type": "gallery",
  "items": [
    { "src": "https://picsum.photos/seed/a1/800/600", "alt": "风景 1" },
    { "src": "https://picsum.photos/seed/a2/800/600", "alt": "风景 2" },
    { "src": "https://picsum.photos/seed/a3/800/600", "alt": "风景 3" }
  ]
}
```

## CTA

```tx-widget
{
  "type": "cta",
  "title": "想把 ThriveX 用到自己的博客？",
  "description": "开箱即用的管理端 + 博客端，支持主题与内容扩展。",
  "primaryText": "查看项目",
  "primaryUrl": "https://github.com",
  "secondaryText": "阅读文档",
  "secondaryUrl": "https://liuyuyang.net"
}
```