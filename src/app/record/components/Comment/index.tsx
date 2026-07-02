'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Bounce, ToastOptions, toast } from 'react-toastify';
import { Spinner } from '@heroui/react';
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

export default function RecordCommentPanel({ recordId }: Props) {
  const [comments, setComments] = useState<RecordComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [commentId, setCommentId] = useState(0);
  const [placeholder, setPlaceholder] = useState('写评论…');
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const captchaRef = useRef<HCaptchaType>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState('');

  const config = useConfigStore();
  const hasHCaptcha = !!config?.other?.hcaptcha_key;

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
  } = useForm<CommentForm>({});

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getRecordCommentListAPI(recordId, { pageNum: 1, pageSize: 50 });
      setComments(data.result ?? []);
    } catch (error) {
      console.error('获取说说评论失败:', error);
    } finally {
      setLoading(false);
    }
  }, [recordId]);

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
    requestAnimationFrame(() => contentRef.current?.focus());
  };

  const replyComment = (id: number, name: string) => {
    setCommentId(id);
    setPlaceholder(`回复 ${name}：`);
    setShowForm(true);
    requestAnimationFrame(() => contentRef.current?.focus());
  };

  const onSubmit = async (data: CommentForm) => {
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
    closeForm();
    localStorage.setItem('comment_data', JSON.stringify(data));
    setSubmitting(false);
    void fetchComments();
  };

  const totalCount = comments.reduce((sum, item) => sum + 1 + (item.children?.length ?? 0), 0);

  return (
    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50">
      <div className="flex items-center justify-between gap-2 text-sm text-slate-400 dark:text-slate-500">
        <div className="flex items-center gap-1.5">
          <RiMessage3Line className="w-4 h-4" />
          <span>{totalCount > 0 ? `${totalCount} 条评论` : '评论'}</span>
        </div>
        {!showForm && (
          <button
            type="button"
            onClick={openCommentForm}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            aria-label="评论"
          >
            <RiMessage3Line className="w-4 h-4" />
          </button>
        )}
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
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 break-words">{item.content}</p>
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
                              <div className="min-w-0 text-sm leading-relaxed break-words">
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
          <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
            <textarea
              {...register('content', { required: '请输入评论内容' })}
              placeholder={placeholder}
              className="tw_form w-full p-3 min-h-20 text-sm"
              ref={(e) => {
                register('content').ref(e);
                contentRef.current = e;
              }}
            />
            {errors.content && <span className="text-red-400 text-xs">{errors.content.message}</span>}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <input type="text" className="tw_form h-9 px-3 text-sm" placeholder="昵称" {...register('name', { required: '请输入昵称' })} />
              <input
                type="text"
                className="tw_form h-9 px-3 text-sm"
                placeholder="网站（选填）"
                {...register('url', { pattern: { value: /^https?:\/\//, message: '请输入有效链接' } })}
              />
            </div>

            {hasHCaptcha && (
              <div>
                <HCaptcha ref={captchaRef} setToken={(token) => { setCaptchaToken(token); setCaptchaError(''); }} />
                {captchaError && <span className="text-red-400 text-xs">{captchaError}</span>}
              </div>
            )}

            <div className="flex items-center gap-2">
              <button type="button" className="text-xs text-slate-400 hover:text-slate-600" onClick={closeForm}>
                取消
              </button>
              {submitting ? (
                <Spinner size="sm" />
              ) : (
                <button type="submit" className="ml-auto px-4 h-9 text-sm text-white rounded-lg bg-primary hover:bg-primary/80">
                  发表评论
                </button>
              )}
            </div>
          </form>
        </Show>
      </div>
    </div>
  );
}
