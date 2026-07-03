import {
  FormExample,
  ModalExample,
  PaginationExample,
  PhotoPreviewExample,
} from './examples';
import type { ThriveDoc } from './types';

export const thrivePrinciples = [
  'ThriveUI 只沉淀可复用的交互模式，不承载具体项目的业务逻辑。',
  '组件通过 props 接收数据和回调，不直接请求接口，也不读取宿主项目的 store。',
  '视觉能力尽量基于 CSS 变量和 Tailwind 工具类，方便不同项目接入自己的主题。',
  '文档示例只使用本地演示数据和公开 API，保证组件库迁移时文档也能一起带走。',
];

export const thriveDocs: ThriveDoc[] = [
  {
    id: 'form',
    title: 'Form 表单',
    category: '数据录入',
    description:
      '基于 react-hook-form 的轻量表单层，统一字段布局、校验提示和基础输入控件的交互体验。',
    importCode:
      'import { FormProvider, Input, Select, Textarea, useForm } from "@/ThriveUI/Form";',
    source: 'src/ThriveUI/Form',
    usage: [
      '在业务页面或功能边界使用 useForm 和 FormProvider 管理表单状态。',
      '常规输入优先使用 Input、Select、Textarea，避免每个项目重复写字段样式。',
      '需要自定义控件时使用 Field 复用 label、hint、error 的统一布局。',
    ],
    props: [
      {
        name: 'name',
        type: 'FieldPath<TFieldValues>',
        required: true,
        description: '字段名，会传给 react-hook-form 的 Controller。',
      },
      {
        name: 'label',
        type: 'ReactNode',
        description: '字段标签。',
      },
      {
        name: 'hint',
        type: 'ReactNode',
        description: '字段辅助说明，显示在控件下方。',
      },
      {
        name: 'required',
        type: 'boolean',
        description: '是否显示必填标记。',
      },
      {
        name: 'rules',
        type: 'RegisterOptions<TFieldValues, TName>',
        description: '传给 react-hook-form Controller 的校验规则。',
      },
      {
        name: 'fieldClassName',
        type: 'string',
        description: '字段外层容器的额外 className。',
      },
      {
        name: 'options',
        type: 'SelectOption[]',
        description: 'Select 专属属性，用于配置选项列表。',
      },
    ],
    examples: [
      {
        title: '基础联系表单',
        description: '使用本地 options 和校验规则组合一个可迁移的表单。',
        preview: <FormExample />,
        code: `type ContactForm = {
  name: string;
  role: string;
  message: string;
};

const form = useForm<ContactForm>({
  defaultValues: { name: "", role: "", message: "" },
});

<FormProvider {...form}>
  <Input
    name="name"
    label="姓名"
    placeholder="Ada Lovelace"
    required
    rules={{ required: "请输入姓名" }}
  />
  <Select
    name="role"
    label="角色"
    placeholder="请选择角色"
    options={roleOptions}
  />
  <Textarea name="message" label="留言" rows={4} />
</FormProvider>`,
      },
    ],
    notes: [
      '表单组件依赖 react-hook-form，宿主项目需要安装并保持兼容版本。',
      '接口提交、数据适配、业务校验应放在宿主项目中，ThriveUI 只负责表单交互和展示。',
    ],
  },
  {
    id: 'modal',
    title: 'Modal 弹窗',
    category: '反馈',
    description:
      '带遮罩、背景模糊、进出场动画和无障碍语义的全局弹窗容器，同时提供浮动触发按钮 ModalFab。',
    importCode: 'import Modal, { ModalFab } from "@/ThriveUI/Modal";',
    source: 'src/ThriveUI/Modal',
    usage: [
      '用于确认框、表单弹窗、局部任务面板等需要聚焦用户注意力的场景。',
      'ModalFab 适合页面级常驻操作入口，例如发布、创建、反馈。',
      '弹窗内容的请求、校验和持久化逻辑都应由调用方控制。',
    ],
    props: [
      {
        name: 'open',
        type: 'boolean',
        required: true,
        description: '控制弹窗是否打开。',
      },
      {
        name: 'onClose',
        type: '() => void',
        required: true,
        description: '关闭动画结束后触发的回调。',
      },
      {
        name: 'children',
        type: 'ReactNode',
        required: true,
        description: '弹窗主体内容。',
      },
      {
        name: 'title',
        type: 'ReactNode',
        description: '弹窗标题。',
      },
      {
        name: 'description',
        type: 'ReactNode',
        description: '标题下方的辅助说明。',
      },
      {
        name: 'titleId',
        type: 'string',
        description: '自定义标题 id，用于 aria-labelledby。',
      },
      {
        name: 'preventClose',
        type: 'boolean',
        description: '阻止用户手动关闭，常用于提交中状态。',
      },
    ],
    examples: [
      {
        title: '基础弹窗',
        description: '由调用方维护 open 状态，Modal 只负责容器行为。',
        preview: <ModalExample />,
        code: `const [open, setOpen] = useState(false);

<ModalFab onClick={() => setOpen(true)}>
  打开弹窗
</ModalFab>

<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="创建工作区"
  description="业务逻辑放在调用方，弹窗只负责容器能力。"
>
  <p>这里可以放表单、确认信息或自定义内容。</p>
</Modal>`,
      },
    ],
    notes: [
      'Modal 是 client component，因为它需要维护动画、计时和交互状态。',
      '提交中或关键流程中可以使用 preventClose 避免误关闭。',
    ],
  },
  {
    id: 'pagination',
    title: 'Pagination 分页',
    category: '导航',
    description:
      '基于链接的分页组件，内置页码范围计算、省略号跳转和总数统计展示，适合服务端分页列表。',
    importCode: 'import Pagination from "@/ThriveUI/Pagination";',
    source: 'src/ThriveUI/Pagination',
    usage: [
      '适合每一页都有稳定 URL 的列表页，利于 SSR 和分享。',
      '通过 query 保留筛选条件或搜索关键词。',
      '如果需要自定义分页 UI，可以直接复用 buildPageHref 和 getPageRange。',
    ],
    props: [
      {
        name: 'current',
        type: 'number',
        required: true,
        description: '当前页码，从 1 开始。',
      },
      {
        name: 'totalPages',
        type: 'number',
        required: true,
        description: '总页数。',
      },
      {
        name: 'basePath',
        type: 'string',
        required: true,
        description: '用于生成分页链接的基础路径。',
      },
      {
        name: 'totalItems',
        type: 'number',
        description: '数据总条数，用于展示统计文案。',
      },
      {
        name: 'pageSize',
        type: 'number',
        defaultValue: '10',
        description: '每页条数，用于计算当前范围。',
      },
      {
        name: 'query',
        type: 'Record<string, string | number | boolean | null | undefined>',
        description: '生成分页链接时需要保留的查询参数。',
      },
      {
        name: 'siblingCount',
        type: 'number',
        defaultValue: '1',
        description: '当前页两侧展示的页码数量。',
      },
      {
        name: 'boundaryCount',
        type: 'number',
        defaultValue: '5',
        description: '靠近首页或尾页时连续展示的页码数量。',
      },
    ],
    examples: [
      {
        title: '链接分页',
        description: '翻页时保留搜索关键词等筛选参数。',
        preview: <PaginationExample />,
        code: `<Pagination
  current={6}
  totalPages={18}
  basePath="/articles"
  totalItems={180}
  pageSize={10}
  query={{ keyword: "component" }}
/>`,
      },
    ],
    notes: [
      '当前实现依赖 next/link，非 Next 项目接入时建议拆出链接适配层。',
      '如果未来要做框架无关版本，可以保留分页算法，把链接渲染交给宿主适配器。',
    ],
  },
  {
    id: 'photo-preview',
    title: 'PhotoPreview 图片预览',
    category: '媒体',
    description:
      '受控的图片预览浮层，支持键盘切换、旋转、缩放和多图浏览，适合相册或内容详情页。',
    importCode: 'import PhotoPreview, { type PhotoItem } from "@/ThriveUI/PhotoPreview";',
    source: 'src/ThriveUI/PhotoPreview',
    usage: [
      '缩略图需要全屏查看时使用。',
      '图片列表和当前 index 由调用方维护，组件只处理预览交互。',
      'PhotoItem 使用稳定 id，便于宿主项目保存或恢复预览状态。',
    ],
    props: [
      {
        name: 'open',
        type: 'boolean',
        required: true,
        description: '控制预览浮层是否打开。',
      },
      {
        name: 'photos',
        type: 'PhotoItem[]',
        required: true,
        description: '图片列表，包含 id、url，可选 thumb 和 alt。',
      },
      {
        name: 'index',
        type: 'number',
        defaultValue: '0',
        description: '当前预览图片的索引。',
      },
      {
        name: 'onClose',
        type: '() => void',
        required: true,
        description: '关闭预览时触发。',
      },
      {
        name: 'onIndexChange',
        type: '(index: number) => void',
        description: '点击上一张或下一张时触发。',
      },
    ],
    examples: [
      {
        title: '相册预览',
        description: '点击缩略图打开受控的图片预览浮层。',
        preview: <PhotoPreviewExample />,
        code: `const [open, setOpen] = useState(false);
const [index, setIndex] = useState(0);

<PhotoPreview
  open={open}
  photos={photos}
  index={index}
  onClose={() => setOpen(false)}
  onIndexChange={setIndex}
/>`,
      },
    ],
    notes: [
      '当前组件使用原生 img 渲染，缩略图优化可以由宿主项目自行处理。',
      '远程图片地址需要符合宿主项目的图片安全策略和加载策略。',
    ],
  },
];
