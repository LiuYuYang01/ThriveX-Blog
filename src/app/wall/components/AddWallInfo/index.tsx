'use client';

import { useEffect, useState, useRef } from 'react';
import { Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Select, SelectItem, Textarea, RadioGroup, Radio } from '@heroui/react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
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
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // 人机验证相关
  const captchaRef = useRef<HCaptchaType>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState<string>('');
  
  const hcaptcha = useConfigStore((state) => state.config.hcaptcha_key);
  const hasHCaptcha = Boolean(hcaptcha?.key?.trim() || process.env.NEXT_PUBLIC_HCAPTCHA_KEY?.trim());

  // 获取留言分类列表
  const [cateList, setCateList] = useState<Cate[]>([]);
  const getCateList = async () => {
    const { data } = await getCateListAPI();
    setCateList(data?.filter((item) => item.id !== 1));
  };
  useEffect(() => {
    // 页面加载后检查是否有需要显示的消息
    const message = localStorage.getItem('toastMessage');
    if (message) {
      toast.success(message, toastConfig);
      localStorage.removeItem('toastMessage'); // 显示后删除消息
    }

    getCateList();
  }, []);

  const [defaultValues] = useState<Wall>({} as Wall);
  const {
    handleSubmit,
    control,
    formState: { errors },
    trigger,
  } = useForm<Wall>({ defaultValues });

  const onSubmit: SubmitHandler<Wall> = async (data, event) => {
    event?.preventDefault();

    // 清除之前的人机验证错误
    setCaptchaError('');

    // 只有配置了HCaptcha时才需要验证
    if (hasHCaptcha && !captchaToken) return setCaptchaError('请完成人机验证');

    const { code, message } = await addWallDataAPI({ ...data, createTime: Date.now().toString(), h_captcha_response: captchaToken! });

    if (code !== 200) {
      captchaRef.current?.resetCaptcha();
      return toast.error(message, toastConfig);
    }

    // 清除验证相关状态
    setCaptchaError('');
    setCaptchaToken(null);
    captchaRef.current?.resetCaptcha();

    // 提交成功后存储消息
    localStorage.setItem('toastMessage', '🎉 提交成功, 请等待审核!');
    window.location.reload();
    onOpenChange();
  };

  // 处理人机验证成功回调
  const handleCaptchaSuccess = (token: string) => {
    setCaptchaToken(token);
    setCaptchaError(''); // 清除错误提示
  };

  // 表单样式
  const inputWrapper = 'hover:!border-primary group-data-[focus=true]:border-primary rounded-md';

  return (
    <>
      {/* <div className="fixed top-[15%] right-[5%] flex justify-center items-center w-[70px] h-[70px] rounded-full bg-black-b cursor-pointer z-50" onClick={onOpen}>
        <MdOutlineAdd className="text-white text-5xl" />
      </div> */}

      <Button color="primary" variant="shadow" onPress={onOpen}>
        点击留言
      </Button>

      <Modal
        size="lg"
        backdrop="opaque"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          backdrop: 'bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20',
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">留言</ModalHeader>

              <ModalBody>
                <Controller
                  name="content"
                  control={control}
                  rules={{ required: '请输入留言内容' }}
                  render={({ field }) => (
                    <>
                      <Textarea {...field} label="留言内容" variant="bordered" placeholder="示例：你好呀！" isInvalid={!!errors.content?.message} errorMessage={errors.content?.message} onBlur={() => trigger('content')} classNames={{ inputWrapper }} />
                    </>
                  )}
                />

                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input {...field} type="text" label="你的名称（选填）" variant="bordered" placeholder="示例：宇阳" isInvalid={!!errors.name?.message} errorMessage={errors.name?.message} onBlur={() => trigger('name')} classNames={{ inputWrapper }} />
                    </>
                  )}
                />

                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input {...field} type="text" label="你的邮箱（选填）" variant="bordered" placeholder="示例：3311118881@qq.com" isInvalid={!!errors.email?.message} errorMessage={errors.email?.message} onBlur={() => trigger('email')} classNames={{ inputWrapper }} />
                    </>
                  )}
                />

                <Controller
                  name="cateId"
                  control={control}
                  rules={{ required: '请选择留言分类' }}
                  render={({ field }) => (
                    <>
                      <Select
                        {...field}
                        label="留言分类"
                        variant="bordered"
                        placeholder="示例：想对我说的话"
                        isInvalid={!!errors.cateId?.message}
                        errorMessage={errors.cateId?.message}
                        classNames={{
                          trigger: 'hover:!border-primary data-[focus=true]:!border-primary data-[open=true]:!border-primary rounded-md',
                        }}
                      >
                        {cateList?.map((item) => (
                          <SelectItem key={item.id}>{item.name}</SelectItem>
                        ))}
                      </Select>
                    </>
                  )}
                />

                <Controller
                  name="color"
                  control={control}
                  render={({ field }) => (
                    <>
                      <RadioGroup {...field} label="留言墙颜色" defaultValue="#ffe3944d" className="flex mt-3 [&>span]:text-sm [&>span]:text-center [&>div]:flex-row [&>div>label]:mx-1 [&>div>label]:flex-row-reverse [&>div>label>div]:ml-0 [&>div>label>div]:mr-2">
                        <Radio value="#ffe3944d">
                          <span className="inline-block w-8 h-8 bg-[#ffe3944d] rounded-md"></span>
                        </Radio>
                        <Radio value="#fcafa24d">
                          <span className="inline-block w-8 h-8 bg-[#fcafa24d] rounded-md"></span>
                        </Radio>
                        <Radio value="#a8ed8a4d">
                          <span className="inline-block w-8 h-8 bg-[#a8ed8a4d] rounded-md"></span>
                        </Radio>
                        <Radio value="#caa7f74d">
                          <span className="inline-block w-8 h-8 bg-[#caa7f74d] rounded-md"></span>
                        </Radio>
                        <Radio value="#92e6f54d">
                          <span className="inline-block w-8 h-8 bg-[#92e6f54d] rounded-md"></span>
                        </Radio>
                      </RadioGroup>
                    </>
                  )}
                />

                {/* 人机验证 */}
                {hasHCaptcha && (
                  <div className="flex flex-col">
                    <HCaptcha ref={captchaRef} setToken={handleCaptchaSuccess} />
                    {captchaError && <span className="text-red-400 text-sm pl-3 mt-1">{captchaError}</span>}
                  </div>
                )}
              </ModalBody>

              <ModalFooter>
                <Button color="primary" onPress={() => handleSubmit(onSubmit)()} className="w-full">
                  提交
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <ToastContainer />
    </>
  );
};
