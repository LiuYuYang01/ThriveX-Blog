export interface ArticlePosterOptions {
  title: string;
  description: string;
  cover: string;
  siteName: string;
  siteUrl: string;
  articleUrl: string;
  favicon?: string;
  authorName?: string;
  createTime: string;
  view?: number;
  likeCount?: number;
}

const POSTER_W = 600;
const COVER_H = 360;
const CARD_X = 20;
const CARD_W = POSTER_W - 40;
const CARD_TOP = 300;
const CONTENT_X = 48;
const CONTENT_W = POSTER_W - 96;
const CARD_PAD_TOP = 48;
const CARD_PAD_BOTTOM = 32;
const QR_SIZE = 88;
const BOTTOM_MARGIN = 20;

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    if (!src) {
      resolve(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function drawCoverImage(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
  const scale = Math.max(w / img.width, h / img.height);
  const sw = img.width * scale;
  const sh = img.height * scale;
  const sx = x + (w - sw) / 2;
  const sy = y + (h - sh) / 2;
  ctx.drawImage(img, sx, sy, sw, sh);
}

/** 测量或绘制换行文本，返回占用高度 */
function textBlock(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number,
  draw: boolean,
): number {
  const chars = text.split('');
  let line = '';
  let lineCount = 0;
  let currentY = y;
  const startY = y;

  for (let i = 0; i < chars.length; i++) {
    const testLine = line + chars[i];
    if (ctx.measureText(testLine).width > maxWidth && line) {
      if (draw) ctx.fillText(line, x, currentY);
      line = chars[i];
      lineCount += 1;
      currentY += lineHeight;
      if (lineCount >= maxLines - 1) {
        line = testLine;
        while (line.length > 1 && ctx.measureText(line + '…').width > maxWidth) {
          line = line.slice(0, -1);
        }
        if (draw) ctx.fillText(line + '…', x, currentY);
        currentY += lineHeight;
        break;
      }
    } else {
      line = testLine;
    }
  }

  if (line && lineCount < maxLines) {
    if (draw) ctx.fillText(line, x, currentY);
    currentY += lineHeight;
  }

  return currentY - startY;
}

interface ContentLayout {
  cardHeight: number;
  posterHeight: number;
}

function measureLayout(ctx: CanvasRenderingContext2D, options: ArticlePosterOptions): ContentLayout {
  const { title, description, authorName, createTime, view = 0, likeCount = 0 } = options;
  const desc = (description || title).slice(0, 120);

  let inner = CARD_PAD_TOP;

  ctx.font = 'bold 26px system-ui, -apple-system, "PingFang SC", sans-serif';
  inner += textBlock(ctx, title, 0, 0, CONTENT_W, 34, 3, false) + 8;

  ctx.font = '400 14px system-ui, -apple-system, "PingFang SC", sans-serif';
  inner += textBlock(ctx, desc, 0, 0, CONTENT_W, 22, 3, false) + 16;

  inner += 14; // meta line
  inner += 28; // gap before divider
  inner += 1; // divider
  inner += 24; // gap after divider
  inner += QR_SIZE; // qr block
  inner += 20; // gap before footer
  inner += 14; // footer text
  inner += CARD_PAD_BOTTOM;

  const cardHeight = inner;
  const posterHeight = Math.max(COVER_H + 80, CARD_TOP + cardHeight + BOTTOM_MARGIN);

  return { cardHeight, posterHeight };
}

export async function generateArticlePoster(options: ArticlePosterOptions): Promise<string> {
  const {
    title,
    description,
    cover,
    siteName,
    articleUrl,
    favicon,
    authorName,
    createTime,
    view = 0,
    likeCount = 0,
  } = options;

  const measureCanvas = document.createElement('canvas');
  measureCanvas.width = POSTER_W;
  measureCanvas.height = 1;
  const measureCtx = measureCanvas.getContext('2d');
  if (!measureCtx) throw new Error('无法创建画布');

  const { cardHeight, posterHeight } = measureLayout(measureCtx, options);

  const canvas = document.createElement('canvas');
  canvas.width = POSTER_W;
  canvas.height = posterHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('无法创建画布');

  const bgGrad = ctx.createLinearGradient(0, 0, POSTER_W, posterHeight);
  bgGrad.addColorStop(0, '#0f172a');
  bgGrad.addColorStop(1, '#1e1b4b');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, POSTER_W, posterHeight);

  const coverImg = await loadImage(cover || favicon || '');
  if (coverImg) {
    ctx.save();
    roundRect(ctx, 0, 0, POSTER_W, COVER_H + 40, 0);
    ctx.clip();
    drawCoverImage(ctx, coverImg, 0, 0, POSTER_W, COVER_H + 40);
    ctx.restore();
  } else {
    const coverGrad = ctx.createLinearGradient(0, 0, POSTER_W, COVER_H);
    coverGrad.addColorStop(0, '#539dfd');
    coverGrad.addColorStop(0.5, '#818cf8');
    coverGrad.addColorStop(1, '#f43f5e');
    ctx.fillStyle = coverGrad;
    ctx.fillRect(0, 0, POSTER_W, COVER_H + 40);
  }

  const overlay = ctx.createLinearGradient(0, COVER_H - 120, 0, COVER_H + 80);
  overlay.addColorStop(0, 'rgba(15, 23, 42, 0)');
  overlay.addColorStop(1, 'rgba(15, 23, 42, 0.95)');
  ctx.fillStyle = overlay;
  ctx.fillRect(0, COVER_H - 120, POSTER_W, 200);

  ctx.fillStyle = '#ffffff';
  roundRect(ctx, CARD_X, CARD_TOP, CARD_W, cardHeight, 20);
  ctx.fill();

  let cursorY = CARD_TOP + CARD_PAD_TOP;

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 26px system-ui, -apple-system, "PingFang SC", sans-serif';
  cursorY += textBlock(ctx, title, CONTENT_X, cursorY, CONTENT_W, 34, 3, true);
  cursorY += 8;

  const desc = (description || title).slice(0, 120);
  ctx.fillStyle = '#64748b';
  ctx.font = '400 14px system-ui, -apple-system, "PingFang SC", sans-serif';
  cursorY += textBlock(ctx, desc, CONTENT_X, cursorY, CONTENT_W, 22, 3, true);
  cursorY += 16;

  ctx.fillStyle = '#94a3b8';
  ctx.font = '400 12px system-ui, sans-serif';
  const metaParts = [createTime];
  if (authorName) metaParts.unshift(authorName);
  metaParts.push(`阅读 ${view}`, `点赞 ${likeCount}`);
  ctx.fillText(metaParts.join('  ·  '), CONTENT_X, cursorY);

  cursorY += 28;
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(CONTENT_X, cursorY);
  ctx.lineTo(CONTENT_X + CONTENT_W, cursorY);
  ctx.stroke();

  cursorY += 24;

  const qrApi = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(articleUrl)}&margin=0`;
  const qrImg = await loadImage(qrApi);

  if (qrImg) {
    ctx.drawImage(qrImg, CONTENT_X, cursorY, QR_SIZE, QR_SIZE);
  }

  ctx.fillStyle = '#0f172a';
  ctx.font = '600 15px system-ui, "PingFang SC", sans-serif';
  ctx.fillText('长按识别二维码', CONTENT_X + 104, cursorY + 28);
  ctx.fillStyle = '#64748b';
  ctx.font = '400 12px system-ui, sans-serif';
  ctx.fillText('阅读全文', CONTENT_X + 104, cursorY + 50);

  const shortUrl = articleUrl.replace(/^https?:\/\//, '').slice(0, 36);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '400 11px monospace';
  ctx.fillText(shortUrl + (articleUrl.length > 40 ? '…' : ''), CONTENT_X + 104, cursorY + 72);

  cursorY += QR_SIZE + 20;

  ctx.fillStyle = '#cbd5e1';
  ctx.font = '400 11px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('— 分享自 ' + siteName + ' —', POSTER_W / 2, cursorY);
  ctx.textAlign = 'left';

  return canvas.toDataURL('image/png', 0.92);
}
