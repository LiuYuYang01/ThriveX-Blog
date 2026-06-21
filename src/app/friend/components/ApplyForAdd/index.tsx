'use client';

import { useEffect, useState, useRef } from 'react';
import { Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Select, SelectItem, Textarea } from '@heroui/react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Web, WebType } from '@/types/app/web';
import { addWebDataAPI, getWebTypeListAPI } from '@/api/web';
import { Bounce, toast, ToastOptions } from 'react-toastify';
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
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // 人机验证相关
  const captchaRef = useRef<HCaptchaType>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState<string>('');
  
  const hcaptcha = useConfigStore((state) => state.config.hcaptcha_key);
  const hasHCaptcha = Boolean(hcaptcha?.key?.trim() || process.env.NEXT_PUBLIC_HCAPTCHA_KEY?.trim());

  // 获取网站类型列表
  const [typeList, setTypeList] = useState<WebType[]>([]);
  const getWebTypeList = async () => {
    const { data } = await getWebTypeListAPI();
    setTypeList(data?.filter((item) => !item.isAdmin) ?? []);
  };

  useEffect(() => {
    // 页面加载后检查是否有需要显示的消息
    const message = localStorage.getItem('toastMessage');
    if (message) {
      toast.success(message, toastConfig);
      localStorage.removeItem('toastMessage'); // 显示后删除消息
    }

    getWebTypeList();
  }, []);

  const {
    handleSubmit,
    control,
    formState: { errors },
    trigger,
  } = useForm<Web>({ defaultValues: {} as Web });

  const onSubmit: SubmitHandler<Web> = async (data, event) => {
    event?.preventDefault();

    // 清除之前的人机验证错误
    setCaptchaError('');

    // 只有配置了HCaptcha时才需要验证
    if (hasHCaptcha && !captchaToken) return setCaptchaError('请完成人机验证');

    setLoading(true);
    const { code, message } = await addWebDataAPI({ ...data, createTime: Date.now().toString(), h_captcha_response: captchaToken! });
    if (code !== 200) {
      captchaRef.current?.resetCaptcha();
      return toast.error(message, toastConfig);
    }
    setLoading(false);

    // 清除验证相关状态
    setCaptchaError('');
    setCaptchaToken(null);
    captchaRef.current?.resetCaptcha();

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
      <Button color="primary" variant="shadow" onPress={onOpen}>
        申请友联
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
              <ModalHeader className="flex flex-col gap-1">申请友链</ModalHeader>

              <ModalBody>
                <div className="mx-auto mb-4 p-3 space-y-2 border-l-[3px] border-primary bg-[#ecf7fe] rounded-md text-sm text-black-b">
                  <p>1、网站无任何违法乱纪的内容</p>
                  <p>2、网站文章不少于10篇（防止一时兴起）</p>
                  <p>3、网站原创内容占 80% (婉拒资源分享、资讯新闻、论坛社区之类的站点)</p>
                </div>

                <Controller
                  name="title"
                  control={control}
                  rules={{ required: '请输入网站名称' }}
                  render={({ field }) => (
                    <>
                      <Input {...field} type="text" label="网站名称" variant="bordered" placeholder="示例：宇阳" isInvalid={!!errors.title?.message} errorMessage={errors.title?.message} onBlur={() => trigger('title')} classNames={{ inputWrapper }} />
                    </>
                  )}
                />

                <Controller
                  name="description"
                  control={control}
                  rules={{ required: '请输入网站介绍' }}
                  render={({ field }) => (
                    <>
                      <Textarea {...field} label="网站介绍" variant="bordered" placeholder="示例：逐渐强大的全栈开发工程师" isInvalid={!!errors.description?.message} errorMessage={errors.description?.message} onBlur={() => trigger('description')} classNames={{ inputWrapper }} />
                    </>
                  )}
                />

                <Controller
                  name="image"
                  control={control}
                  rules={{ required: '请输入图片地址', pattern: { value: /^https?:\/\//, message: '请输入正确的图片地址' } }}
                  render={({ field }) => (
                    <>
                      <Input {...field} type="text" label="图片地址" variant="bordered" placeholder="示例：https://liuyuyang.net/avatar.jpg" isInvalid={!!errors.image?.message} errorMessage={errors.image?.message} onBlur={() => trigger('image')} classNames={{ inputWrapper }} />
                    </>
                  )}
                />

                <Controller
                  name="url"
                  control={control}
                  rules={{ required: '请输入网站地址', pattern: { value: /^https?:\/\//, message: '请输入正确的网站地址' } }}
                  render={({ field }) => (
                    <>
                      <Input {...field} type="text" label="网站地址" variant="bordered" placeholder="示例：https://liuyuyang.net/" isInvalid={!!errors.url?.message} errorMessage={errors.url?.message} onBlur={() => trigger('url')} classNames={{ inputWrapper }} />
                    </>
                  )}
                />

                <Controller
                  name="email"
                  control={control}
                  rules={{ pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: '请输入正确的邮箱' } }}
                  render={({ field }) => (
                    <>
                      <Input {...field} type="text" label="邮箱（选填）" variant="bordered" placeholder="示例：liuyuyang1024@yeah.net" isInvalid={!!errors.email?.message} errorMessage={errors.email?.message} onBlur={() => trigger('email')} classNames={{ inputWrapper }} />
                    </>
                  )}
                />

                <Controller
                  name="rss"
                  control={control}
                  rules={{ pattern: { value: /^https?:\/\//, message: '请输入正确的订阅地址' } }}
                  render={({ field }) => (
                    <>
                      <Input {...field} type="text" label="订阅地址（选填）" variant="bordered" placeholder="示例：https://liuyuyang.net/index.php/feed/" isInvalid={!!errors.rss?.message} errorMessage={errors.rss?.message} onBlur={() => trigger('rss')} classNames={{ inputWrapper }} />
                    </>
                  )}
                />

                <Controller
                  name="typeId"
                  control={control}
                  rules={{ required: '请选择网站类型' }}
                  render={({ field }) => (
                    <>
                      <Select
                        {...field}
                        label="网站类型"
                        variant="bordered"
                        placeholder="示例：技术类"
                        isInvalid={!!errors.typeId?.message}
                        errorMessage={errors.typeId?.message}
                        classNames={{
                          trigger: 'hover:!border-primary data-[focus=true]:!border-primary data-[open=true]:!border-primary rounded-md',
                        }}
                      >
                        {typeList?.map((item) => (
                          <SelectItem key={item.id}>{item.name}</SelectItem>
                        ))}
                      </Select>
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
                <Button color="primary" isLoading={loading} onPress={() => handleSubmit(onSubmit)()} className="w-full">
                  加入
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
