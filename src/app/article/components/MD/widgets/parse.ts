import type { WidgetPayload, WidgetType } from './types';

const LINK_ALIAS: Record<string, WidgetType> = {
  bilibili: 'bilibili',
  youtube: 'youtube',
  netease: 'netease',
  'netease-music': 'netease',
  douyin: 'douyin',
  'douyin-video': 'douyin',
  audio: 'audio',
};

function stripFenceWrappers(raw: string): string {
  return raw
    .replace(/^```(?:tx-widget|widget)?\s*/i, '')
    .replace(/```$/i, '')
    .trim();
}

function parseLineConfig(raw: string): Record<string, unknown> | null {
  const lines = raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  if (!lines.length) return null;

  const result: Record<string, unknown> = {};
  for (const line of lines) {
    const match = line.match(/^([A-Za-z_][\w-]*)\s*[:=]\s*(.+)$/);
    if (!match) return null;
    const key = match[1];
    let value: unknown = match[2].trim();
    if ((value as string).startsWith('[') || (value as string).startsWith('{')) {
      try {
        value = JSON.parse(value as string);
      } catch {
        // keep string
      }
    } else if (value === 'true' || value === 'false') {
      value = value === 'true';
    } else if (/^-?\d+(\.\d+)?$/.test(value as string)) {
      value = Number(value);
    } else if (
      ((value as string).startsWith('"') && (value as string).endsWith('"')) ||
      ((value as string).startsWith("'") && (value as string).endsWith("'"))
    ) {
      value = (value as string).slice(1, -1);
    }
    result[key] = value;
  }

  return result.type ? result : null;
}

export function parseWidgetPayload(raw: string): WidgetPayload | null {
  const text = stripFenceWrappers(raw);
  if (!text) return null;

  try {
    const json = JSON.parse(text) as WidgetPayload;
    if (json && typeof json === 'object' && typeof json.type === 'string') {
      return json;
    }
  } catch {
    // fallback to line config
  }

  const lineConfig = parseLineConfig(text);
  if (lineConfig && typeof lineConfig.type === 'string') {
    return lineConfig as WidgetPayload;
  }

  return null;
}

export function payloadFromLinkAlias(label: string, href?: string): WidgetPayload | null {
  const type = LINK_ALIAS[label.trim().toLowerCase()];
  if (!type || !href) return null;

  if (type === 'bilibili') {
    const bvid = href.match(/BV[\w]+/i)?.[0] || href;
    return { type, bvid };
  }

  if (type === 'youtube') {
    const id =
      href.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{6,})/)?.[1] ||
      href.replace(/^https?:\/\//, '').split('/').pop() ||
      href;
    return { type, id };
  }

  if (type === 'netease') {
    const id = href.match(/[?&]id=(\d+)/)?.[1] || href.match(/(\d{5,})/)?.[1] || href;
    return { type, id };
  }

  if (type === 'douyin') {
    const id = href.match(/(\d{8,})/)?.[1] || href.split('/').pop() || href;
    return { type, id };
  }

  if (type === 'audio') {
    return { type, src: href };
  }

  return { type, id: href };
}

export function isWidgetCodeLanguage(className?: string): boolean {
  return /language-(?:tx-widget|widget)\b/i.test(className || '');
}
