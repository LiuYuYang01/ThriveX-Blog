import { ReactNode } from 'react';

interface Props {
  title: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  marginBottom?: 'mb-3' | 'mb-5';
}

export default ({ title, children, className = '', contentClassName = '', marginBottom = 'mb-3' }: Props) => {
  return (
    <div className={`panel flex flex-col bg-white dark:bg-black-b p-4 ${marginBottom} ${className}`}>
      <div className="panel__header w-full dark:text-white">{title}</div>
      {children && <div className={contentClassName}>{children}</div>}
    </div>
  );
};
