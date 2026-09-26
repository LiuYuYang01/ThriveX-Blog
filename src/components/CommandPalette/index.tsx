'use client';

import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Modal, TextField } from '@/ThriveUI';
import { IconType } from 'react-icons';
import {
  IoChatbubbleEllipsesOutline,
  IoDocumentOutline,
  IoDocumentTextOutline,
  IoFishOutline,
  IoHardwareChipOutline,
  IoHeartOutline,
  IoHomeOutline,
  IoImagesOutline,
  IoMapOutline,
  IoPeopleOutline,
  IoPersonOutline,
  IoPricetagsOutline,
  IoSearchOutline,
  IoSparklesOutline,
  IoStatsChartOutline,
  IoTrophyOutline,
} from 'react-icons/io5';
import { getSearchAPI } from '@/api/search';
import { SearchResult } from '@/types/app/search';
import { useCommandPaletteStore, useRecordModalStore } from '@/stores';
import { useAppConfig } from '../AppConfigProvider';
import Empty from '../Empty';

interface PaletteItem {
  key: string;
  icon: IconType;
  // 展示文本（闪念为命中片段，其余为名称）
  text: string;
  href: string;
  // 弹窗模式下闪念导航改为打开闪念弹窗
  recordFocus?: boolean;
}

// 内置页面导航项
const pages: Omit<PaletteItem, 'key'>[] = [
  { icon: IoHomeOutline, text: '首页', href: '/' },
  { icon: IoImagesOutline, text: '画廊', href: '/album' },
  { icon: IoPricetagsOutline, text: '标签墙', href: '/tags' },
  { icon: IoPeopleOutline, text: '朋友圈', href: '/friend' },
  { icon: IoTrophyOutline, text: '人生里程碑', href: '/milestone' },
  { icon: IoMapOutline, text: '那年走过的路', href: '/footprint' },
  { icon: IoStatsChartOutline, text: '数据统计', href: '/data' },
  { icon: IoPersonOutline, text: '关于我', href: '/my' },
  { icon: IoFishOutline, text: '鱼塘', href: '/fishpond' },
  { icon: IoChatbubbleEllipsesOutline, text: '一些互动', href: '/echoes' },
  { icon: IoHeartOutline, text: '赞助鸣谢', href: '/sponsors' },
  { icon: IoDocumentOutline, text: '简历', href: '/resume' },
  { icon: IoHardwareChipOutline, text: '我的设备', href: '/equipment' },
];

const kbdSty =
  'inline-block rounded border border-neutral-200 px-1.5 py-0.5 text-[10px] leading-none dark:border-neutral-700';

// 关键词命中高亮（字符串 split 而非正则，避免关键词被当作正则解析）
const highlight = (text: string, key: string) => {
  const parts = text.split(key);
  return parts.map((part, i) => (
    <Fragment key={i}>
      {part}
      {i < parts.length - 1 && <span className="text-primary">{key}</span>}
    </Fragment>
  ));
};

