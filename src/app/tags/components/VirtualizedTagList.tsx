'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import TagItemCard from './TagItemCard';
import { Tag } from '@/types/app/tag';

interface VirtualizedTagListProps {
  tags: Tag[];
  containerHeight?: number; // 容器高度
  batchSize?: number; // 每批加载的数量
  initialBatchSize?: number; // 初始加载数量
}

const VirtualizedTagList: React.FC<VirtualizedTagListProps> = ({
  tags,
  containerHeight,
  batchSize = 50, // 每批加载 50 个标签（减少批次大小）
  initialBatchSize = 50, // 初始只加载 50 个（大幅减少初始DOM）
}) => {
  const [visibleCount, setVisibleCount] = useState(initialBatchSize);
  const [containerHeightState, setContainerHeightState] = useState(containerHeight || 600);
  const containerRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(false); // 防止重复加载
  const resizeTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // 动态计算容器高度（添加防抖）
  useEffect(() => {
    if (containerHeight) {
      setContainerHeightState(containerHeight);
      return;
    }

    const updateHeight = () => {
      // 清除之前的定时器
      if (resizeTimerRef.current) {
        clearTimeout(resizeTimerRef.current);
      }

      // 防抖处理
      resizeTimerRef.current = setTimeout(() => {
        const height = window.innerHeight - 200; // 减去头部和其他元素的高度
        setContainerHeightState(Math.max(400, height));
      }, 150);
    };

    // 初始计算
    const height = window.innerHeight - 200;
    setContainerHeightState(Math.max(400, height));

    window.addEventListener('resize', updateHeight, { passive: true });
    return () => {
      window.removeEventListener('resize', updateHeight);
      if (resizeTimerRef.current) {
        clearTimeout(resizeTimerRef.current);
      }
    };
  }, [containerHeight]);

  // 使用 requestAnimationFrame 优化加载
  const loadMore = useCallback(() => {
    if (isLoadingRef.current || visibleCount >= tags.length) {
      return;
    }

    isLoadingRef.current = true;

    // 使用 requestAnimationFrame 优化性能
    requestAnimationFrame(() => {
      setVisibleCount((prev) => {
        const next = Math.min(prev + batchSize, tags.length);
        isLoadingRef.current = false;
        return next;
      });
    });
  }, [visibleCount, tags.length, batchSize]);

  // 使用 Intersection Observer 实现懒加载（优化配置）
  useEffect(() => {
    if (!loadingRef.current || visibleCount >= tags.length) {
      return;
    }

    // 使用节流，避免过于频繁触发
    let ticking = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!ticking && entries[0].isIntersecting && visibleCount < tags.length && !isLoadingRef.current) {
          ticking = true;
          requestAnimationFrame(() => {
            loadMore();
            ticking = false;
          });
        }
      },
      {
        rootMargin: '300px', // 提前 300px 开始加载，减少加载次数
        threshold: 0.1,
      }
    );

    observer.observe(loadingRef.current);

    return () => {
      observer.disconnect();
    };
  }, [visibleCount, tags.length, loadMore]);

  // 获取可见的标签（使用 useMemo 优化）
  const visibleTags = useMemo(() => {
    return tags.slice(0, visibleCount);
  }, [tags, visibleCount]);

  return (
    <div
      ref={containerRef}
      style={{
        maxHeight: `${containerHeightState}px`,
        overflow: 'auto',
        position: 'relative',
        contain: 'layout style paint', // CSS containment 优化
        willChange: 'scroll-position', // 提示浏览器优化滚动
      }}
      className="w-full"
    >
      <div
        className="flex flex-wrap justify-center w-full pb-10 px-0 sm:px-10"
        style={{
          contain: 'layout', // 隔离布局影响
        }}
      >
        {visibleTags.map((tag, index) => (
          <TagItemCard key={tag.id || index} data={tag} count={tag.count || 0} index={index} />
        ))}
      </div>

      {/* 加载触发器 */}
      {visibleCount < tags.length && (
        <div ref={loadingRef} className="w-full h-20 flex items-center justify-center" style={{ minHeight: '80px', contain: 'layout' }}>
          <div className="text-gray-400 dark:text-gray-500 text-sm">
            加载中... ({visibleCount}/{tags.length})
          </div>
        </div>
      )}

      {/* 加载完成提示 */}
      {visibleCount >= tags.length && tags.length > 0 && (
        <div className="w-full h-10 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm" style={{ contain: 'layout' }}>
          共 {tags.length} 个标签
        </div>
      )}
    </div>
  );
};

export default VirtualizedTagList;
