'use client';

import dayjs from 'dayjs';
import { RiMapPinLine } from 'react-icons/ri';

import type { Diary } from '@/types/app/diary';
import DiaryMarkdown from './DiaryMarkdown';

const WEEKDAYS = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

interface EntryProps {
  diary: Diary;
  side: 'left' | 'right';
  index: number;
}

export function DiaryEntrySheet({ diary, side, index }: EntryProps) {
  const date = dayjs(diary.diaryDate);

  return (
    <div className={`page page--${side}`} data-entry={index}>
      <div className="sheet">
        <div className="masthead">
          <span className="masthead-ym">{date.format('YYYY.MM')}</span>
          <time className="day" dateTime={diary.diaryDate}>
            {date.format('DD')}
          </time>
          <span className="weekday">{WEEKDAYS[date.day()]}</span>
        </div>
        <div className="hairline" />

        {diary.title ? <h2 className="entry-title">{diary.title}</h2> : null}

        <div className="leaf-ruled">
          <div className="body">
            <DiaryMarkdown content={diary.content} />
          </div>
        </div>

        <div className="sheet-tail">
          {diary.location ? (
            <p className={`entry-place ${side === 'right' ? 'entry-place--end' : ''}`}>
              <RiMapPinLine aria-hidden className="entry-place-icon" />
              {diary.location}
            </p>
          ) : null}

          <div className="sheet-foot">
            <span className="folio">{index + 1}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DiaryTitleSheet({ meta }: { meta: string }) {
  return (
    <div className="page page--title">
      <div className="title-sheet">
        <div className="title-mark">日记本</div>
        <div className="title-rule" />
        <p className="title-epigraph">记录点点滴滴</p>
        <div className="title-flower">
          <svg viewBox="0 0 120 100" fill="none" stroke="#8b7554" strokeWidth="1.2" strokeLinecap="round" aria-hidden="true">
            <path d="M60 96C58 70 58 44 62 16M62 56C45 52 36 40 38 26c14-2 24 10 24 30ZM63 40c3-16 14-24 27-20 1 15-11 24-27 20ZM61 74C47 76 38 70 37 58c12-3 22 3 24 16Z" />
            <circle cx="62" cy="16" r="5" />
            <circle cx="54" cy="12" r="4" />
            <circle cx="69" cy="11" r="4" />
            <circle cx="62" cy="22" r="2.5" fill="#8b7554" />
          </svg>
        </div>
        <div className="title-meta">{meta}</div>
      </div>
    </div>
  );
}

export function DiaryHalfTitle() {
  return (
    <div className="page page--half-title">
      <div className="half-title">
        <div className="half-title-mark">日记本</div>
        <div className="half-title-rule" />
      </div>
    </div>
  );
}

export function DiaryColophonSheet({ count, note }: { count: number; note: string }) {
  return (
    <div className="page page--colophon">
      <div className="colophon">
        <div className="colophon-mark">Fin.</div>
        <p>读到这里，这一册就翻完了。</p>
        <p>{note}</p>
        <div className="colophon-rule" />
        <p className="colophon-small">DIARY · VOL. 01</p>
        <p className="colophon-fine">私人的、缓慢的、不必给谁看的生活记录</p>
        <span className="sr-only">共 {count} 篇</span>
      </div>
    </div>
  );
}

export function DiaryEndpaper() {
  return (
    <div className="page page--endpaper">
      <div className="endpaper" />
    </div>
  );
}

export function DiaryVerso() {
  return (
    <div className="page page--verso">
      <div className="verso">
        <span className="verso-rule" />
        <span className="verso-mark">日记本</span>
        <span className="verso-rule" />
      </div>
    </div>
  );
}
