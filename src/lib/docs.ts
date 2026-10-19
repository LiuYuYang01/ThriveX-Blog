import fs from 'node:fs';
import path from 'node:path';

interface DocMeta {
  /** URL 片段，根索引页为空串，如 'deploy/cache' */
  slug: string;
  href: string;
  title: string;
  description: string;
  order: number;
  updated: string;
}

export interface DocNode extends DocMeta {
  children: DocNode[];
}

export interface Doc extends DocMeta {
  content: string;
}

const DOCS_ROOT = path.join(process.cwd(), 'src/content/docs');
const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

// 解析顶部 frontmatter，只支持 key: value 扁平原语，避免为文档引入额外依赖
function parseFrontmatter(raw: string) {
  const matched = raw.match(FRONTMATTER_RE);
  if (!matched) return { data: {} as Record<string, string>, content: raw };

  const data: Record<string, string> = {};
  matched[1].split(/\r?\n/).forEach((line) => {
    const colon = line.indexOf(':');
    if (colon < 1) return;
    const key = line.slice(0, colon).trim();
    if (key) data[key] = line.slice(colon + 1).trim().replace(/^["']|["']$/g, '');
  });

  return { data, content: raw.slice(matched[0].length) };
}

function readDoc(filePath: string, slug: string): Doc | null {
  let raw: string;
  try {
    raw = fs.readFileSync(filePath, 'utf-8');
  } catch {
    return null;
  }

  const { data, content } = parseFrontmatter(raw);
  const order = Number(data.order);

  return {
    slug,
    href: slug ? `/docs/${slug}` : '/docs',
    title: data.title ?? path.basename(slug || 'index'),
    description: data.description ?? '',
    // 不能用 || 兜底，order 为 0 时会被误判成缺省值
    order: Number.isFinite(order) ? order : 99,
    updated: data.updated ?? '',
    content,
  };
}

function toNode(doc: Doc, children: DocNode[] = []): DocNode {
  const { slug, href, title, description, order, updated } = doc;
  return { slug, href, title, description, order, updated, children };
}

const byOrder = (a: DocNode, b: DocNode) => a.order - b.order;

// 目录即分支：分支自身的 index.md 提供标题和链接，子目录与同级 md 作为子节点
function readBranch(dir: string, slug: string): DocNode | null {
  const index = readDoc(path.join(dir, 'index.md'), slug);
  if (!index) return null;

  const children: DocNode[] = [];

  fs.readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .forEach((entry) => {
      const branch = readBranch(path.join(dir, entry.name), slug ? `${slug}/${entry.name}` : entry.name);
      if (branch) children.push(branch);
    });

  fs.readdirSync(dir)
    .filter((file) => file.endsWith('.md') && file !== 'index.md')
    .forEach((file) => {
      const doc = readDoc(path.join(dir, file), `${slug}/${path.basename(file, '.md')}`);
      if (doc) children.push(toNode(doc));
    });

  return toNode(index, children.sort(byOrder));
}

export function getDocTree(): DocNode[] {
  if (!fs.existsSync(DOCS_ROOT)) return [];

  const nodes: DocNode[] = [];
  const root = readDoc(path.join(DOCS_ROOT, 'index.md'), '');
  if (root) nodes.push(toNode(root));

  fs.readdirSync(DOCS_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .forEach((entry) => {
      const branch = readBranch(path.join(DOCS_ROOT, entry.name), entry.name);
      if (branch) nodes.push(branch);
    });

  return nodes.sort(byOrder);
}

export function getDoc(slug: string[]): Doc | null {
  const rel = slug.join('/');
  if (!rel) return readDoc(path.join(DOCS_ROOT, 'index.md'), '');

  const index = path.join(DOCS_ROOT, rel, 'index.md');
  if (fs.existsSync(index)) return readDoc(index, rel);

  const file = path.join(DOCS_ROOT, `${rel}.md`);
  if (fs.existsSync(file)) return readDoc(file, rel);

  return null;
}

/** 按目录树先序摊平，用于生成上一页/下一页 */
export function getFlatDocs(): DocNode[] {
  const walk = (nodes: DocNode[]): DocNode[] =>
    nodes.flatMap((node) => [node, ...walk(node.children)]);

  return walk(getDocTree());
}

export function getDocSlugs(): string[] {
  return getFlatDocs()
    .map((node) => node.slug)
    .filter(Boolean);
}
