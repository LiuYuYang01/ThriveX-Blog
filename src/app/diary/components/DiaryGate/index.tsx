'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiKey } from 'react-icons/fi';

import { Button, TextField } from '@/ThriveUI';
import { useAppConfig } from '@/components/AppConfigProvider';
import { unlockDiaryAPI } from '@/api/diary';
import type { DiaryQuestion } from '@/types/app/diary';

import './index.scss';

interface Props {
  questions: DiaryQuestion[];
  // 上一次解锁的凭证已过期，回到封面时说明原因
  expired?: boolean;
}

const OPEN_MS = 620;

export default function DiaryGate({ questions, expired }: Props) {
  const router = useRouter();
  const { author } = useAppConfig();

  const [questionId, setQuestionId] = useState<number>(questions[0]?.id ?? 0);
  const [answer, setAnswer] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [opening, setOpening] = useState(false);

  const submit = async () => {
    const value = answer.trim();
    if (!questionId || !value || busy) return;

    setBusy(true);
    setError('');
    try {
      const { code, message } = await unlockDiaryAPI(questionId, value);
      if (code === 200) {
        const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduce) {
          router.refresh();
          return;
        }
        setOpening(true);
        window.setTimeout(() => router.refresh(), OPEN_MS);
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
    <div className="diary-gate relative min-h-screen overflow-hidden bg-[#fbfbfd] px-4 pb-20 sm:px-6 lg:px-8 dark:bg-[#111318]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[460px] bg-[radial-gradient(circle_at_20%_18%,rgba(83,157,253,0.1),transparent_38%),radial-gradient(circle_at_82%_12%,rgba(180,64,47,0.09),transparent_36%)] dark:bg-[radial-gradient(circle_at_20%_18%,rgba(83,157,253,0.13),transparent_38%),radial-gradient(circle_at_82%_12%,rgba(214,112,92,0.12),transparent_36%)]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-120px)] w-full max-w-[980px] items-start pt-[88px] lg:items-center lg:pt-20">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-16">
          <div className="diary-cover-stage mx-auto w-[240px] sm:w-[270px]">
            <div className={`diary-cover ${opening ? 'is-opening' : ''}`}>
              <span aria-hidden className="diary-cover-spine" />
              <div className="diary-cover-body">
                <div className="diary-cover-slip">
                  <h1 className="diary-cover-title">日记本</h1>
                  {author?.name ? <p className="diary-cover-author">{author.name} 记</p> : null}
                </div>
              </div>
              <span aria-hidden className="diary-cover-seal">
                慎独
              </span>
            </div>
          </div>

          <div className={`diary-lock ${opening ? 'is-closing' : ''}`}>
            <h2 className="m-0 text-[26px] font-bold leading-snug text-[#191919] dark:text-white">{questions.length ? '这本日记不上搜索引擎' : '这本日记还没有留下密语'}</h2>
            <p className="mt-3 text-sm leading-7 text-[#5b6472] dark:text-slate-400">{questions.length ? '主理人在封底留了几句密语，答对任意一句，本子为你打开七天。' : '需要主理人先在后台写下至少一句密语，别人才答得开。'}</p>

            {expired && questions.length ? <p className="mt-4 border-l-2 border-[var(--diary-seal)] pl-3 text-sm text-[#5b6472] dark:text-slate-400">上次阅读的时间到了，本子重新合上，再答一次密语。</p> : null}

            {questions.length ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void submit();
                }}
              >
                <fieldset className="mt-7 border-0 p-0">
                  <legend className="sr-only">选择一句密语</legend>
                  <div className="flex flex-col gap-2">
                    {questions.map((item) => {
                      const active = item.id === questionId;
                      return (
                        <label key={item.id} className={`diary-question ${active ? 'is-active' : ''}`}>
                          <input type="radio" name="diary-question" value={item.id} checked={active} onChange={() => setQuestionId(item.id)} className="sr-only" />
                          <span aria-hidden className="diary-question-dot" />
                          <span className="text-sm leading-6">{item.question}</span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="mt-5 flex items-center gap-3">
                  <TextField aria-label="密语答案" autoComplete="off" placeholder="写下你的答案" fieldClassName="min-w-0 flex-1" value={answer} onChange={(e) => setAnswer(e.target.value)} disabled={busy} />
                  <Button type="submit" color="primary" loading={busy} disabled={!answer.trim()} className="shrink-0 cursor-pointer" startContent={<FiKey className="text-base" />}>
                    打开本子
                  </Button>
                </div>

                <div aria-live="polite" className="min-h-6">
                  {error ? <p className="m-0 mt-3 text-sm text-[var(--diary-seal)]">{error}</p> : null}
                </div>
              </form>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
