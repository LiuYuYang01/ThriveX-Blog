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
    <div className={`flex flex-col tw_container bg-white dark:bg-black-b p-4 ${marginBottom} tw_title ${className}`}>
      <div className="tw_title w-full dark:text-white">{title}</div>
      {children && <div className={contentClassName}>{children}</div>}
    </div>
  );
};
