'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, useDisclosure } from '@/ThriveUI';
import { BiCog, BiCommand } from 'react-icons/bi';
import { IoSearchOutline, IoArrowUpOutline, IoLogoRss } from 'react-icons/io5';
import { useConfigStore } from '@/stores';
import Search from '../Search';
import Rss from '../Tools/components/Rss';
import { LuMoonStar } from 'react-icons/lu';
import { FaRegSun } from 'react-icons/fa';

const floatingBtnClass =
  'transition-none! bg-white! text-gray-600! shadow-[0_2px_8px_rgba(0,0,0,0.1)] border border-gray-200/80 hover:bg-gray-50! dark:bg-[#2c333e]! dark:text-gray-200! dark:border-gray-600/80 dark:hover:bg-[#323e50]!';

const FloatingBlock = () => {
  const [isExpanded, setIsExpanded] = useState(false); // 展开状态的变量
  const [isDragging, setIsDragging] = useState(false); // 拖拽状态
  const constraintsRef = useRef(null); // 拖拽约束参考
  const { isDark, setIsDark, web } = useConfigStore();
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

  // 计算每个项目的位置（圆形分布）
  const getItemPosition = (index: number, total: number) => {
    const angle = (index * 360) / total - 90; // 从顶部开始
    const radius = 50; // 半径 [距离按钮的距离]
    const x = Math.cos((angle * Math.PI) / 180) * radius;
    const y = Math.sin((angle * Math.PI) / 180) * radius;
    return { x, y };
  };

  return (
    <>
    <div ref={constraintsRef} className="fixed inset-0 pointer-events-none z-50">
      <motion.div
        className="absolute pointer-events-auto"
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
          <AnimatePresence>
            {isExpanded &&
              actionItems.map((item, index) => {
                const position = getItemPosition(index, actionItems.length);
                return (
                  <motion.div
                    key={item.id}
                    className="absolute left-1/2 top-1/2"
                    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                    animate={{ opacity: 1, scale: 1, x: position.x, y: position.y }}
                    exit={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.1,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                  >
                    <div className="-translate-x-1/2 -translate-y-1/2">
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          isIconOnly
                          size="md"
                          className={floatingBtnClass}
                          onPress={item.onClick}
                          title={item.label}
                          aria-label={item.label}
                        >
                          <item.icon className="w-5 h-5" />
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
          </AnimatePresence>

          {/* 主按钮 */}
          <motion.div
            whileHover={{ scale: isDragging ? 1 : 1.1 }}
            whileTap={{ scale: isDragging ? 1 : 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative z-10"
          >
            <Button
              isIconOnly
              size="md"
              className={floatingBtnClass}
              onPress={toggleExpanded}
              aria-label={isExpanded ? '收起功能菜单' : '展开功能菜单'}
              title={isExpanded ? '收起功能菜单' : '展开功能菜单'}
              style={{ cursor: isDragging ? 'grabbing' : 'pointer' }}
            >
              <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
                {isExpanded ? <BiCommand className="w-5 h-5" /> : <BiCog className="w-5 h-5" />}
              </motion.div>
            </Button>
          </motion.div>
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
