import dayjs from 'dayjs';
import { Record } from '@/types/app/record';

export interface RecordStats {
  total: number;
  thisMonth: number;
  withMood: number;
  latestMood?: string;
}

export function computeRecordStats(records: Record[]): RecordStats {
  const monthKey = dayjs().format('YYYY-MM');
  const withMood = records.filter((r) => r.mood?.trim());
  return {
    total: records.length,
    thisMonth: records.filter((r) => r.createTime && dayjs(+r.createTime).format('YYYY-MM') === monthKey).length,
    withMood: withMood.length,
    latestMood: withMood[0]?.mood,
  };
}
