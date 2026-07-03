'use client';

import { useCallback, useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
} from '@heroui/react';
import { RiShareForwardLine, RiDownloadLine, RiLink } from 'react-icons/ri';
import { toast } from 'react-toastify';
import { cn } from '@/lib/utils';
import {
  actionCardClass,
  actionCardDividerClass,
  actionIconWrapClass,
  actionLabelClass,
  actionPrimaryClass,
  actionTextColClass,
} from '@/components/ActionCard/styles';
import { useConfigStore, useAuthorStore } from '@/stores';
import { generateArticlePoster } from '@/utils/generateArticlePoster';
import dayjs from 'dayjs';

export interface ArticleShareData {
  articleId: number;
  title: string;
  description: string;
  cover: string;
  createTime: string | number;
  view?: number;
  likeCount?: number;
}

interface Props {
  data: ArticleShareData;
  className?: string;
}

export default function ArticleSharePoster({ data, className }: Props) {
  const [open, setOpen] = useState(false);
  const [posterUrl, setPosterUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const web = useConfigStore((s) => s.web);
  const author = useAuthorStore((s) => s.author);

  const buildPoster = useCallback(async () => {
    setLoading(true);
    setPosterUrl('');
    try {
      const base = web?.url?.replace(/\/$/, '') || window.location.origin;
      const articleUrl = `${base}/article/${data.articleId}`;

      const url = await generateArticlePoster({
        title: data.title,
        description: data.description || data.title,
        cover: data.cover,
        siteName: web?.title || 'ThriveX',
        siteUrl: web?.url || window.location.origin,
        articleUrl,
        favicon: web?.favicon,
        authorName: author?.name,
        createTime: dayjs(+data.createTime).format('YYYY-MM-DD'),
        view: data.view,
        likeCount: data.likeCount,
      });
      setPosterUrl(url);
    } catch (error) {
      console.error('生成海报失败:', error);
      toast.error('海报生成失败，请稍后重试');
      setOpen(false);
    } finally {
      setLoading(false);
    }
  }, [author?.name, data, web?.favicon, web?.title, web?.url]);

  const handleOpen = () => {
    setOpen(true);
    void buildPoster();
  };

  const handleDownload = () => {
    if (!posterUrl) return;
    const link = document.createElement('a');
    link.download = `${data.title.slice(0, 20)}-分享海报.png`;
    link.href = posterUrl;
    link.click();
    toast.success('海报已保存');
  };

  const handleCopyLink = async () => {
    const base = web?.url?.replace(/\/$/, '') || window.location.origin;
    const articleUrl = `${base}/article/${data.articleId}`;
    try {
      await navigator.clipboard.writeText(articleUrl);
      toast.success('链接已复制');
    } catch {
      toast.error('复制失败，请手动复制');
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className={cn(actionCardClass('blue', className), 'cursor-pointer transition-colors')}
        aria-label="生成分享海报"
      >
        <span className={actionIconWrapClass}>
          <span className="flex h-[3.75rem] w-[3.75rem] items-center justify-center rounded-full bg-gradient-to-br from-primary via-blue-500 to-indigo-500 shadow-[0_8px_24px_rgba(83,157,253,0.35)]">
            <RiShareForwardLine className="h-7 w-7 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]" />
          </span>
        </span>

        <div className={actionCardDividerClass('blue')} aria-hidden />

        <div className={actionTextColClass}>
          <span className={actionPrimaryClass}>分享</span>
          <span className={actionLabelClass}>生成海报</span>
        </div>
      </button>

      <Modal
        isOpen={open}
        onOpenChange={setOpen}
        size="md"
        scrollBehavior="inside"
        classNames={{ base: 'bg-white dark:bg-black-b', header: 'border-b border-slate-100 dark:border-white/5' }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-base font-bold text-slate-800 dark:text-slate-100">分享海报</ModalHeader>
              <ModalBody className="py-5">
                {loading ? (
                  <div className="flex flex-col items-center justify-center gap-3 py-16">
                    <Spinner size="lg" color="primary" />
                    <p className="text-sm text-slate-400">正在生成海报…</p>
                  </div>
                ) : posterUrl ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="overflow-hidden rounded-xl border border-slate-200/80 shadow-lg dark:border-white/10">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={posterUrl} alt="文章分享海报" className="max-h-[420px] w-auto object-contain" />
                    </div>
                    <p className="text-center text-xs text-slate-400">长按或下载保存，分享给好友吧</p>
                  </div>
                ) : null}
              </ModalBody>
              <ModalFooter className="gap-2">
                <Button variant="light" onPress={onClose}>
                  关闭
                </Button>
                <Button variant="flat" startContent={<RiLink />} onPress={() => void handleCopyLink()} isDisabled={loading}>
                  复制链接
                </Button>
                <Button color="primary" startContent={<RiDownloadLine />} onPress={handleDownload} isDisabled={loading || !posterUrl}>
                  下载海报
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
