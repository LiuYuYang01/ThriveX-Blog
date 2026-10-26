// 封面交接：开门时记下封面落在桌上的位置，关门时让合上的本子滑回同一处
const KEY = 'thrivex:diary-cover';

export interface CoverRect {
  left: number;
  top: number;
  width: number;
  height: number;
  scrollY: number;
}

interface StoredRect extends CoverRect {
  vw: number;
  vh: number;
}

export const saveCoverRect = (el: Element | null) => {
  if (!el) return;
  const rect = el.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const data: StoredRect = {
    left: rect.left + window.scrollX,
    top: rect.top + window.scrollY,
    width: rect.width,
    height: rect.height,
    scrollY: window.scrollY,
    vw: window.innerWidth,
    vh: window.innerHeight,
  };
  try {
    sessionStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // 隐私模式没有 sessionStorage，退回按封面页的排版公式估算
  }
};

export const readCoverRect = (): CoverRect | null => {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Partial<StoredRect>;
    const values = [data.left, data.top, data.width, data.height, data.scrollY, data.vw, data.vh];
    if (values.some((value) => typeof value !== 'number' || !Number.isFinite(value))) return null;
    const { left, top, width, height, scrollY, vw, vh } = data as StoredRect;
    if (width <= 0 || height <= 0) return null;
    // 窗口变过大小，记下的位置就不作数了
    if (Math.abs(vw - window.innerWidth) > 2 || Math.abs(vh - window.innerHeight) > 2) return null;
    return { left, top, width, height, scrollY };
  } catch {
    return null;
  }
};

// 没有记录时按封面页的排版公式估一版，至少不会滑到屏幕外
export const fallbackCoverRect = (): CoverRect => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const width =
    vw >= 900
      ? Math.min(Math.max(300, vw * 0.31), 420, (vh - 230) * 0.75, (vw - 64) / 2)
      : vh <= 720
        ? Math.min(320, vw * 0.82, (vh - 230) * 0.75)
        : Math.min(340, vw * 0.86, (vh - 250) * 0.75);
  const height = (width * 4) / 3;
  // 封面页里本子居中，上下留白按那页的 padding 算
  const inner = Math.max(vh - 276, height + 38);
  return {
    left: (vw - width) / 2 + window.scrollX,
    top: 92 + (inner - height - 38) / 2 + window.scrollY,
    width,
    height,
    scrollY: window.scrollY,
  };
};
