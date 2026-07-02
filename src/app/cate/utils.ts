import { Cate } from '@/types/app/cate';

export const CATE_HERO_IMAGE = '/images/bg/xueshan1.png';

export function findCateById(list: Cate[], id: number): Cate | undefined {
  for (const item of list) {
    if (item.id === id) return item;
    if (item.children?.length) {
      const found = findCateById(item.children, id);
      if (found) return found;
    }
  }
}
