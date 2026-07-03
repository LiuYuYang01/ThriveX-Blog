'use client';

import { useState } from 'react';
import { LuSend } from 'react-icons/lu';
import Modal from '../Modal';
import Pagination from '../Pagination';
import PhotoPreview, { type PhotoItem } from '../PhotoPreview';
import { FormProvider, Input, Select, Textarea, useForm } from '../Form';

type ContactForm = {
  name: string;
  role: string;
  message: string;
};

const roleOptions = [
  { value: 'designer', label: '设计师' },
  { value: 'engineer', label: '工程师' },
  { value: 'manager', label: '产品经理' },
];

const photos: PhotoItem[] = [
  {
    id: 'alpine-lake',
    url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    alt: '山间湖泊',
  },
  {
    id: 'snow-night',
    url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
    alt: '雪山夜景',
  },
];

export function FormExample() {
  const form = useForm<ContactForm>({
    defaultValues: {
      name: '',
      role: '',
      message: '',
    },
  });

  return (
    <FormProvider {...form}>
      <form className="grid gap-4 rounded-2xl border border-neutral-200/70 bg-surface p-5 dark:border-neutral-700/60">
        <Input<ContactForm>
          name="name"
          label="姓名"
          placeholder="Ada Lovelace"
          required
          rules={{ required: '请输入姓名' }}
        />
        <Select<ContactForm>
          name="role"
          label="角色"
          placeholder="请选择角色"
          options={roleOptions}
          rules={{ required: '请选择角色' }}
        />
        <Textarea<ContactForm>
          name="message"
          label="留言"
          placeholder="写一段简单说明"
          rows={4}
          hint="提交逻辑和接口请求放在宿主项目中处理。"
        />
        <button
          type="button"
          onClick={form.handleSubmit(() => undefined)}
          className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white"
        >
          <LuSend className="h-4 w-4" />
          校验表单
        </button>
      </form>
    </FormProvider>
  );
}

export function ModalExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative min-h-52 overflow-hidden rounded-2xl border border-neutral-200/70 bg-surface p-5 dark:border-neutral-700/60">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-950"
      >
        打开弹窗
      </button>
      <p className="mt-4 max-w-md text-sm leading-6 text-neutral-500 dark:text-neutral-400">
        Modal 只负责遮罩、动画、无障碍语义和关闭时机。
      </p>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="创建工作区"
        description="业务逻辑放在调用方，弹窗只负责容器能力。"
      >
        <div className="space-y-4">
          <p className="text-sm leading-6 text-neutral-500 dark:text-neutral-400">
            这里可以放表单、确认信息或自定义面板。Modal 本身不关心具体业务。
          </p>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="cursor-pointer rounded-full bg-primary px-4 py-2 text-sm font-medium text-white"
          >
            完成
          </button>
        </div>
      </Modal>
    </div>
  );
}

export function PaginationExample() {
  return (
    <div className="rounded-2xl border border-neutral-200/70 bg-surface p-5 dark:border-neutral-700/60">
      <Pagination
        current={6}
        totalPages={18}
        basePath="/thrive-ui"
        totalItems={180}
        pageSize={10}
        query={{ keyword: 'component' }}
      />
    </div>
  );
}

export function PhotoPreviewExample() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  return (
    <div className="rounded-2xl border border-neutral-200/70 bg-surface p-5 dark:border-neutral-700/60">
      <div className="grid grid-cols-2 gap-3">
        {photos.map((photo, photoIndex) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => {
              setIndex(photoIndex);
              setOpen(true);
            }}
            className="group aspect-[4/3] cursor-pointer overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800"
          >
            <img
              src={photo.url}
              alt={photo.alt}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>
      <PhotoPreview
        open={open}
        photos={photos}
        index={index}
        onClose={() => setOpen(false)}
        onIndexChange={setIndex}
      />
    </div>
  );
}
