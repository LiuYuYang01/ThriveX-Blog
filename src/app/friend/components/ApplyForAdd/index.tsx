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
} from '@/ThriveUI';
import { type SubmitHandler } from 'react-hook-form';
import { Web, WebType } from '@/types/app/web';
import { addWebAction } from '@/actions/web';
import { getWebTypeListAPI } from '@/api/web';
import { Bounce, toast, ToastOptions } from 'react-toastify';
import HCaptchaType from '@hcaptcha/react-hcaptcha';
import HCaptcha from '@/components/HCaptcha';
import { useAppConfig } from '@/components/AppConfigProvider';
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
  const { isOpen, onOpen, onClose } = useDisclosure();

  const captchaRef = useRef<HCaptchaType>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState<string>('');

  const { other } = useAppConfig();
  const hasHCaptcha = !!other?.hcaptcha_key;

  const [typeList, setTypeList] = useState<WebType[]>([]);
  const getWebTypeList = async () => {
    const { data } = await getWebTypeListAPI();
    setTypeList(data?.filter((item) => !item.isAdmin) ?? []);
  };

  useEffect(() => {
    getWebTypeList();
  }, []);

  const methods = useForm<Web>({ defaultValues: {} as Web });

  const onSubmit: SubmitHandler<Web> = async (data, event) => {
    event?.preventDefault();
    setCaptchaError('');

    if (hasHCaptcha && !captchaToken) return setCaptchaError('请完成人机验证');

    setLoading(true);
    const { code, message } = await addWebAction({
      ...data,
      createTime: Date.now().toString(),
      h_captcha_response: captchaToken!,
    });
    if (code !== 200) {
      captchaRef.current?.resetCaptcha();
      setLoading(false);
      return toast.error(message, toastConfig);
    }
    setLoading(false);

    setCaptchaError('');
    setCaptchaToken(null);
    captchaRef.current?.resetCaptcha();
    methods.reset({} as Web);

    toast.success('🎉 提交成功, 请等待审核!', toastConfig);
    onClose();
  };

  const handleCaptchaSuccess = (token: string) => {
    setCaptchaToken(token);
    setCaptchaError('');
  };

  return (
    <>
      <Button color="primary" onPress={onOpen}>
        申请友联
      </Button>

      <Modal
        open={isOpen}
        onClose={onClose}
        title="申请友链"
        className="max-w-2xl"
        footer={
          <Button color="primary" isLoading={loading} onPress={() => methods.handleSubmit(onSubmit)()} className="w-full">
            加入
          </Button>
        }
      >
        <div className="mx-auto mb-4 space-y-2 rounded-md border-l-[3px] border-primary bg-[#ecf7fe] p-3 text-sm text-black-b">
          <p>1、网站无任何违法乱纪的内容</p>
          <p>2、网站文章不少于10篇（防止一时兴起）</p>
          <p>3、网站原创内容占 80% (婉拒资源分享、资讯新闻、论坛社区之类的站点)</p>
        </div>

        <FormProvider {...methods}>
          <form className="space-y-4" onSubmit={methods.handleSubmit(onSubmit)}>
            <Input name="title" label="网站名称" placeholder="示例：宇阳" rules={{ required: '请输入网站名称' }} />
            <Textarea name="description" label="网站介绍" placeholder="示例：逐渐强大的全栈开发工程师" rules={{ required: '请输入网站介绍' }} />
            <Input
              name="image"
              label="图片地址"
              placeholder="示例：https://liuyuyang.net/avatar.jpg"
              rules={{
                required: '请输入图片地址',
                pattern: { value: /^https?:\/\//, message: '请输入正确的图片地址' },
              }}
            />
            <Input
              name="url"
              label="网站地址"
              placeholder="示例：https://liuyuyang.net/"
              rules={{
                required: '请输入网站地址',
                pattern: { value: /^https?:\/\//, message: '请输入正确的网站地址' },
              }}
            />
            <Input
              name="email"
              label="邮箱（选填）"
              placeholder="示例：liuyuyang1024@yeah.net"
              rules={{
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: '请输入正确的邮箱',
                },
              }}
            />
            <Input
              name="rss"
              label="订阅地址（选填）"
              placeholder="示例：https://liuyuyang.net/index.php/feed/"
              rules={{ pattern: { value: /^https?:\/\//, message: '请输入正确的订阅地址' } }}
            />
            <Select
              name="typeId"
              label="网站类型"
              placeholder="示例：技术类"
              rules={{ required: '请选择网站类型' }}
              options={typeList.map((item) => ({ value: item.id, label: item.name }))}
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
    </>
  );
};
