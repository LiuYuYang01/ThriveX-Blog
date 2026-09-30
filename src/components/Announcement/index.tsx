'use client';

import { LuMegaphone } from 'react-icons/lu';
import { useEffect, useState } from 'react';

import { Button, Modal } from '@/ThriveUI';
import type { Announcement } from '@/types/app/config';

const DISMISS_KEY = 'announcement-dismiss';

interface DismissRecord {
  version: number;
  dismissed_at: number;
}

// 公告更新（version 变化）后始终重新弹出，否则在免打扰天数内静默
const shouldShow = (config: Announcement, record: DismissRecord | null) => {
  if (!record || record.version !== config.update_time) return true;
  if (!config.silent_days) return true;
  return Date.now() - record.dismissed_at >= config.silent_days * 86400_000;
};

interface Props {
  config: Announcement;
}

export default function AnnouncementModal({ config }: Props) {
  const [open, setOpen] = useState(false);
  const [remaining, setRemaining] = useState(0);

  const close = () => {
    setOpen(false);
    try {
      const record: DismissRecord = { version: config.update_time, dismissed_at: Date.now() };
      localStorage.setItem(DISMISS_KEY, JSON.stringify(record));
    } catch {
      // 隐私模式等存储不可用时忽略，仅本次不弹
    }
  };

  useEffect(() => {
    if (!config.enable || !config.content.trim()) return;
    try {
      const record = JSON.parse(localStorage.getItem(DISMISS_KEY) ?? 'null') as DismissRecord | null;
      if (shouldShow(config, record)) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, [config]);

  // auto_close 秒后自动关闭，倒计时显示在按钮上
  useEffect(() => {
    if (!open || !config.auto_close) return;
    setRemaining(config.auto_close);
    const timer = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          close();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [open]);

  if (!config.enable) return null;

  return (
    <Modal
      open={open}
      onClose={close}
      title={
        <span className="inline-flex items-center gap-2">
          <LuMegaphone className="h-5 w-5 text-primary" />
          {config.title || '站点公告'}
        </span>
      }
      footer={
        <div className="flex w-full flex-col items-end gap-1.5">
          <Button color="primary" onPress={close}>
            {config.auto_close ? `我知道了（${remaining}s）` : '我知道了'}
          </Button>
          {!!config.silent_days && (
            <span className="text-xs text-neutral-400">关闭后 {config.silent_days} 天内不再显示</span>
          )}
        </div>
      }
    >
      <div className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
        {config.content}
      </div>
    </Modal>
  );
}
