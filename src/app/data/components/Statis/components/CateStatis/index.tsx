import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { getCateListAPI } from '@/api/cate';
import cate from './svg/cate.svg';

import * as echarts from 'echarts/core';
import { TooltipComponent, LegendComponent } from 'echarts/components';
import { PieChart } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([TooltipComponent, LegendComponent, PieChart, CanvasRenderer, LabelLayout]);

export default () => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const [list, setList] = useState<{ value: number; name: string }[]>([]);

  const getCateArticleCount = async () => {
    const { data } = await getCateListAPI();
    setList(data?.result?.map(({ count, name }) => ({ value: count, name })) ?? []);
  };

  useEffect(() => {
    getCateArticleCount();
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      const myChart = echarts.init(chartRef.current);

      const option = {
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderColor: 'rgba(0,0,0,0.08)',
          borderWidth: 1,
          textStyle: { color: '#1e293b' },
        },
        legend: {
          show: false,
        },
        color: ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#ec4899'],
        series: [
          {
            name: '数量统计',
            type: 'pie',
            radius: ['40%', '75%'],
            center: ['50%', '50%'],
            avoidLabelOverlap: false,
            padAngle: 3,
            itemStyle: {
              borderRadius: 8,
              borderColor: 'transparent',
              borderWidth: 0,
            },
            label: {
              show: true,
              formatter: '{b}\n{d}%',
              fontSize: 12,
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 12,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.2)',
              },
              label: { show: true },
            },
            labelLine: {
              show: true,
              length: 8,
              length2: 6,
            },
            data: list,
          },
        ],
      };

      myChart.setOption(option);

      const handleResize = () => {
        myChart.resize();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        myChart.dispose();
      };
    }
  }, [list]);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/30 p-6 overflow-hidden">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20">
          <Image src={cate.src} alt="分类一览" width={22} height={22} className="opacity-90" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">分类一览</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">文章分类占比分布</p>
        </div>
      </div>
      <div ref={chartRef} className="min-w-[260px] h-[280px] w-full" />
    </div>
  );
};
