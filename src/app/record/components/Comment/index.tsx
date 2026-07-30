'use client';

import { useEffect, useRef, useState } from 'react';
import { type SubmitHandler } from 'react-hook-form';
import { Bounce, ToastOptions, toast } from 'react-toastify';
import { FormProvider, Input, Spinner, Textarea, useForm } from '@/ThriveUI';
import HCaptchaType from '@hcaptcha/react-hcaptcha';
import HCaptcha from '@/components/HCaptcha';
import Show from '@/components/Show';
import { addRecordCommentAction } from '@/actions/record';
import { getRecordCommentListAPI } from '@/api/recordComment';
import { RecordComment } from '@/types/app/recordComment';
import { useAppConfig } from '@/components/AppConfigProvider';

interface Props {
  recordId: number;
  onCountChange?: (count: number) => void;
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

export default function RecordCommentPanel({ recordId, onCountChange }: Props) {
  const [comments, setComments] = useState<RecordComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [commentId, setCommentId] = useState(0);
  const [placeholder, setPlaceholder] = useState('写评论…');
  const captchaRef = useRef<HCaptchaType>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState('');
  const [showCaptcha, setShowCaptcha] = useState(false);

  const { publicConfig } = useAppConfig();
  const hasHCaptcha = !!publicConfig?.hcaptcha_key?.key;

  const methods = useForm<CommentForm>({});
  const { setValue, setFocus, reset, handleSubmit } = methods;

  const fetchComments = async () => {
    setLoading(true);
    try {
      const { data } = await getRecordCommentListAPI(recordId, { pageNum: 1, pageSize: 50 });
      setComments(data.result ?? []);
      onCountChange?.(data.total ?? 0);
    } catch (error) {
      console.error('获取说说评论失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const info = JSON.parse(localStorage.getItem('comment_data') || '{}');
    setValue('name', info.name || '');
    setValue('email', info.email || '');
    setValue('avatar', info.avatar || '');
    setValue('url', info.url || '');
  }, [setValue]);

  useEffect(() => {
    void fetchComments();
  }, [recordId]);

  const closeForm = () => {
    setShowForm(false);
    setCommentId(0);
    setPlaceholder('写评论…');
    setValue('content', '');
    setCaptchaToken(null);
    setCaptchaError('');
    setShowCaptcha(false);
    captchaRef.current?.resetCaptcha();
  };

  const replyComment = (id: number, name: string) => {
    setCommentId(id);
    setPlaceholder(`回复 ${name}：`);
    setShowForm(true);
    requestAnimationFrame(() => setFocus('content'));
  };

  const onSubmit: SubmitHandler<CommentForm> = async (data) => {
    setCaptchaError('');
    if (hasHCaptcha && !captchaToken) {
      setShowCaptcha(true);
      setCaptchaError('请完成人机验证');
      return;
    }

    setSubmitting(true);

    const emailIndex = data.email.lastIndexOf('@qq.com');
    if (emailIndex !== -1) {
      const qq = data.email.substring(0, emailIndex);
      if (!isNaN(+qq)) {
        data.avatar = `https://q1.qlogo.cn/g?b=qq&nk=${qq}&s=640`;
      }
    }

    const { code, message } = await addRecordCommentAction({
      ...data,
      recordId,
      commentId,
      createTime: Date.now().toString(),
      h_captcha_response: captchaToken,
    });

    if (code !== 200) {
      captchaRef.current?.resetCaptcha();
      toast.error('发布评论失败：' + message, toastConfig);
      setSubmitting(false);
      return;
    }

    toast.success('🎉 评论已提交！请等待管理员审核', toastConfig);
    reset({ ...data, content: '' });
    setCommentId(0);
    setPlaceholder('写评论…');
    setCaptchaToken(null);
    setCaptchaError('');
    setShowCaptcha(false);
    captchaRef.current?.resetCaptcha();
    localStorage.setItem('comment_data', JSON.stringify(data));
    setSubmitting(false);
    void fetchComments();
  };

  const renderName = (item: Pick<RecordComment, 'name' | 'url'>) =>
    item.url ? (
      <a href={item.url} target="_blank" rel="noopener noreferrer" className="font-medium text-[#576b95] dark:text-[#7b93c4]">
        {item.name}
      </a>
    ) : (
      <span className="font-medium text-[#576b95] dark:text-[#7b93c4]">{item.name}</span>
    );

  return (
    <div className="text-[13px] leading-[1.55]">
      {loading ? (
        <div className="flex justify-center py-3">
          <Spinner size="sm" />
        </div>
      ) : (
        <>
          <Show is={!!comments.length}>
            <div className="space-y-1.5">
              {comments.map((item) => (
                <div key={item.id}>
                  <p className="m-0 wrap-break-word text-[#191919] dark:text-slate-200">
                    {renderName(item)}
                    <span className="text-[#191919] dark:text-slate-200">：</span>
                    <span>{item.content}</span>
                    <button
                      type="button"
                      className="ml-1.5 inline cursor-pointer border-0 bg-transparent p-0 text-[12px] text-[#b2b2b2] hover:text-[#576b95]"
                      onClick={() => replyComment(item.id!, item.name)}
                    >
                      回复
                    </button>
                  </p>

                  {!!item.children?.length && (
                    <div className="mt-1 space-y-1 pl-0">
                      {item.children.map((reply) => (
                        <p key={reply.id} className="m-0 wrap-break-word text-[#191919] dark:text-slate-200">
                          {renderName(reply)}
                          <span>：</span>
                          {reply.replyName ? <span className="text-[#576b95] dark:text-[#7b93c4]">@{reply.replyName} </span> : null}
                          <span>{reply.content}</span>
                          <button
                            type="button"
                            className="ml-1.5 inline cursor-pointer border-0 bg-transparent p-0 text-[12px] text-[#b2b2b2] hover:text-[#576b95]"
                            onClick={() => replyComment(reply.id!, reply.name)}
                          >
                            回复
                          </button>
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Show>

          <Show is={!comments.length && !showForm}>
            <p className="m-0 py-1 text-center text-[#b2b2b2]">暂无评论</p>
          </Show>
        </>
      )}

      <Show is={showForm}>
        <FormProvider {...methods}>
          <form className={`space-y-2 ${comments.length || loading ? 'mt-2.5' : ''}`} onSubmit={handleSubmit(onSubmit)}>
            <Textarea
              name="content"
              placeholder={placeholder}
              rules={{ required: '请输入评论内容' }}
              fieldClassName="w-full"
              className="min-h-16 border-[#e5e5e5]! bg-white! text-[13px] shadow-none! dark:border-white/10! dark:bg-[#151a22]!"
            />

            <div className="flex gap-2">
              <Input
                name="name"
                placeholder="昵称"
                rules={{ required: '请输入昵称' }}
                fieldClassName="w-24 shrink-0"
                className="h-8 border-[#e5e5e5]! bg-white! text-[13px] shadow-none! dark:border-white/10! dark:bg-[#151a22]!"
              />
              <Input
                name="url"
                placeholder="网站（选填）"
                rules={{ pattern: { value: /^https?:\/\//, message: '请输入有效链接' } }}
                fieldClassName="min-w-0 flex-1"
                className="h-8 border-[#e5e5e5]! bg-white! text-[13px] shadow-none! dark:border-white/10! dark:bg-[#151a22]!"
              />
            </div>

            {hasHCaptcha && showCaptcha && (
              <div>
                <HCaptcha
                  ref={captchaRef}
                  setToken={(token) => {
                    setCaptchaToken(token);
                    setCaptchaError('');
                  }}
                />
                {captchaError && <span className="text-xs text-red-400">{captchaError}</span>}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-0.5">
              <button
                type="button"
                onClick={closeForm}
                className="cursor-pointer border-0 bg-transparent p-0 text-[13px] text-[#888] hover:text-[#576b95]"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="cursor-pointer rounded-sm border-0 bg-[#576b95] px-3 py-1 text-[13px] text-white hover:bg-[#4a5d82] disabled:opacity-60"
              >
                {submitting ? '发送中…' : '发送'}
              </button>
            </div>
          </form>
        </FormProvider>
      </Show>

      <Show is={!showForm}>
        <button
          type="button"
          onClick={() => {
            setShowForm(true);
            requestAnimationFrame(() => setFocus('content'));
          }}
          className="mt-1.5 w-full cursor-pointer border-0 bg-transparent py-1 text-left text-[13px] text-[#b2b2b2] hover:text-[#576b95]"
        >
          写评论…
        </button>
      </Show>
    </div>
  );
}
