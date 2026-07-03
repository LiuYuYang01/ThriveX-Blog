export type TocHeading = {
  id: string;
  text: string;
  level: number;
};

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\u4e00-\u9fff]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function cleanHeadingText(raw: string): string {
  return raw
    .replace(/!\[[^\]]*]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)]\([^)]*\)/g, '$1')
    .replace(/[*_`~]/g, '')
    .trim();
}

export function extractArticleHeadings(content?: string): TocHeading[] {
  if (!content?.trim()) return [];

  const used = new Map<string, number>();
  const headings: TocHeading[] = [];

  for (const line of content.split('\n')) {
    const match = line.match(/^(#{1,3})\s+(.+)$/);
    if (!match) continue;

    const text = cleanHeadingText(match[2]);
    if (!text) continue;

    const base = slugifyHeading(text) || 'heading';
    const count = used.get(base) ?? 0;
    used.set(base, count + 1);
    const id = count === 0 ? base : `${base}-${count}`;

    headings.push({ id, text, level: match[1].length });
  }

  return headings;
}
