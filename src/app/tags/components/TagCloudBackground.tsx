'use client';

import React, { useEffect, useState, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { FaBook, FaBookmark, FaFileAlt, FaHashtag, FaLink, FaPaperclip, FaTag, FaFont } from 'react-icons/fa';
import { clsx } from 'clsx';

const icons = [FaBook, FaBookmark, FaFileAlt, FaHashtag, FaLink, FaPaperclip, FaTag, FaFont];

// 优化：使用固定随机数，避免重复计算
const getRandomIcon = (seed: number): React.ElementType => icons[seed % icons.length];
const getRandomTag = (tags: string[], seed: number): string => {
  if (tags.length === 0) return '';
  return tags[seed % tags.length];
};

interface TagItemProps {
  icon: React.ElementType;
  text: string;
  isLeft: boolean;
  delay: number;
}

const TagItem = memo<TagItemProps>(({ icon: Icon, text, isLeft, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: isLeft ? 100 : -100 }}
    animate={{ opacity: [0, 0.8, 0], x: isLeft ? [-100, 0, 100] : [100, 0, -100] }}
    transition={{ duration: 5, delay, repeat: Infinity, repeatType: 'loop', ease: 'linear' }}
    style={{ willChange: 'transform, opacity' }} // 优化动画性能
  >
    <div className={clsx('inline-flex items-center gap-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-400 px-3 py-1 text-sm shadow-sm')}>
      <Icon size={14} />
      <span>{text}</span>
    </div>
  </motion.div>
));

TagItem.displayName = 'TagItem';

interface TagRowProps {
  isLeft: boolean;
  rowIndex: number;
  tags: string[];
}

const TagRow = memo<TagRowProps>(({ isLeft, rowIndex, tags }) => {
  // 优化：进一步减少每行的标签数量，从 4 个减少到 3 个
  const rowTags = useMemo(
    () =>
      Array.from({ length: 3 }, (_, i) => ({
        icon: getRandomIcon(rowIndex * 3 + i),
        text: getRandomTag(tags, rowIndex * 3 + i),
        delay: i * 0.5 + rowIndex * 0.2,
        key: `${rowIndex}-${i}`,
      })),
    [rowIndex, tags]
  );

  return (
    <div className={`flex ${isLeft ? 'justify-start' : 'justify-end'} gap-4 my-8`}>
      {rowTags.map((tag) => (
        <TagItem key={tag.key} icon={tag.icon} text={tag.text} isLeft={isLeft} delay={tag.delay} />
      ))}
    </div>
  );
});

TagRow.displayName = 'TagRow';

interface Row {
  isLeft: boolean;
  index: number;
}

function TagCloudBackground({ tags }: { tags: string[] }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // 检测用户是否偏好减少动画
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    // 优化：进一步减少行数，使用更大的行高，并限制最大行数
    const rowHeight = 100; // 进一步增加行高，减少行数
    const maxRows = reducedMotion ? 5 : 10; // 如果用户偏好减少动画，则更少行数
    const numberOfRows = Math.min(maxRows, Math.ceil(window.innerHeight / rowHeight));
    setRows(Array.from({ length: numberOfRows }, (_, i) => ({ isLeft: i % 2 === 0, index: i })));
  }, [reducedMotion]);

  // 优化：使用 useMemo 缓存标签数组，避免重复计算，并且只取前100个标签用于背景动画
  const safeTags = useMemo(() => {
    const tagArray = tags && tags.length > 0 ? tags : [];
    // 只使用前100个标签，减少计算量
    return tagArray.slice(0, 100);
  }, [tags]);

  if (safeTags.length === 0) {
    return null;
  }

  // 如果用户偏好减少动画，直接返回空或简化版本
  if (reducedMotion) {
    return null;
  }

  return (
    <div
      className="absolute inset-1 h-screen overflow-hidden pointer-events-none z-0"
      style={{
        contain: 'layout paint', // CSS containment 优化
        willChange: 'contents', // 提示浏览器优化
      }}
    >
      {rows.map((row) => (
        <TagRow key={row.index} isLeft={row.isLeft} rowIndex={row.index} tags={safeTags} />
      ))}
    </div>
  );
}

export default memo(TagCloudBackground);
