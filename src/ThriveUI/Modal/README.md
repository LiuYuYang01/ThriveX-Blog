# Modal 弹窗组件

带平滑背景模糊动画的全局弹窗。

## 导入

```tsx
import Modal, { ModalFab } from "@/components/Modal";
```

> 需在 `"use client"` 文件中使用。

## 快速开始

```tsx
const [open, setOpen] = useState(false);

<ModalFab onClick={() => setOpen(true)}>打开弹窗</ModalFab>

<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="标题"
  description="副标题说明"
>
  弹窗内容
</Modal>
```

## Modal Props

| Prop | 类型 | 说明 |
|------|------|------|
| `open` | `boolean` | 是否打开 |
| `onClose` | `() => void` | 关闭回调（动画结束后触发） |
| `children` | `ReactNode` | 弹窗内容 |
| `title` | `ReactNode` | 标题 |
| `description` | `ReactNode` | 说明文字 |
| `titleId` | `string` | 标题 id，用于无障碍 |
| `preventClose` | `boolean` | 提交中等场景禁止用户手动关闭 |

## ModalFab Props

| Prop | 类型 | 说明 |
|------|------|------|
| `onClick` | `() => void` | 点击回调 |
| `children` | `ReactNode` | 按钮文字 |
| `icon` | `ReactNode` | 左侧图标 |
| `className` | `string` | 额外样式 |

## 示例

```tsx
<Modal
  open={open}
  onClose={() => setOpen(false)}
  preventClose={submitting}
  title="申请友链"
  description="填写站点信息，审核通过后展示"
>
  <form>...</form>
</Modal>
```

提交成功后延迟关闭：

```tsx
setTimeout(() => setOpen(false), 1200);
```

## 动画

- 背景：`blur(0) → blur(12px)`，约 0.65s
- 面板：spring 入场，关闭时淡出
- 系统开启「减少动态效果」时自动跳过动画

## 引用

- `src/app/friend/components/FriendCompose`
- `src/app/wall/components/WallCompose`
