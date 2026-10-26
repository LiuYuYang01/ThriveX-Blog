'use client';

import dayjs from 'dayjs';
import { RiMapPinLine } from 'react-icons/ri';

import type { Diary } from '@/types/app/diary';
import DiaryPhotos from '../DiaryPhotos';

import { WEATHER_META } from './weather';

interface Props {
  diary?: Diary;
  // 页码：整本按写入顺序编号，翻到哪页就看到哪页
  num?: number;
  total?: number;
}

const WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

export default function DiarySheet({ diary, num, total }: Props) {
  if (!diary) return <div aria-hidden className="diary-sheet is-blank" />;

  const date = dayjs(diary.diaryDate);
  const weather = WEATHER_META[diary.weather ?? ''];
  const WeatherIcon = weather?.icon;

  return (
    <div className="diary-sheet">
      <div className="diary-sheet-head">
        <span className="diary-sheet-date">{date.format('YYYY年M月D日')}</span>
        <span className="diary-sheet-week">{WEEKDAYS[date.day()]}</span>
      </div>

      {diary.mood || WeatherIcon || diary.location ? (
        <p className="diary-sheet-meta">
          {diary.mood ? <span className="diary-sheet-mood">{diary.mood}</span> : null}
          {weather ? (
            <span className="diary-sheet-tag">
              <WeatherIcon className="size-3.5" />
              {weather.label}
            </span>
          ) : null}
          {diary.location ? (
            <span className="diary-sheet-tag">
              <RiMapPinLine className="size-3.5" />
              {diary.location}
            </span>
          ) : null}
        </p>
      ) : null}

      <h2 className="diary-sheet-title">{diary.title || '无题'}</h2>
      <div className="diary-sheet-rule" />

      <div className="diary-sheet-text">
        {diary.content.split(/\n{2,}/).map((para, i) => (
          <p key={i}>{para}</p>
        ))}
        <DiaryPhotos images={diary.images ?? []} />
      </div>

      {num ? (
        <div className="diary-sheet-num">
          {num}/{total}
        </div>
      ) : null}
    </div>
  );
}
