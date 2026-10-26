'use client';

import Image from 'next/image';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useReducedMotion } from 'framer-motion';
import { LuEye, LuEyeOff } from 'react-icons/lu';

import CSDN from '@/assets/svg/socializing/CSDN.svg';
import Douyin from '@/assets/svg/socializing/Douyin.svg';
import GitHub from '@/assets/svg/socializing/GitHub.svg';
import Gitee from '@/assets/svg/socializing/Gitee.svg';
import Juejin from '@/assets/svg/socializing/Juejin.svg';
import QQ from '@/assets/svg/socializing/QQ.svg';
import Weixin from '@/assets/svg/socializing/Weixin.svg';

import { Button, TextField } from '@/ThriveUI';
import { getArticleDataAPI } from '@/api/article';
import { Social } from '@/types/app/config';

import './index.scss';

interface Props {
  id: number;
  social?: Social[];
}

// 信舌向后翻折的那一拍，走完再进正文
const SEAL_MS = 460;

// 和侧栏作者卡同一批渠道图标
const socialIcons: { [name: string]: string } = {
  CSDN,
  Douyin,
  GitHub,
  Gitee,
  Juejin,
  QQ,
  Weixin,
};

export default function Encrypt({ id, social = [] }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const reduce = useReducedMotion();

  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  // 口令已对，信正在拆
  const [opened, setOpened] = useState(false);

  const idle = !password.trim();

  const submit = async () => {
    const value = password.trim();
    if (!value || busy) return;

    setBusy(true);
    setStatus('');

    try {
      const { code } = await getArticleDataAPI(id, value);

      if (code === 200) {
        setOpened(true);
        setStatus('拆开了，这就进去。');
        // 保持 busy 到页面真的换掉，中途不再让人按第二下
        window.setTimeout(() => router.push(`${pathname}?password=${encodeURIComponent(value)}`), reduce ? 0 : SEAL_MS);
        return;
      }

      setBusy(false);
      setStatus(code === 613 ? '口令不对，再想一想。' : '这道门好像没开，稍后再试。');
    } catch {
      setBusy(false);
      setStatus('网络不太平，稍后再试。');
    }
  };

  return (
    <section className={`letter ${opened ? 'is-open' : ''}`} aria-labelledby="letter-title">
      {/* 信舌：拆开后绕上沿向后翻，火漆印跟着走 */}
      <div className="letter-flap" aria-hidden>
        <span className="letter-seal">封</span>
      </div>

      <div className="letter-page">
        <h2 id="letter-title" className="letter-title">
          这一篇封着口
        </h2>
        <p className="letter-lead">作者给它设了访问口令，答对了就能从头读到尾。</p>

        <form
          className="letter-form"
          onSubmit={(e) => {
            e.preventDefault();
            void submit();
          }}
        >
          <div className={`letter-field ${status && !opened ? 'is-wrong' : ''}`}>
            <TextField
              id="letter-password"
              label="访问口令"
              type={visible ? 'text' : 'password'}
              autoComplete="off"
              placeholder="写在这里"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={busy}
              aria-invalid={!!status && !opened}
              aria-describedby={status ? 'letter-status' : undefined}
              endContent={
                <button
                  type="button"
                  onClick={() => setVisible((v) => !v)}
                  aria-label={visible ? '隐藏口令' : '显示口令'}
                  aria-pressed={visible}
                  className="letter-eye cursor-pointer"
                >
                  {visible ? <LuEyeOff className="h-4 w-4" /> : <LuEye className="h-4 w-4" />}
                </button>
              }
            />
          </div>

          <div className="letter-actions">
            <p id="letter-status" aria-live="polite" className={`letter-status ${opened ? 'is-ok' : ''}`}>
              {status}
            </p>

            <Button variant="light" className="letter-back" onPress={() => router.push('/')}>
              回首页
            </Button>

            <Button type="submit" color="primary" loading={busy} disabled={idle || busy} className={`letter-open ${idle ? 'is-idle' : ''}`}>
              {opened ? '拆开了' : '拆开看看'}
            </Button>
          </div>
        </form>

        {social.length ? (
          <div className="letter-channels">
            <span className="letter-channels-label">拿不到口令？去这些渠道找作者</span>
            <span className="letter-channels-list">
              {social.map((item) => (
                <a key={item.name} href={item.url} target="_blank" rel="noopener noreferrer" title={item.name} className="letter-channel">
                  <Image src={socialIcons[item.name]} alt={item.name} width={20} height={20} />
                </a>
              ))}
            </span>
          </div>
        ) : null}
      </div>
    </section>
  );
}
