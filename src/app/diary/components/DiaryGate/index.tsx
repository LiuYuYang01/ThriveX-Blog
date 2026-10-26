'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button, TextField } from '@/ThriveUI';
import { useAppConfig } from '@/components/AppConfigProvider';
import { unlockDiaryAPI } from '@/api/diary';
import type { DiaryQuestion } from '@/types/app/diary';
import { saveCoverRect } from '../../coverRect';
import DiaryCoverFront from '../DiaryCover';
import DiaryLamp from '../DiaryLamp';

import './index.scss';

interface Props {
  questions: DiaryQuestion[];
  // 上一次解锁的凭证已过期，回到封面时说明原因
  expired?: boolean;
}

const UNLOCK_MS = 260;

export default function DiaryGate({ questions, expired }: Props) {
  const router = useRouter();
  const { author } = useAppConfig();
  const pagesRef = useRef<HTMLSpanElement>(null);

  const [questionId, setQuestionId] = useState<number>(questions[0]?.id ?? 0);
  const [answer, setAnswer] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [opened, setOpened] = useState(false);
  const [unlocking, setUnlocking] = useState(false);

  const empty = !questions.length;

  // 开门前记住封面在桌上的位置，门里合上本子时要滑回这里
  const openBook = () => {
    saveCoverRect(pagesRef.current);
    setOpened(true);
  };

  const submit = async () => {
    const value = answer.trim();
    if (!questionId || !value || busy) return;

    setBusy(true);
    setError('');
    try {
      const { code, message } = await unlockDiaryAPI(questionId, value);
      if (code === 200) {
        setUnlocking(true);
        const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.setTimeout(() => router.refresh(), reduce ? 0 : UNLOCK_MS);
        return;
      }
      setError(message || '不是这句，再想一想。');
    } catch {
      setError('网络不太平，稍后再试。');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="diary-gate diary-scene relative min-h-screen overflow-hidden px-4 pb-20 sm:px-6 lg:px-8">
      <DiaryLamp />

      <div className="relative mx-auto flex min-h-[calc(100vh-120px)] w-full flex-col items-center justify-center pt-[92px] pb-16">
        <h1 className="sr-only">日记本</h1>

        <div className={`diary-booklet ${opened ? 'is-open' : ''} ${unlocking ? 'is-unlocking' : ''}`}>
          <div id="diary-lock" className="diary-page" inert={!opened}>
            <div className="diary-page-content">
              <header className="diary-page-head">
                <span aria-hidden className="diary-page-mark">密</span>
                <h2 className="diary-page-title">密语</h2>
                <span className="diary-page-count">共 {questions.length} 句</span>
              </header>

              <form
                className="diary-lock-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  void submit();
                }}
              >
                <div className="diary-lock-body">
                  {expired ? <p className="diary-lock-note">上次阅读的时间到了，再答一次密语。</p> : null}
                  <p className="diary-lock-lead">答对其中一句，就能翻开本子。</p>

                  <fieldset className="diary-lock-questions">
                    <legend className="sr-only">选择一句密语</legend>
                    {questions.map((item) => {
                      const active = item.id === questionId;
                      return (
                        <label key={item.id} className={`diary-question ${active ? 'is-active' : ''}`}>
                          <input type="radio" name="diary-question" value={item.id} checked={active} onChange={() => setQuestionId(item.id)} className="sr-only" />
                          <span aria-hidden className="diary-question-dot" />
                          <span>{item.question}</span>
                        </label>
                      );
                    })}
                  </fieldset>

                  <div className="diary-lock-answer">
                    <label htmlFor="diary-answer" className="diary-lock-label">你的答案</label>
                    <TextField id="diary-answer" autoComplete="off" placeholder="写下来" className="diary-answer" value={answer} onChange={(e) => setAnswer(e.target.value)} disabled={busy} />
                  </div>

                  <div className="diary-lock-actions">
                    <p aria-live="polite" className="diary-lock-status">{error}</p>
                    <Button type="submit" color="primary" loading={busy} disabled={!answer.trim()} className={`diary-unlock ${answer.trim() ? '' : 'is-idle'}`}>
                      打开本子
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <span ref={pagesRef} aria-hidden className="diary-cover-pages" />

          <button type="button" className="diary-cover" onClick={openBook} disabled={empty || opened} aria-label="打开日记本" aria-expanded={opened} aria-controls="diary-lock">
            <DiaryCoverFront author={author?.name} />
            <span aria-hidden className="diary-cover-face diary-cover-back">
              <span className="diary-cover-frame" />
              <span className="diary-cover-inside-title">日记本</span>
              {author?.name ? <span className="diary-cover-inside-author">{author.name} 记</span> : null}
              <span className="diary-cover-seal diary-cover-seal-back">慎独</span>
            </span>
          </button>
        </div>

        <p className={`diary-gate-cue ${opened ? 'is-gone' : ''}`}>{empty ? '还没写下密语，本子打不开' : '点一下封面'}</p>
      </div>
    </div>
  );
}
