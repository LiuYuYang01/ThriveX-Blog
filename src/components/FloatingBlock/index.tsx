'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button, useDisclosure } from '@/ThriveUI';
import { BiCog, BiCommand } from 'react-icons/bi';
import { IoSearchOutline, IoArrowUpOutline, IoLogoRss } from 'react-icons/io5';
import { useAppConfig } from '@/components/AppConfigProvider';
import { useConfigStore } from '@/stores';
import Search from '../Search';
import Rss from '../Tools/components/Rss';
import { LuMoonStar } from 'react-icons/lu';
import { FaRegSun } from 'react-icons/fa';

const floatingBtnClass =
  'transition-none! active:scale-100! hover:scale-105 hover:text-primary';

const itemTransition = { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const };

const FloatingBlock = () => {
  const [isExpanded, setIsExpanded] = useState(false); // 展开状态的变量
  const [isDragging, setIsDragging] = useState(false); // 拖拽状态
  const constraintsRef = useRef(null); // 拖拽约束参考
  const { web } = useAppConfig();
  const { isDark, setIsDark } = useConfigStore();
  const { isOpen: isSearchOpen, onOpen: onSearchOpen, onClose: onSearchClose } = useDisclosure();
  const { isOpen: isRssOpen, onOpen: onRssOpen, onClose: onRssClose } = useDisclosure();

  const toggleExpanded = () => {
    // 如果正在拖拽，不触发展开/收起
    if (isDragging) return;
    setIsExpanded(!isExpanded);
  };

  // 处理拖拽开始
  const handleDragStart = () => {
    setIsDragging(true);
    // 如果展开状态，先收起
    if (isExpanded) {
      setIsExpanded(false);
    }
  };

  // 处理拖拽结束
  const handleDragEnd = () => {
    // 延迟重置拖拽状态，避免立即触发点击事件
    setTimeout(() => setIsDragging(false), 100);
  };

  // 返回顶部功能
  const onReturnTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 主题切换功能
  const onToggleTheme = () => {
    setIsDark(!isDark);
  };

  const actionItems = [
    {
      icon: isDark ? FaRegSun : LuMoonStar,
      id: 'theme',
      label: isDark ? '切换到亮色模式' : '切换到暗色模式',
      onClick: onToggleTheme,
    },
    {
      icon: IoSearchOutline,
      id: 'search',
      label: '搜索',
      onClick: onSearchOpen,
    },
    {
      icon: IoLogoRss,
      id: 'rss',
      label: 'RSS 订阅',
      onClick: onRssOpen,
    },
    {
      icon: IoArrowUpOutline,
      id: 'top',
      label: '返回顶部',
      onClick: onReturnTop,
    },
  ];

  const radius = 50;
  const itemPositions = actionItems.map((_, index) => {
    const angle = (index * 360) / actionItems.length - 90;
    return {
      x: Math.cos((angle * Math.PI) / 180) * radius,
      y: Math.sin((angle * Math.PI) / 180) * radius,
    };
  });

  return (
    <>
      <div ref={constraintsRef} className="fixed inset-0 pointer-events-none z-50">
        <motion.div
          className="absolute pointer-events-auto transform-gpu"
          initial={{ bottom: 180, right: 60 }}
          drag
          dragConstraints={constraintsRef}
          dragElastic={0.1}
          dragMomentum={false}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          whileDrag={{ scale: 1.05, zIndex: 1000 }}
          style={{
            cursor: isDragging ? 'grabbing' : 'grab',
          }}
        >
          <div className="relative size-10">
            {/* 围绕的功能项 */}
            {actionItems.map((item, index) => {
              const position = itemPositions[index];
              return (
                <motion.div
                  key={item.id}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform-gpu"
                  initial={false}
                  animate={{
                    opacity: isExpanded ? 1 : 0,
                    scale: isExpanded ? 1 : 0.6,
                    x: isExpanded ? position.x : 0,
                    y: isExpanded ? position.y : 0,
                  }}
                  transition={{
                    ...itemTransition,
                    delay: isExpanded ? index * 0.03 : 0,
                  }}
                  style={{ pointerEvents: isExpanded ? 'auto' : 'none' }}
                >
                  <Button
                    isIconOnly
                    size="md"
                    variant="shadow"
                    className={floatingBtnClass}
                    onPress={item.onClick}
                    title={item.label}
                    aria-label={item.label}
                    tabIndex={isExpanded ? 0 : -1}
                  >
                    <item.icon className="w-5 h-5" />
                  </Button>
                </motion.div>
              );
            })}

            {/* 主按钮 */}
            <div className="relative z-10">
              <Button
                isIconOnly
                size="md"
                variant="shadow"
                className={`${floatingBtnClass} ${isDragging ? '' : 'hover:scale-110'}`}
                onPress={toggleExpanded}
                aria-label={isExpanded ? '收起功能菜单' : '展开功能菜单'}
                title={isExpanded ? '收起功能菜单' : '展开功能菜单'}
                style={{ cursor: isDragging ? 'grabbing' : 'pointer' }}
              >
                <motion.div
                  className="transform-gpu"
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isExpanded ? <BiCommand className="w-5 h-5" /> : <BiCog className="w-5 h-5" />}
                </motion.div>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modal 须放在 motion.div 外，否则 drag 的 transform 会使 fixed 定位失效 */}
      <Search disclosure={{ isOpen: isSearchOpen, onClose: onSearchClose }} />
      <Rss data={web} disclosure={{ isOpen: isRssOpen, onClose: onRssClose }} />
    </>
  );
};

export default FloatingBlock;
