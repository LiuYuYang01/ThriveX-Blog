import { FiBookmark } from 'react-icons/fi';

// 置顶标识（悬浮于卡片左上角）
export default function PinBadge() {
  return (
    <span className="absolute left-0 top-0 z-30 inline-flex items-center gap-1 rounded-br-xl bg-primary px-3 py-1.5 text-xs font-medium text-white">
      <FiBookmark className="size-3.5 fill-current" />
      置顶
    </span>
  );
}
