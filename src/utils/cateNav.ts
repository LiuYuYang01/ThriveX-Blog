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
