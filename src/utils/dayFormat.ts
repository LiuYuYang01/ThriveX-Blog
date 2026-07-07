import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localeData from 'dayjs/plugin/localeData';
import updateLocale from 'dayjs/plugin/updateLocale';

dayjs.extend(relativeTime);
dayjs.extend(localeData);
dayjs.extend(updateLocale);

// 更新 locale 配置以自定义显示
dayjs.updateLocale('en', {
    relativeTime: {
        future: 'in %s',
        past: '%s前',
        s: '几秒',
        m: '1 分钟',
        mm: '%d 分钟',
        h: '1 小时',
        hh: '%d 小时',
        d: '1 天',
        dd: '%d 天',
        M: '1 个月',
        MM: '%d 个月',
        y: '1 年',
        yy: '%d 年'
    }
});

export function dayFormat(timestamp: number | string) {
    const now = dayjs();
    const target = dayjs(+timestamp);

    if (now.isSame(target, 'day')) {
        return '今天';
    } else if (now.subtract(1, 'day').isSame(target, 'day')) {
        return '昨天';
    } else if (now.subtract(2, 'day').isSame(target, 'day')) {
        return '前天';
    } else {
        return target.fromNow();
    }
}

export function getRelativeTimeLabel(ts: string | number | Date | undefined): string {
    if (ts == null) return '';
    const now = dayjs();
    const then = dayjs(+ts);
    const diffDays = now.startOf('day').diff(then.startOf('day'), 'day');
    const diffMonths = now.diff(then, 'month', true);
    const diffYears = now.diff(then, 'year', true);

    if (diffDays === 0) return `今天 ${then.format('HH:mm')}`;
    if (diffDays === 1) return `昨天 ${then.format('HH:mm')}`;
    if (diffDays >= 2 && diffDays <= 6) return `${diffDays}天前`;
    if (diffDays >= 7 && diffDays <= 13) return '一周前';
    if (diffDays >= 14 && diffDays <= 20) return '两周前';
    if (diffDays >= 21 && diffDays <= 27) return '三周前';
    if (diffMonths >= 1 && diffMonths < 2) return '一月前';
    if (diffMonths >= 2 && diffMonths < 3) return '两月前';
    if (diffMonths >= 3 && diffMonths < 6) return '三月前';
    if (diffMonths >= 6 && diffMonths < 12) return '半年前';
    if (diffYears >= 1 && diffYears < 2) return '一年前';
    if (diffYears >= 2 && diffYears < 3) return '两年前';
    if (diffYears >= 3) return `${Math.floor(diffYears)}年前`;
    return '';
}