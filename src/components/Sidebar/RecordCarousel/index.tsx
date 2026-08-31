import { getRecordListCacheAPI } from '@/lib/record';
import { getThemeCoversCacheAPI } from '@/lib/theme';
import { extractText, getStableImage } from '@/utils';
import { getRelativeTimeLabel } from '@/utils/dayFormat';
import RecordCarouselClient from './RecordCarouselClient';
import { Record } from '@/types/app/record';

const PAGE_SIZE = 5;

function parseRecordImages(images: Record['images']): string[] {
  if (Array.isArray(images)) return images.filter(Boolean);
  try {
    const parsed = JSON.parse((images as string) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
}

export default async function RecordCarousel() {
  const [{ data }, covers] = await Promise.all([
    getRecordListCacheAPI({ pageNum: 1, pageSize: PAGE_SIZE }),
    getThemeCoversCacheAPI(),
  ]);

  const list = (data?.result ?? [])
    .slice(0, PAGE_SIZE)
    .map((item) => {
      const imageList = parseRecordImages(item.images);
      const image = imageList[0] || getStableImage('', covers, String(item.id));
      const text = extractText(item.content || '');

      return {
        id: item.id!,
        text,
        image,
        mood: item.mood || undefined,
        timeLabel: item.createTime ? getRelativeTimeLabel(item.createTime) : undefined,
      };
    })
    .filter((item) => item.text || item.image);

  if (!list.length) return null;

  return <RecordCarouselClient list={list} />;
}
