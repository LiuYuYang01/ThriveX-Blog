'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LuChevronDown, LuFileText, LuFolder, LuFolderOpen } from 'react-icons/lu';

import type { DocNode } from '@/lib/docs';

interface Props {
  nodes: DocNode[];
}

interface ItemProps {
  node: DocNode;
  collapsed: Record<string, boolean>;
  onToggle: (slug: string) => void;
}

function DocNavItem({ node, collapsed, onToggle }: ItemProps) {
  const pathname = usePathname();
  const hasChildren = node.children.length > 0;
  const isCollapsed = !!collapsed[node.slug];
  const active = pathname === node.href;

  return (
    <li>
      <div
        className={`flex items-center rounded-lg ${
          active ? 'bg-primary/10 font-medium text-foreground' : 'text-foreground/75 hover:text-foreground'
        }`}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={() => onToggle(node.slug)}
            aria-expanded={!isCollapsed}
            aria-label={isCollapsed ? `展开 ${node.title}` : `收起 ${node.title}`}
            className="shrink-0 cursor-pointer p-1"
          >
            <LuChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ease-out ${isCollapsed ? '-rotate-90' : ''}`} />
          </button>
        ) : (
          // 无子节点时留出与折叠箭头对齐的占位
          <span className="w-[22px] shrink-0" />
        )}

        <Link href={node.href} className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 py-1.5 pr-2">
          {hasChildren ? (
            isCollapsed ? (
              <LuFolder className="h-3.5 w-3.5 shrink-0 text-foreground/45" />
            ) : (
              <LuFolderOpen className="h-3.5 w-3.5 shrink-0 text-primary" />
            )
          ) : (
            <LuFileText className="h-3.5 w-3.5 shrink-0 text-foreground/45" />
          )}

          <span className="truncate">{node.title}</span>
        </Link>
      </div>

      {hasChildren && (
        <ul className="ml-[11px] border-l border-border pl-2">
          {node.children.map((child) => (
            <DocNavItem key={child.slug} node={child} collapsed={collapsed} onToggle={onToggle} />
          ))}
        </ul>
      )}
    </li>
  );
}

// 目录树，节点可展开收起，当前页用填充色块高亮
export default function DocsNav({ nodes }: Props) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  // 换页后展开当前页所在分支，避免停在收起的层级里
  const activeSlugs = useMemo(() => {
    const slugs: string[] = [];
    const walk = (list: DocNode[], trail: string[]) => {
      list.forEach((node) => {
        const next = [...trail, node.slug];
        if (node.href === pathname) slugs.push(...next);
        walk(node.children, next);
      });
    };
    walk(nodes, []);
    return slugs;
  }, [nodes, pathname]);

  useEffect(() => {
    if (!activeSlugs.length) return;
    setCollapsed((prev) => {
      const next = { ...prev };
      activeSlugs.forEach((slug) => delete next[slug]);
      return next;
    });
  }, [activeSlugs]);

  return (
    <ul>
      {nodes.map((node) => (
        <DocNavItem
          key={node.slug}
          node={node}
          collapsed={collapsed}
          onToggle={(slug) => setCollapsed((prev) => ({ ...prev, [slug]: !prev[slug] }))}
        />
      ))}
    </ul>
  );
}
