'use client';

import { RiMapPinLine } from 'react-icons/ri';

import type { Diary } from '@/types/app/diary';
import DiaryPhotos from '../DiaryPhotos';

import { WEATHER_META } from './weather';

interface Props {
  diary: Diary;
}

export default function DiaryEntryCard({ diary }: Props) {
  const weather = WEATHER_META[diary.weather ?? ''];
  const WeatherIcon = weather?.icon;

  return (
    <article className="diary-entry py-5 first:pt-0 last:pb-0">
      {diary.title ? <h3 className="m-0 text-[19px] font-bold leading-8 text-[var(--diary-text)]">{diary.title}</h3> : null}

      {weather || diary.mood || diary.location ? (
        <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--diary-muted)]">
          {WeatherIcon ? (
            <span className="inline-flex items-center gap-1">
              <WeatherIcon className="h-3.5 w-3.5" />
              {weather?.label}
            </span>
          ) : null}
          {diary.mood ? <span className="text-sm leading-none">{diary.mood}</span> : null}
          {diary.location ? (
            <span className="inline-flex items-center gap-1">
              <RiMapPinLine className="h-3.5 w-3.5" />
              {diary.location}
            </span>
          ) : null}
        </p>
      ) : null}

      <div className="diary-entry-body mt-3 max-w-[68ch] whitespace-pre-wrap text-[15px] leading-8 text-[var(--diary-text)]">{diary.content}</div>

      <DiaryPhotos images={diary.images ?? []} />
    </article>
  );
}
