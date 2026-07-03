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
import { RiDownloadLine, RiLink } from 'react-icons/ri';
import { ShareActionIcon } from '@/components/ActionBar/icons';
import { toast } from 'react-toastify';
import { cn } from '@/lib/utils';
import {
  actionCardClass,
  actionCardDividerClass,
  actionIconWrapClass,
  actionLabelClass,
  actionMinimalButtonClass,
  actionMinimalCountClass,
  actionMinimalIconClass,
  actionMinimalItemClass,
  actionPillClass,
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
  minimal?: boolean;
  className?: string;
  shareCount?: number;
  onShare?: () => void;
}

export default function ArticleSharePoster({ data, minimal = false, className, shareCount, onShare }: Props) {
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
    onShare?.();
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
      <div className={cn(actionMinimalItemClass, minimal && className, !minimal && 'relative inline-flex select-none flex-col items-center')}>
        <button
          type="button"
          onClick={handleOpen}
          className={
            minimal
              ? cn(actionPillClass, actionMinimalButtonClass)
              : cn(actionCardClass('blue', className), 'cursor-pointer transition-colors')
          }
          aria-label="生成分享海报"
        >
          {minimal ? (
            <span className={cn(actionIconWrapClass, actionMinimalIconClass, 'flex h-11 w-11 items-center justify-center p-0')}>
              <ShareActionIcon className="h-11 w-11" />
            </span>
          ) : (
            <>
              <span className={actionIconWrapClass}>
                <ShareActionIcon className="h-[3.75rem] w-[3.75rem]" />
              </span>
              <div className={actionCardDividerClass('blue')} aria-hidden />
              <div className={actionTextColClass}>
                <span className={actionPrimaryClass}>分享</span>
                <span className={actionLabelClass}>生成海报</span>
              </div>
            </>
          )}
        </button>
        {minimal && typeof shareCount === 'number' && (
          <span
            className={cn(
              'mt-1 min-w-[2rem] rounded-full px-2 py-0.5 text-center text-xs font-bold leading-none text-[#409EFF] tabular-nums',
              actionMinimalCountClass,
            )}
          >
            {shareCount}
          </span>
        )}
      </div>

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
