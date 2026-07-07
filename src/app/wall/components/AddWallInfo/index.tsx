'use client';

import { useEffect, useState, useRef } from 'react';
import {
  Button,
  Modal,
  useDisclosure,
  FormProvider,
  useForm,
  Input,
  Textarea,
  Select,
  RadioGroup,
  Radio,
  Controller,
} from '@/ThriveUI';
import { type SubmitHandler } from 'react-hook-form';
import { Cate, Wall } from '@/types/app/wall';
import { addWallDataAPI, getCateListAPI } from '@/api/wall';
import { Bounce, toast, ToastContainer, ToastOptions } from 'react-toastify';
import HCaptchaType from '@hcaptcha/react-hcaptcha';
import HCaptcha from '@/components/HCaptcha';
import { useConfigStore } from '@/stores';
import 'react-toastify/dist/ReactToastify.css';

const toastConfig: ToastOptions = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'colored',
  transition: Bounce,
};

export default () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const captchaRef = useRef<HCaptchaType>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState<string>('');

  const config = useConfigStore();
  const hasHCaptcha = !!config?.other?.hcaptcha_key;

  const [cateList, setCateList] = useState<Cate[]>([]);
  const getCateList = async () => {
    const { data } = await getCateListAPI();
    setCateList(data?.filter((item) => item.id !== 1) ?? []);
  };

  useEffect(() => {
    const message = localStorage.getItem('toastMessage');
    if (message) {
      toast.success(message, toastConfig);
      localStorage.removeItem('toastMessage');
    }

    getCateList();
  }, []);

  const methods = useForm<Wall>({ defaultValues: { color: '#ffe3944d' } as Wall });

  const onSubmit: SubmitHandler<Wall> = async (data, event) => {
    event?.preventDefault();
    setCaptchaError('');

    if (hasHCaptcha && !captchaToken) return setCaptchaError('请完成人机验证');

    const { code, message } = await addWallDataAPI({
      ...data,
      createTime: Date.now().toString(),
      h_captcha_response: captchaToken!,
    });

    if (code !== 200) {
      captchaRef.current?.resetCaptcha();
      return toast.error(message, toastConfig);
    }

    setCaptchaError('');
    setCaptchaToken(null);
    captchaRef.current?.resetCaptcha();

    localStorage.setItem('toastMessage', '🎉 提交成功, 请等待审核!');
    window.location.reload();
    onClose();
  };

  const handleCaptchaSuccess = (token: string) => {
    setCaptchaToken(token);
    setCaptchaError('');
  };

  return (
    <>
      <button
        type="button"
        onClick={onOpen}
        aria-label="写留言"
        className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full bg-linear-to-br from-blue-300 to-blue-500 text-white shadow-xl shadow-blue-500/25 flex items-center justify-center text-3xl font-light transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-blue-500/40 cursor-pointer leading-none"
      >
        <span className="-translate-y-0.5">+</span>
      </button>

      <Modal
        open={isOpen}
        onClose={onClose}
        title="留言"
        className="max-w-2xl"
        footer={
          <Button color="primary" onPress={() => methods.handleSubmit(onSubmit)()} className="w-full">
            提交
          </Button>
        }
      >
        <FormProvider {...methods}>
          <form className="space-y-4" onSubmit={methods.handleSubmit(onSubmit)}>
            <Textarea name="content" label="留言内容" placeholder="示例：你好呀！" rules={{ required: '请输入留言内容' }} />
            <Input name="name" label="你的名称（选填）" placeholder="示例：宇阳" />
            <Input
              name="email"
              label="你的邮箱（选填）"
              placeholder="示例：3311118881@qq.com"
              rules={{
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: '请输入正确的邮箱',
                },
              }}
            />
            <Select
              name="cateId"
              label="留言分类"
              placeholder="示例：想对我说的话"
              rules={{ required: '请选择留言分类' }}
              options={cateList.map((item) => ({ value: item.id, label: item.name }))}
            />

            <Controller
              name="color"
              control={methods.control}
              render={({ field }) => (
                <RadioGroup
                  label="留言墙颜色"
                  value={field.value}
                  onValueChange={field.onChange}
                  className="mt-3 flex [&>div]:flex-row [&>legend]:text-sm"
                >
                  <Radio value="#ffe3944d">
                    <span className="inline-block h-8 w-8 rounded-md bg-[#ffe3944d]"></span>
                  </Radio>
                  <Radio value="#fcafa24d">
                    <span className="inline-block h-8 w-8 rounded-md bg-[#fcafa24d]"></span>
                  </Radio>
                  <Radio value="#a8ed8a4d">
                    <span className="inline-block h-8 w-8 rounded-md bg-[#a8ed8a4d]"></span>
                  </Radio>
                  <Radio value="#caa7f74d">
                    <span className="inline-block h-8 w-8 rounded-md bg-[#caa7f74d]"></span>
                  </Radio>
                  <Radio value="#92e6f54d">
                    <span className="inline-block h-8 w-8 rounded-md bg-[#92e6f54d]"></span>
                  </Radio>
                </RadioGroup>
              )}
            />

            {hasHCaptcha && (
              <div className="flex flex-col">
                <HCaptcha ref={captchaRef} setToken={handleCaptchaSuccess} />
                {captchaError && <span className="mt-1 pl-3 text-sm text-red-400">{captchaError}</span>}
              </div>
            )}
          </form>
        </FormProvider>
      </Modal>

      <ToastContainer />
    </>
  );
};
