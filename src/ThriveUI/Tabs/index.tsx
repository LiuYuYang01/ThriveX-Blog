'use client';

import { useState, type ReactNode } from 'react';

export interface TabsProps {
  children: ReactNode;
  className?: string;
  defaultSelectedKey?: string;
}

export interface TabProps {
  title: ReactNode;
  children: ReactNode;
  tabKey?: string;
}

export function Tabs({ children, className = '', defaultSelectedKey }: TabsProps) {
  const tabs = (Array.isArray(children) ? children : [children]).filter(
    (c): c is React.ReactElement<TabProps> =>
      !!c && typeof c === 'object' && 'type' in c && c.type === Tab,
  );

  const [active, setActive] = useState(defaultSelectedKey ?? tabs[0]?.props.tabKey ?? '0');

  const activeTab = tabs.find((t, i) => (t.props.tabKey ?? String(i)) === active) ?? tabs[0];

  return (
    <div className={className}>
      <div
        role="tablist"
        className="mb-4 flex flex-wrap justify-center gap-1 rounded-xl bg-neutral-100 p-1 dark:bg-black-b"
      >
        {tabs.map((tab, index) => {
          const key = tab.props.tabKey ?? String(index);
          const selected = key === active;
          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(key)}
              className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                selected
                  ? 'bg-white text-primary shadow-xs dark:bg-[#3a4250]'
                  : 'text-neutral-600 hover:text-foreground dark:text-neutral-400'
              }`}
            >
              {tab.props.title}
            </button>
          );
        })}
      </div>
      <div role="tabpanel">{activeTab?.props.children}</div>
    </div>
  );
}

export function Tab(props: TabProps) {
  void props;
  return null;
}

export default Tabs;
