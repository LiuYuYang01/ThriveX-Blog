'use client';

import { useRef, type ReactNode, type MouseEvent } from 'react';

export default function MagneticCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    const distance = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
    const maxDistance = Math.max(rect.width, rect.height);
    if (distance < maxDistance) {
      const strength = (1 - distance / maxDistance) * 15;
      cardRef.current.style.transform = `translate(${(mouseX / rect.width) * strength}px, ${(mouseY / rect.height) * strength}px)`;
    }
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'translate(0px, 0px)';
  };

  return (
    <div
      ref={cardRef}
      className={`transition-[scale] duration-300 ease-out ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}
