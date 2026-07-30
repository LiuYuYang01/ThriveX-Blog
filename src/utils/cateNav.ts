import { Cate } from '@/types/app/cate';

export function getCateNavHref(item: Cate): string {
  if (item.type === 'cate') {
    return `/cate/${item.id}?name=${item.name}`;
  }
  return item.url || '/';
}

export function getCateNavTarget(type: Cate['type']): '_self' | '_blank' {
  return type === 'nav' ? '_blank' : '_self';
}

export function getCateNavRel(type: Cate['type']): 'noopener noreferrer' | undefined {
  return type === 'nav' ? 'noopener noreferrer' : undefined;
}

/** 是否为闪念 /record 导航链接（用于拦截为弹窗） */
export function isRecordNavHref(href: string): boolean {
  try {
    const path = (href.startsWith('http') ? new URL(href).pathname : href.split('?')[0]).replace(/\/+$/, '') || '/';
    return path === '/record';
  } catch {
    return href === '/record' || href.startsWith('/record?');
  }
}
