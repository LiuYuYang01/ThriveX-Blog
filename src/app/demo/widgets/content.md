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

## 提示块

```tx-widget
{
  "type": "callout",
  "variant": "note",
  "title": "笔记",
  "content": "默认样式，适合补充说明。variant 可选 note / tip / info / warning / danger。"
}
```

```tx-widget
{
  "type": "callout",
  "variant": "warning",
  "title": "注意",
  "content": "该操作不可逆，请提前备份数据。"
}
```

## 网址卡片

```tx-widget
{
  "type": "link-card",
  "title": "ThriveX",
  "description": "现代化 CMS 管理系统，开箱即用。",
  "cover": "https://picsum.photos/seed/tx/300/300",
  "url": "https://github.com"
}
```

## 折叠面板

```tx-widget
{
  "type": "collapse",
  "title": "展开查看完整配置",
  "content": "这里放被折叠的内容：\n{\n  \"debug\": true,\n  \"level\": 3\n}",
  "open": false
}
```

## 代码对比

```tx-widget
{
  "type": "diff",
  "title": "config.ts",
  "code": "- const apiUrl = 'http://old-api.example.com';\n- const timeout = 5000;\n+ const apiUrl = 'https://api.example.com';\n+ const timeout = 10000;\n  export { apiUrl, timeout };"
}
```

## 评分卡

```tx-widget
{
  "type": "rating",
  "title": "MacBook Pro 使用体验",
  "items": [
    { "label": "性能", "score": 5 },
    { "label": "屏幕", "score": 5 },
    { "label": "便携性", "score": 3 },
    { "label": "性价比", "score": 2 }
  ],
  "summary": "性能怪兽，但价格劝退，量力而行。"
}
```

## 双栏对比

```tx-widget
{
  "type": "comparison",
  "leftTitle": "自建博客",
  "rightTitle": "托管平台",
  "items": [
    { "label": "自由度", "left": "完全可控", "right": "受平台限制" },
    { "label": "运维成本", "left": "需要自己维护", "right": "零运维" },
    { "label": "数据归属", "left": "100% 归自己", "right": "依赖平台" }
  ]
}
```

## 文章引用

```tx-widget
{
  "type": "article-ref",
  "ids": [1],
  "title": "往期回顾"
}
```