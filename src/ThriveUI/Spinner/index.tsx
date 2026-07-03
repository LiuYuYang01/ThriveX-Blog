'use client';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'default';
  className?: string;
}

const sizeCls = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-8 w-8' };
const colorCls = { primary: 'border-primary', default: 'border-neutral-400' };

export function Spinner({ size = 'md', color = 'default', className = '' }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="加载中"
      className={`inline-block animate-spin rounded-full border-2 border-t-transparent ${sizeCls[size]} ${colorCls[color]} ${className}`}
    />
  );
}

export default Spinner;
