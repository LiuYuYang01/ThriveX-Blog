'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { type SubmitHandler } from 'react-hook-form';
import { Bounce, ToastOptions, toast } from 'react-toastify';
import { Button, FormProvider, Input, Spinner, Textarea, useForm } from '@/ThriveUI';
import HCaptchaType from '@hcaptcha/react-hcaptcha';
import dayjs from 'dayjs';
import { RiMessage3Line } from 'react-icons/ri';
import RandomAvatar from '@/components/RandomAvatar';
import HCaptcha from '@/components/HCaptcha';
import Show from '@/components/Show';
import { addRecordCommentDataAPI, getRecordCommentListAPI } from '@/api/recordComment';
import { RecordComment } from '@/types/app/recordComment';
import { useConfigStore } from '@/stores';

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

  const config = useConfigStore();
  const hasHCaptcha = !!config?.other?.hcaptcha_key;

  const methods = useForm<CommentForm>({});
  const { setValue, setFocus, reset, handleSubmit } = methods;

  const fetchComments = useCallback(async () => {
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
  }, [recordId, onCountChange]);

  useEffect(() => {
    const info = JSON.parse(localStorage.getItem('comment_data') || '{}');
    setValue('name', info.name || '');
    setValue('email', info.email || '');
    setValue('avatar', info.avatar || '');
    setValue('url', info.url || '');
  }, [setValue]);

  useEffect(() => {
    void fetchComments();
  }, [fetchComments]);

  const closeForm = () => {
    setShowForm(false);
    setCommentId(0);
    setPlaceholder('写评论…');
    setValue('content', '');
    setCaptchaToken(null);
    setCaptchaError('');
    captchaRef.current?.resetCaptcha();
  };

  const openCommentForm = () => {
    setCommentId(0);
    setPlaceholder('写评论…');
    setShowForm(true);
    requestAnimationFrame(() => setFocus('content'));
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

    const { code, message } = await addRecordCommentDataAPI({
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
    captchaRef.current?.resetCaptcha();
    localStorage.setItem('comment_data', JSON.stringify(data));
    setSubmitting(false);
    void fetchComments();
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-2 text-sm text-slate-400 dark:text-slate-500">
        <div className="flex items-center gap-1.5">
          <RiMessage3Line className="w-4 h-4" />
          <span>想对我说些什么？</span>
        </div>
        <button
          type="button"
          onClick={openCommentForm}
          className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
          aria-label="评论"
        >
          <RiMessage3Line className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3 space-y-3">
        {loading ? (
          <div className="flex justify-center py-4">
            <Spinner size="sm" />
          </div>
        ) : (
          <>
            <Show is={!!comments.length}>
              <div className="space-y-3">
                {comments.map((item) => (
                  <div key={item.id}>
                    <div className="flex gap-2.5">
                      {item.avatar ? (
                        <img src={item.avatar} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
                      ) : (
                        <RandomAvatar className="w-8 h-8 rounded-full shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex min-w-0 flex-wrap items-center gap-2">
                            {item.url ? (
                              <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary">
                                {item.name}
                              </a>
                            ) : (
                              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{item.name}</span>
                            )}
                            <span className="text-xs text-slate-400">{dayjs(+item.createTime).format('MM-DD HH:mm')}</span>
                          </div>
                          <button
                            type="button"
                            className="shrink-0 text-xs text-slate-400 hover:text-primary cursor-pointer"
                            onClick={() => replyComment(item.id!, item.name)}
                          >
                            回复
                          </button>
                        </div>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 wrap-break-word">{item.content}</p>
                      </div>
                    </div>

                    {!!item.children?.length && (
                      <div className="mt-2 ml-10 p-2.5 rounded-lg bg-slate-50 dark:bg-white/5 space-y-2.5">
                        {item.children.map((reply) => (
                          <div key={reply.id} className="flex items-start gap-2">
                            {reply.avatar ? (
                              <img src={reply.avatar} alt="" className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5" />
                            ) : (
                              <RandomAvatar className="w-6 h-6 rounded-full shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1 min-w-0 flex items-start justify-between gap-3">
                              <div className="min-w-0 text-sm leading-relaxed wrap-break-word">
                                <span className="font-medium text-slate-700 dark:text-slate-200">{reply.name}</span>
                                <span className="text-slate-400">: </span>
                                {reply.replyName && (
                                  <span className="text-primary">@{reply.replyName} </span>
                                )}
                                <span className="text-slate-600 dark:text-slate-300">{reply.content}</span>
                              </div>
                              <button
                                type="button"
                                className="shrink-0 text-xs text-slate-400 hover:text-primary cursor-pointer"
                                onClick={() => replyComment(reply.id!, reply.name)}
                              >
                                回复
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Show>

            <Show is={!comments.length}>
              <p className="text-sm text-slate-400 text-center py-2">暂无评论，来抢沙发吧~</p>
            </Show>
          </>
        )}

        <Show is={showForm}>
          <FormProvider {...methods}>
            <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
              <Textarea
                name="content"
                placeholder={placeholder}
                rules={{ required: '请输入评论内容' }}
                fieldClassName="w-full"
                className="min-h-20 text-sm"
              />

              <div className="flex gap-2">
                <Input
                  name="name"
                  placeholder="昵称"
                  rules={{ required: '请输入昵称' }}
                  fieldClassName="w-28 shrink-0 sm:w-32"
                  className="text-sm"
                />
                <Input
                  name="url"
                  placeholder="网站（选填）"
                  rules={{ pattern: { value: /^https?:\/\//, message: '请输入有效链接' } }}
                  fieldClassName="min-w-0 flex-1"
                  className="text-sm"
                />
              </div>

              {hasHCaptcha && (
                <div>
                  <HCaptcha ref={captchaRef} setToken={(token) => { setCaptchaToken(token); setCaptchaError(''); }} />
                  {captchaError && <span className="text-xs text-red-400">{captchaError}</span>}
                </div>
              )}

              <div className="flex items-end gap-2">
                <div className="flex-1"></div>
                <Button type="button" variant="flat" onPress={closeForm}>
                  取消
                </Button>
                <Button type="submit" color="primary" isLoading={submitting}>
                  发表评论
                </Button>
              </div>
            </form>
          </FormProvider>
        </Show>
      </div>
    </div>
  );
}