export default () => {
  const router = useRouter();
  const { open, closeModal } = useCommandPaletteStore();
  const openRecordModal = useRecordModalStore((s) => s.openModal);
  const { theme } = useAppConfig();

  const [searchKey, setSearchKey] = useState('');
  const [data, setData] = useState<SearchResult>();
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  // 全局快捷键 Ctrl/Cmd + K 唤起或关闭
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey) || e.key.toLowerCase() !== 'k') return;
      e.preventDefault();
      const { open, openModal, closeModal } = useCommandPaletteStore.getState();
      if (open) closeModal();
      else openModal();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // 关闭时重置搜索状态
  useEffect(() => {
    if (!open) {
      setSearchKey('');
      setData(undefined);
      setActiveIndex(0);
    }
  }, [open]);

  // 关键词变化时防抖请求；清理函数取消过期请求，避免清空后再搜被旧响应覆盖
  useEffect(() => {
    if (!open) return;

    const key = searchKey.trim();
    if (!key) {
      setData(undefined);
      return;
    }

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      try {
        const { data: result } = await getSearchAPI({ keyword: key, limit: 5 });
        if (!cancelled) setData(result);
      } catch {
        if (!cancelled) setData(undefined);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [searchKey, open]);

  const keyword = searchKey.trim();

  // 页面导航：有关键词时按名称过滤
  const pageItems: PaletteItem[] = useMemo(() => {
    const list = pages.filter((item) => !keyword || item.text.toLowerCase().includes(keyword.toLowerCase()));
    // 弹窗模式下闪念入口改为打开弹窗
    return list.map((item) =>
      item.href === '/record' && theme?.record_mode === 'modal' ? { ...item, key: 'record', recordFocus: true } : { ...item, key: item.href },
    );
  }, [keyword, theme]);

  const sections = useMemo(() => {
    const result: { label: string; items: PaletteItem[] }[] = [{ label: '页面', items: pageItems }];
    if (data) {
      result.push({
        label: '文章',
        items: data.articles.map((item) => ({ key: `article-${item.id}`, icon: IoDocumentTextOutline, text: item.title, href: `/article/${item.id}` })),
      });
      result.push({
        label: '闪念',
        items: data.records.map((item) => ({ key: `record-${item.id}`, icon: IoSparklesOutline, text: item.snippet, href: `/record?id=${item.id}` })),
      });
    }
    return result;
  }, [pageItems, data]);

  // 展平列表供键盘上下选择，同时计算各分组在其中的起始下标
  const flatItems = useMemo(() => sections.flatMap((section) => section.items), [sections]);
  const sectionStarts = useMemo(() => {
    let offset = 0;
    return sections.map((section) => {
      const start = offset;
      offset += section.items.length;
      return { label: section.label, items: section.items, start };
    });
  }, [sections]);

  // 关键词有搜索结果支撑且页面也无命中时才展示空状态，避免防抖期间闪烁
  const showEmpty = !!keyword && !!data && !data.articles?.length && !data.records?.length && !pageItems.length;

  useEffect(() => setActiveIndex(0), [searchKey, data]);

  // 键盘选中项滚动到可视区域
  useEffect(() => {
    listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  const select = (item: PaletteItem) => {
    closeModal();
    if (item.recordFocus) {
      openRecordModal();
      return;
    }
    router.push(item.href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const total = flatItems.length;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (total ? (i + 1) % total : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (total ? (i - 1 + total) % total : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = flatItems[activeIndex];
      if (item) select(item);
    } else if (e.key === 'Escape') {
      closeModal();
    }
  };

  return (
    <Modal open={open} onClose={closeModal} className="max-w-xl sm:-translate-y-16">
      <div onKeyDown={onKeyDown}>
        <TextField
          autoFocus
          type="text"
          placeholder="搜索文章、闪念，或输入页面名称跳转"
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
          endContent={<IoSearchOutline className="h-4 w-4 text-neutral-400" />}
        />

        <div ref={listRef} className="mt-4 max-h-[50dvh] overflow-y-auto">
          {sectionStarts.map((section, si) =>
            section.items.length ? (
              <div key={section.label} className={si ? 'mt-3' : ''}>
                <div className="mb-1 px-4 text-xs text-gray-400">{section.label}</div>
                {section.items.map((item, i) => {
                  const index = section.start + i;
                  const active = index === activeIndex;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      data-active={active}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => select(item)}
                      className={`mb-1 flex w-full cursor-pointer items-center gap-3 rounded-md px-4 py-2 text-left text-gray-700 dark:text-[#8c9ab1] ${
                        active ? 'bg-[#f0f7ff] text-primary! dark:bg-[#25282d]' : ''
                      }`}
                    >
                      <item.icon className="h-4.5 w-4.5 shrink-0" />
                      <span className={`min-w-0 flex-1 ${item.key.startsWith('record-') ? 'line-clamp-2' : ''}`}>
                        {highlight(item.text, keyword)}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : null,
          )}

          {showEmpty && <Empty info="暂无相关内容" />}
        </div>

        <div className="mt-4 flex items-center justify-end gap-4 text-xs text-neutral-400">
          <span className="flex items-center gap-1">
            <kbd className={kbdSty}>↑</kbd>
            <kbd className={kbdSty}>↓</kbd> 切换
          </span>
          <span className="flex items-center gap-1">
            <kbd className={kbdSty}>↵</kbd> 打开
          </span>
          <span className="flex items-center gap-1">
            <kbd className={kbdSty}>Esc</kbd> 关闭
          </span>
        </div>
      </div>
    </Modal>
  );
};
