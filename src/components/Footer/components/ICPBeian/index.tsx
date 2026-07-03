'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import ICPIcon from '../../images/ICP.png';

interface ICPBeianProps {
  icp?: string;
}

export default function ICPBeian({ icp }: ICPBeianProps) {
  const icpRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 处理ICP备案HTML+JavaScript代码
    if (icp && icpRef.current) {
      // 检查是否包含HTML标签或script标签
      if (icp.includes('<') || icp.includes('script')) {
        icpRef.current.innerHTML = icp;
        
        // 执行内嵌的script标签
        const scripts = icpRef.current.getElementsByTagName('script');
        Array.from(scripts).forEach((oldScript) => {
          const newScript = document.createElement('script');
          Array.from(oldScript.attributes).forEach((attr) => {
            newScript.setAttribute(attr.name, attr.value);
          });
          newScript.textContent = oldScript.textContent;
          oldScript.parentNode?.replaceChild(newScript, oldScript);
        });
      }
    }
  }, [icp]);

  // 如果没有ICP，不渲染
  if (!icp) {
    return null;
  }

  // 判断是否为HTML代码
  const isHtml = icp.includes('<') || icp.includes('script');

  return (
    <div className="flex flex-col items-center gap-2 pb-4">
      {/* ICP备案 - 纯文本显示图标+链接，HTML直接渲染 */}
      <div className="group flex justify-center items-center space-x-2 cursor-pointer">
        {!isHtml && (
          <Image src={ICPIcon} alt="ICP" width={20} height={22} className="w-5 h-[22px]" />
        )}
        {isHtml ? (
          <div ref={icpRef} className="group-hover:text-primary flex items-center text-[#666] dark:text-[#8c9ab1] [&_a]:text-inherit [&_a]:hover:text-primary" />
        ) : (
          <a
            href="https://beian.miit.gov.cn"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#666] dark:text-[#8c9ab1] group-hover:text-primary"
          >
            {icp}
          </a>
        )}
      </div>
    </div>
  );
}
