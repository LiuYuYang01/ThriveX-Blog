import { Cate, CateArticleCount } from '@/types/app/cate';

export const CATE_HERO_IMAGE = '/images/bg/xueshan1.png';

// 将分类树展开为统计项：有子分类时继续向下展开，仅统计最末级分类
export function flattenCateForStatis(list: Cate[]): CateArticleCount[] {
  const result: CateArticleCount[] = [];

  const collect = (items: Cate[]) => {
    for (const item of items) {
      if (item.children?.length) {
        collect(item.children);
      } else {
        result.push({ name: item.name, count: item.count });
      }
    }
  };

  collect(list);
  return result;
}

export function findCateById(list: Cate[], id: number): Cate | undefined {
  for (const item of list) {
    if (item.id === id) return item;
    if (item.children?.length) {
      const found = findCateById(item.children, id);
      if (found) return found;
    }
  }
}
