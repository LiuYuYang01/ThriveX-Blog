'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useConfigStore } from '@/stores';
import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion';
import TimerSvg from '@/assets/svg/other/timer.svg';
import SidebarCard from '@/components/Sidebar/SidebarCard';

const AnimatedNumber = ({
  value,
  className = '',
  onComplete,
}: {
  value: number;
  className?: string;
  onComplete?: () => void;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    if (isInView) {
      const animation = animate(count, value, {
        duration: 1.8,
        ease: 'easeOut',
        onComplete: () => onComplete?.(),
      });
      return animation.stop;
    }
  }, [isInView, value, count, onComplete]);

  return (
    <motion.span ref={ref} className={className}>
      {rounded}
    </motion.span>
  );
};

const AnimatedAlarmClock = () => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const seconds = now.getSeconds();
  const minutes = now.getMinutes();
  const hours = now.getHours() % 12;

  const secondAngle = seconds * 6;
  const minuteAngle = minutes * 6 + seconds * 0.1;
  const hourAngle = hours * 30 + minutes * 0.5;

  return (
    <div className="relative flex shrink-0 justify-center items-center">
      <div className="absolute inset-0 flex justify-center items-center">
        <div className="w-16 h-16 rounded-full bg-primary/5 dark:bg-primary/10 blur-xl" />
      </div>

      <motion.svg
        width="72"
        height="78"
        viewBox="0 0 92 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
      >
        {/* 闹钟底座 */}
        <path d="M28 88 L36 78 L56 78 L64 88 Z" className="fill-slate-300 dark:fill-zinc-600" />
        <path d="M32 78 L60 78 L58 74 L34 74 Z" className="fill-slate-400 dark:fill-zinc-500" />

        {/* 铃铛 + 锤头 */}
        <motion.g
          animate={{ rotate: [0, -10, 10, -6, 6, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 6, ease: 'easeInOut' }}
          style={{ transformOrigin: '46px 22px' }}
        >
          <ellipse cx="28" cy="22" rx="10" ry="7" className="fill-primary/80 dark:fill-primary" />
          <ellipse cx="64" cy="22" rx="10" ry="7" className="fill-primary/80 dark:fill-primary" />
          <rect x="44" y="14" width="4" height="10" rx="2" className="fill-primary dark:fill-primary" />
          <circle cx="46" cy="30" r="3" className="fill-amber-400 dark:fill-amber-300" />
        </motion.g>

        {/* 表盘外圈 */}
        <circle cx="46" cy="58" r="34" className="fill-white dark:fill-black-a stroke-primary/30 dark:stroke-primary/40" strokeWidth="2" />
        <circle cx="46" cy="58" r="30" className="fill-slate-50 dark:fill-black-b stroke-slate-200 dark:stroke-zinc-700" strokeWidth="1" />

        {/* 刻度 */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const x1 = 46 + Math.cos(angle) * 26;
          const y1 = 58 + Math.sin(angle) * 26;
          const x2 = 46 + Math.cos(angle) * 29;
          const y2 = 58 + Math.sin(angle) * 29;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              className="stroke-slate-300 dark:stroke-zinc-600"
              strokeWidth={i % 3 === 0 ? 2 : 1}
              strokeLinecap="round"
            />
          );
        })}

        {/* 时针 */}
        <line
          x1="46"
          y1="58"
          x2="46"
          y2="42"
          className="stroke-slate-700 dark:stroke-gray-200"
          strokeWidth="2.5"
          strokeLinecap="round"
          transform={`rotate(${hourAngle}, 46, 58)`}
        />

        {/* 分针 */}
        <line
          x1="46"
          y1="58"
          x2="46"
          y2="34"
          className="stroke-slate-600 dark:stroke-gray-300"
          strokeWidth="1.8"
          strokeLinecap="round"
          transform={`rotate(${minuteAngle}, 46, 58)`}
        />

        {/* 秒针 */}
        <motion.line
          x1="46"
          y1="62"
          x2="46"
          y2="32"
          stroke="#539dfd"
          strokeWidth="1"
          strokeLinecap="round"
          transform={`rotate(${secondAngle}, 46, 58)`}
          animate={{ opacity: [1, 0.6, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />

        {/* 中心点 */}
        <circle cx="46" cy="58" r="3" className="fill-primary" />
        <circle cx="46" cy="58" r="1.5" className="fill-white dark:fill-black-a" />
      </motion.svg>
    </div>
  );
};

const calculateTimeDifference = (startTimestamp?: number) => {
  if (!startTimestamp) return { years: 0, months: 0, days: 0, totalDays: 0 };

  const startDate = new Date(+startTimestamp);
  const currentDate = new Date();

  let years = currentDate.getFullYear() - startDate.getFullYear();
  let months = currentDate.getMonth() - startDate.getMonth();
  let days = currentDate.getDate() - startDate.getDate();

  if (days < 0) {
    const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    days += lastMonth.getDate();
    months--;
  }
  if (months < 0) {
    months += 12;
    years--;
  }

  const totalDays = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  return { years, months, days, totalDays };
};

const statItems = [
  { key: 'years', label: '年' },
  { key: 'months', label: '月' },
  { key: 'days', label: '天' },
] as const;

export default () => {
  const { web } = useConfigStore();
  const [timeDiff, setTimeDiff] = useState(() => calculateTimeDifference(web?.create_time));

  useEffect(() => {
    setTimeDiff(calculateTimeDifference(web?.create_time));

    const timer = setInterval(() => {
      setTimeDiff(calculateTimeDifference(web?.create_time));
    }, 60_000);

    return () => clearInterval(timer);
  }, [web?.create_time]);

  return (
    <SidebarCard
      title={
        <>
          <Image src={TimerSvg} alt="站点运行时间" width={33} height={23} /> 站点运行时间
        </>
      }
      contentClassName="mt-3 flex flex-col gap-2.5"
    >
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-center gap-3"
      >
        <AnimatedAlarmClock />

        <div className="flex items-baseline gap-1">
          <AnimatedNumber
            value={timeDiff.totalDays}
            className="text-2xl font-semibold text-primary tabular-nums"
          />
          <span className="text-sm text-slate-500 dark:text-gray-400 font-medium">天</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="flex items-center justify-center gap-1.5"
      >
        {statItems.map(({ key, label }, index) => (
          <div key={key} className="flex items-center gap-1.5">
            {index > 0 && <span className="text-slate-200 dark:text-zinc-700">|</span>}
            <div className="flex items-baseline gap-0.5 px-2 py-1 rounded-lg bg-slate-50 dark:bg-black-a/60">
              <AnimatedNumber
                value={timeDiff[key]}
                className="text-sm font-semibold text-slate-700 dark:text-gray-200 tabular-nums"
              />
              <span className="text-xs text-slate-400 dark:text-zinc-500">{label}</span>
            </div>
          </div>
        ))}
      </motion.div>
    </SidebarCard>
  );
};
