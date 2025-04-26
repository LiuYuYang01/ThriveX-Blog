"use client";
import { useEffect, useState } from "react";
import "./index.scss";

interface SummaryProps {
  content: string;
}

const suggestions = [
  "谁是刘宇阳？",
  "这篇文章讲了什么？",
  "带我去看看其他文章",
];

export default function Summary({ content }: SummaryProps) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleThriveGPTClick = () => {
    // TODO: 调用逻辑
  };

  useEffect(() => {
    if (currentIndex < content.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + content[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 20);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, content]);

  return (
    <div className="post-ai" data-nosnippet="">
      <div className="ai-title">
        <div className="ai-title-left">
          <div className="ai-title-text">文章摘要</div>
        </div>
        <div
          className="ai-tag"
          id="ai-tag"
          title="了解助理"
          onClick={handleThriveGPTClick} // TODO: 实现后完善交互逻辑
        >
          ThriveGPT
        </div>
      </div>
      <div className="ai-explanation">
        {displayText}
        {currentIndex < content.length && <span className="cursor">|</span>}
      </div>
      {showSuggestions && (
        <div className="ai-suggestions">
          {suggestions.map((item, index) => (
            <div
              key={index}
              className="ai-suggestions-item"
              // TODO: 添加点击处理逻辑
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
