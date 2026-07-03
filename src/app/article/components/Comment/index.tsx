'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { addCommentDataAPI } from '@/api/comment';
import { Bounce, ToastOptions, toast } from 'react-toastify';
import { Spinner, Popover, PopoverTrigger, PopoverContent } from '@/ThriveUI';
import HCaptchaType from '@hcaptcha/react-hcaptcha';
import List from './components/List';
import HCaptcha from '@/components/HCaptcha';
import EmojiBag from '@/components/EmojiBag';
import { useConfigStore } from '@/stores';
import 'react-toastify/dist/ReactToastify.css';
import './index.scss';

interface Props {
  articleId: number;
  articleTitle: string;
}

interface CommentForm {
  content: string;
  name: string;
  email: string;
  url: string;
  avatar: string;
}

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

const CommentForm = ({ articleId }: Props) => {
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [commentId, setCommentId] = useState(articleId);
  const [placeholder, setPlaceholder] = useState('来发一针见血的评论吧~');

  const [loading, setLoading] = useState(false);
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);

  const commentRef = useRef<{ getCommentList: () => void }>(null);

  const captchaRef = useRef<HCaptchaType>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState<string>('');

  // 获取HCaptcha配置
  const config = useConfigStore();
  const hasHCaptcha = !!config?.other?.hcaptcha_key;

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<CommentForm>({});

  // 如果之前评论过，就从本地取数据，不需要再重新填写
  useEffect(() => {
    const info = JSON.parse(localStorage.getItem('comment_data') || '{}');
    setValue('name', info.name || '');
    setValue('email', info.email || '');
    setValue('avatar', info.avatar || '');
    setValue('url', info.url || '');
  }, [setValue]);

  const onSubmit = async (data: CommentForm) => {
    // 清除之前的人机验证错误
    setCaptchaError('');

    // 只有配置了HCaptcha时才需要验证
    if (hasHCaptcha && !captchaToken) return setCaptchaError('请完成人机验证');

    setLoading(true);

    // 判断是不是QQ邮箱，如果是就把QQ截取出来，然后用QQ当做头像
    const email_index = data.email.lastIndexOf('@qq.com');
    if (email_index !== -1) {
      const qq = data.email.substring(0, email_index);

      // 判断是否是纯数字的QQ
      if (!isNaN(+qq)) data.avatar = `https://q1.qlogo.cn/g?b=qq&nk=${qq}&s=640`;
    }

    const { code, message } = await addCommentDataAPI({
      ...data,
      articleId,
      commentId: commentId === articleId ? 0 : commentId,
      createTime: Date.now().toString(),
      h_captcha_response: captchaToken,
    });

    if (code !== 200) {
      captchaRef.current?.resetCaptcha();
      return toast.error('发布评论失败：' + message, toastConfig);
    }

    toast.success('🎉 提交成功, 请等待审核!', toastConfig);

    // 发布成功后初始化表单
    setCommentId(articleId);
    setValue('content', '');
    setPlaceholder('来发一针见血的评论吧~');
    commentRef.current?.getCommentList();
    setLoading(false);

    // 清除验证相关状态
    setCaptchaError('');
    setCaptchaToken(null);
    captchaRef.current?.resetCaptcha();

    // 提交成功后把评论的数据持久化到本地
    localStorage.setItem('comment_data', JSON.stringify(data));
  };

  // 处理人机验证成功回调
  const handleCaptchaSuccess = (token: string) => {
    setCaptchaToken(token);
    setCaptchaError(''); // 清除错误提示
  };

  // 回复评论
  const replyComment = (id: number, name: string) => {
    contentRef.current?.focus();
    setCommentId(id);
    setPlaceholder(`回复评论给：${name}`);
  };

  // 选择表情后插入到当前光标位置并同步表单
  const handleEmojiSelect = (emoji: string) => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const currentValue = textarea.value || '';
    const start = textarea.selectionStart ?? currentValue.length;
    const end = textarea.selectionEnd ?? currentValue.length;

    const newValue = currentValue.slice(0, start) + emoji + currentValue.slice(end);

    // 更新 DOM 与 react-hook-form 值
    textarea.value = newValue;
    setValue('content', newValue, { shouldDirty: true, shouldValidate: true });

    // 将光标移动到插入表情后
    const newCaretPos = start + emoji.length;
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(newCaretPos, newCaretPos);
    });

    // 选择后关闭面板
    setIsEmojiOpen(false);
  };

  return (
    <div id="article-comment" className="CommentComponent">
      <div className="mt-[70px]">
        <div className="title relative top-0 left-0 w-full h-[1px] mb-10 bg-[#f7f7f7] dark:bg-black-b  "></div>

        <form className="flex flex-wrap justify-between mt-4 space-y-2 text-xs xs:text-sm" onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full relative">
            <textarea
              {...register('content', { required: '请输入内容' })}
              placeholder={placeholder}
              className="tw_form w-full p-4 min-h-36"
              ref={(e) => {
                register('content').ref(e);
                contentRef.current = e;
              }}
            />
            <span className="text-red-400 text-sm pl-3">{errors.content?.message}</span>

            {/* 表情按钮与面板 */}
            <div className="absolute bottom-5 right-5">
              <Popover placement="bottom" isOpen={isEmojiOpen} onOpenChange={setIsEmojiOpen}>
                <PopoverTrigger>
                  <button type="button" className="py-1 px-2 text-2xl rounded-md hover:bg-gray-50 border border-transparent hover:border-gray-200">
                    😀
                  </button>
                </PopoverTrigger>

                <PopoverContent>
                  <div className="max-w-96 z-50">
                    <EmojiBag onEmojiSelect={handleEmojiSelect} />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex flex-col w-[32%]">
            <input type="text" className="tw_form w-full h-9 pl-4" placeholder="你的名称" {...register('name', { required: '请输入名称' })} />
            <span className="text-red-400 text-sm pl-3 mt-1">{errors.name?.message}</span>
          </div>

          <div className="flex flex-col w-[32%]">
            <input type="text" className="tw_form w-full h-9 pl-4" placeholder="你的邮箱（选填）" {...register('email', { pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: '请输入正确的邮箱' } })} />
            <span className="text-red-400 text-sm pl-3 mt-1">{errors.email?.message}</span>
          </div>

          <div className="flex flex-col w-[32%]">
            <input type="text" className="tw_form w-full h-9 pl-4" placeholder="头像（选填）" {...register('avatar', { pattern: { value: /^https?:\/\//, message: '请输入正确的头像链接' } })} />
            <span className="text-red-400 text-sm pl-3 mt-1">{errors.avatar?.message}</span>
          </div>

          <div className="w-full flex flex-col">
            <input type="text" className="tw_form w-full h-9 pl-4" placeholder="你的站点（选填）" {...register('url', { pattern: { value: /^https?:\/\//, message: '请输入正确的网站链接' } })} />
            <span className="text-red-400 text-sm pl-3 mt-1">{errors.url?.message}</span>
          </div>

          {hasHCaptcha && (
            <div className="flex flex-col">
              <HCaptcha ref={captchaRef} setToken={handleCaptchaSuccess} />
              {captchaError && <span className="text-red-400 text-sm pl-3 mt-1">{captchaError}</span>}
            </div>
          )}

          {loading ? (
            <div className="w-full h-10 flex justify-center !mt-4">
              <Spinner />
            </div>
          ) : (
            <button className="w-full h-10 !mt-4 text-white rounded-md bg-primary hover:bg-primary/80 active:bg-primary/90 active:scale-95 transition-transform text-center" type="submit">
              发表评论
            </button>
          )}
        </form>

        <List ref={commentRef} id={articleId} reply={replyComment} />
      </div>
    </div>
  );
};

export default CommentForm;
