'use client';

import { useState } from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import { TextField } from '@/ThriveUI';

// 表情数据 - 包含表情符号和中文名称
const emojiData = {
  smileys: [
    { emoji: '😀', name: '开心笑脸' },
    { emoji: '😃', name: '大笑脸' },
    { emoji: '😄', name: '眯眼笑脸' },
    { emoji: '😁', name: '露齿笑脸' },
    { emoji: '😆', name: '眯眼大笑' },
    { emoji: '😅', name: '流汗笑脸' },
    { emoji: '🤣', name: '滚地大笑' },
    { emoji: '😂', name: '笑哭' },
    { emoji: '🙂', name: '微笑' },
    { emoji: '🙃', name: '倒置笑脸' },
    { emoji: '😉', name: '眨眼' },
    { emoji: '😊', name: '害羞笑脸' },
    { emoji: '😇', name: '天使笑脸' },
    { emoji: '🥰', name: '爱心眼笑脸' },
    { emoji: '😍', name: '花痴脸' },
    { emoji: '🤩', name: '星星眼' },
    { emoji: '😘', name: '飞吻' },
    { emoji: '😗', name: '亲吻脸' },
    { emoji: '😚', name: '闭眼亲吻' },
    { emoji: '😙', name: '微笑亲吻' },
    { emoji: '😋', name: '美味脸' },
    { emoji: '😛', name: '吐舌脸' },
    { emoji: '😜', name: '眨眼吐舌' },
    { emoji: '🤪', name: '疯狂脸' },
    { emoji: '😝', name: '眯眼吐舌' },
    { emoji: '🤑', name: '金钱眼' },
    { emoji: '🤗', name: '拥抱脸' },
    { emoji: '🤭', name: '捂嘴笑' },
    { emoji: '🤫', name: '嘘声脸' },
    { emoji: '🤔', name: '思考脸' },
    { emoji: '🤐', name: '拉链嘴' },
    { emoji: '🤨', name: '挑眉脸' },
    { emoji: '😐', name: '面无表情' },
    { emoji: '😑', name: '无表情脸' },
    { emoji: '😶', name: '无语脸' },
    { emoji: '😏', name: '得意脸' },
    { emoji: '😒', name: '无趣脸' },
    { emoji: '🙄', name: '翻白眼' },
    { emoji: '😬', name: '龇牙脸' },
    { emoji: '🤥', name: '撒谎脸' },
    { emoji: '😔', name: '沉思脸' },
    { emoji: '😪', name: '困倦脸' },
    { emoji: '🤤', name: '流口水脸' },
    { emoji: '😴', name: '睡觉脸' },
    { emoji: '😷', name: '口罩脸' },
    { emoji: '🤒', name: '发烧脸' },
    { emoji: '🤕', name: '受伤脸' },
    { emoji: '🤢', name: '恶心脸' },
    { emoji: '🤮', name: '呕吐脸' },
    { emoji: '🤧', name: '打喷嚏脸' },
    { emoji: '🥵', name: '热脸' },
    { emoji: '🥶', name: '冷脸' },
    { emoji: '🥴', name: '眩晕脸' },
    { emoji: '😵', name: '晕倒脸' },
    { emoji: '🤯', name: '爆炸头' },
    { emoji: '🤠', name: '牛仔帽' },
    { emoji: '🥳', name: '派对脸' },
    { emoji: '😎', name: '墨镜脸' },
    { emoji: '🤓', name: '书呆子脸' },
    { emoji: '🧐', name: '单片眼镜脸' },
    { emoji: '😕', name: '困惑脸' },
    { emoji: '😟', name: '担心脸' },
    { emoji: '🙁', name: '轻微皱眉' },
    { emoji: '☹️', name: '皱眉脸' },
    { emoji: '😮', name: '张嘴脸' },
    { emoji: '😯', name: '惊讶脸' },
    { emoji: '😲', name: '震惊脸' },
    { emoji: '😳', name: '脸红脸' },
    { emoji: '🥺', name: '恳求脸' },
    { emoji: '😦', name: '张嘴皱眉' },
    { emoji: '😧', name: '痛苦脸' },
    { emoji: '😨', name: '恐惧脸' },
    { emoji: '😰', name: '焦虑脸' },
    { emoji: '😥', name: '失望但解脱' },
    { emoji: '😢', name: '哭泣脸' },
    { emoji: '😭', name: '大哭脸' },
    { emoji: '😱', name: '尖叫脸' },
    { emoji: '😖', name: '困惑脸' },
    { emoji: '😣', name: '坚持脸' },
    { emoji: '😞', name: '失望脸' },
    { emoji: '😓', name: '流汗脸' },
    { emoji: '😩', name: '疲惫脸' },
    { emoji: '😫', name: '疲倦脸' },
    { emoji: '🥱', name: '打哈欠脸' },
    { emoji: '😤', name: '愤怒脸' },
    { emoji: '😡', name: '愤怒脸' },
    { emoji: '😠', name: '愤怒脸' },
    { emoji: '🤬', name: '咒骂脸' },
    { emoji: '😈', name: '恶魔笑脸' },
    { emoji: '👿', name: '愤怒恶魔' },
    { emoji: '💀', name: '骷髅' },
    { emoji: '☠️', name: '骷髅交叉骨' },
    { emoji: '💩', name: '便便' },
    { emoji: '🤡', name: '小丑脸' },
    { emoji: '👹', name: '日本妖怪' },
    { emoji: '👺', name: '日本狐狸' },
    { emoji: '👻', name: '幽灵' },
    { emoji: '👽', name: '外星人' },
    { emoji: '👾', name: '外星怪物' },
    { emoji: '🤖', name: '机器人' },
    { emoji: '😺', name: '微笑猫脸' },
    { emoji: '😸', name: '眯眼猫脸' },
    { emoji: '😹', name: '笑哭猫脸' },
    { emoji: '😻', name: '爱心眼猫脸' },
    { emoji: '😼', name: '得意猫脸' },
    { emoji: '😽', name: '亲吻猫脸' },
    { emoji: '🙀', name: '尖叫猫脸' },
    { emoji: '😿', name: '哭泣猫脸' },
    { emoji: '😾', name: '愤怒猫脸' },
  ],
  objects: [
    { emoji: '⌚', name: '手表' },
    { emoji: '📱', name: '手机' },
    { emoji: '📲', name: '手机箭头' },
    { emoji: '💻', name: '笔记本电脑' },
    { emoji: '⌨️', name: '键盘' },
    { emoji: '🖥️', name: '台式电脑' },
    { emoji: '🖨️', name: '打印机' },
    { emoji: '🖱️', name: '电脑鼠标' },
    { emoji: '🖲️', name: '轨迹球' },
    { emoji: '🕹️', name: '游戏手柄' },
    { emoji: '🗜️', name: '夹钳' },
    { emoji: '💽', name: '软盘' },
    { emoji: '💾', name: '软盘' },
    { emoji: '💿', name: '光盘' },
    { emoji: '📀', name: 'DVD' },
    { emoji: '📼', name: '录像带' },
    { emoji: '📷', name: '相机' },
    { emoji: '📸', name: '闪光相机' },
    { emoji: '📹', name: '摄像机' },
    { emoji: '🎥', name: '电影摄像机' },
    { emoji: '📽️', name: '胶片投影仪' },
    { emoji: '🎞️', name: '电影胶片' },
    { emoji: '📞', name: '电话听筒' },
    { emoji: '☎️', name: '电话' },
    { emoji: '📟', name: '寻呼机' },
    { emoji: '📠', name: '传真机' },
    { emoji: '📺', name: '电视' },
    { emoji: '📻', name: '收音机' },
    { emoji: '🎙️', name: '录音棚麦克风' },
    { emoji: '🎚️', name: '调音滑块' },
    { emoji: '🎛️', name: '控制旋钮' },
    { emoji: '🧭', name: '指南针' },
    { emoji: '⏱️', name: '秒表' },
    { emoji: '⏲️', name: '定时器' },
    { emoji: '⏰', name: '闹钟' },
    { emoji: '🕰️', name: '壁钟' },
    { emoji: '⌛', name: '沙漏' },
    { emoji: '⏳', name: '沙漏流动' },
    { emoji: '📡', name: '卫星天线' },
    { emoji: '🔋', name: '电池' },
    { emoji: '🔌', name: '插头' },
    { emoji: '💡', name: '灯泡' },
    { emoji: '🔦', name: '手电筒' },
    { emoji: '🕯️', name: '蜡烛' },
    { emoji: '🪔', name: '油灯' },
    { emoji: '🧯', name: '灭火器' },
    { emoji: '🛢️', name: '油桶' },
    { emoji: '💸', name: '飞钱' },
    { emoji: '💵', name: '美元' },
    { emoji: '💴', name: '日元' },
    { emoji: '💶', name: '欧元' },
    { emoji: '💷', name: '英镑' },
    { emoji: '🪙', name: '硬币' },
    { emoji: '💰', name: '钱袋' },
    { emoji: '💳', name: '信用卡' },
    { emoji: '💎', name: '钻石' },
    { emoji: '⚖️', name: '天平' },
    { emoji: '🪜', name: '梯子' },
    { emoji: '🧰', name: '工具箱' },
    { emoji: '🔧', name: '扳手' },
    { emoji: '🔨', name: '锤子' },
    { emoji: '⚒️', name: '锤子和镐' },
    { emoji: '🛠️', name: '锤子和扳手' },
    { emoji: '⛏️', name: '镐' },
    { emoji: '🪓', name: '斧头' },
    { emoji: '🪚', name: '锯子' },
    { emoji: '🔩', name: '螺栓' },
    { emoji: '⚙️', name: '齿轮' },
    { emoji: '🪤', name: '捕鼠器' },
    { emoji: '🧱', name: '砖块' },
    { emoji: '⛓️', name: '链条' },
    { emoji: '🧲', name: '磁铁' },
    { emoji: '🔫', name: '手枪' },
    { emoji: '💣', name: '炸弹' },
    { emoji: '🧨', name: '炸药' },
    { emoji: '🔪', name: '菜刀' },
    { emoji: '🗡️', name: '剑' },
    { emoji: '⚔️', name: '交叉剑' },
    { emoji: '🛡️', name: '盾牌' },
    { emoji: '🚬', name: '香烟' },
    { emoji: '⚰️', name: '棺材' },
    { emoji: '🪦', name: '墓碑' },
    { emoji: '⚱️', name: '骨灰盒' },
    { emoji: '🏺', name: '双耳瓶' },
    { emoji: '🔮', name: '水晶球' },
    { emoji: '📿', name: '念珠' },
    { emoji: '🧿', name: '邪眼' },
    { emoji: '💈', name: '理发店招牌' },
    { emoji: '⚗️', name: '蒸馏器' },
    { emoji: '🔭', name: '望远镜' },
    { emoji: '🔬', name: '显微镜' },
    { emoji: '🕳️', name: '洞' },
    { emoji: '🩹', name: '创可贴' },
    { emoji: '🩺', name: '听诊器' },
    { emoji: '💊', name: '药丸' },
    { emoji: '💉', name: '注射器' },
    { emoji: '🩸', name: '血滴' },
    { emoji: '🧬', name: 'DNA' },
    { emoji: '🦠', name: '微生物' },
    { emoji: '🧫', name: '培养皿' },
    { emoji: '🧪', name: '试管' },
    { emoji: '🌡️', name: '温度计' },
    { emoji: '🧹', name: '扫帚' },
    { emoji: '🧺', name: '篮子' },
    { emoji: '🧻', name: '卫生纸' },
    { emoji: '🚽', name: '马桶' },
    { emoji: '🚰', name: '饮水机' },
    { emoji: '🚿', name: '淋浴' },
    { emoji: '🛁', name: '浴缸' },
    { emoji: '🛀', name: '洗澡' },
    { emoji: '🧴', name: '乳液瓶' },
    { emoji: '🧷', name: '安全别针' },
    { emoji: '🧸', name: '泰迪熊' },
    { emoji: '🧵', name: '线轴' },
    { emoji: '🧶', name: '毛线球' },
    { emoji: '🪡', name: '缝衣针' },
    { emoji: '🪢', name: '结' },
    { emoji: '🪣', name: '桶' },
    { emoji: '🧽', name: '海绵' },
    { emoji: '🛒', name: '购物车' },
    { emoji: '🛍️', name: '购物袋' },
    { emoji: '🛎️', name: '服务铃' },
    { emoji: '🔑', name: '钥匙' },
    { emoji: '🗝️', name: '老式钥匙' },
    { emoji: '🚪', name: '门' },
    { emoji: '🪑', name: '椅子' },
    { emoji: '🛏️', name: '床' },
    { emoji: '🛋️', name: '沙发' },
    { emoji: '🪞', name: '镜子' },
    { emoji: '🪟', name: '窗户' },
  ],
};

const allEmojis = Object.values(emojiData).flat();

interface Props {
  onEmojiSelect?: (emoji: string) => void;
  className?: string;
}

export default ({ onEmojiSelect, className = '' }: Props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredEmojis = !searchTerm
    ? allEmojis
    : allEmojis.filter(({ emoji, name }) => emoji.includes(searchTerm) || name.includes(searchTerm));

  const handleEmojiClick = (emojiItem: { emoji: string; name: string }) => {
    onEmojiSelect?.(emojiItem.emoji);
  };

  return (
    <div className={`w-80 ${className}`}>
      {/* 搜索栏 */}
      <div className="border-b border-neutral-200/80 p-4 dark:border-neutral-700/60">
        <TextField
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          type="text"
          inputMode="search"
          placeholder="搜索表情名称..."
          endContent={<IoSearchOutline className="h-4 w-4 text-neutral-400 dark:text-neutral-500" />}
        />
      </div>

      {/* 表情网格 */}
      <div className="p-4">
        <div className="grid grid-cols-6 gap-2 max-h-64 overflow-y-auto">
          {filteredEmojis.map((emojiItem, index) => {
            const isFirstRow = index < 6;
            const colIndex = index % 6;
            const horizontalClass = colIndex === 0 ? 'left-0 translate-x-0' : colIndex === 5 ? 'right-0 translate-x-0' : 'left-1/2 -translate-x-1/2';

            return (
              <button
                key={`${emojiItem.emoji}-${index}`}
                onClick={() => handleEmojiClick(emojiItem)}
                className="group relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-2xl hover:bg-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-primary/40 dark:hover:bg-neutral-700/60"
                aria-label={emojiItem.name}
              >
                {emojiItem.emoji}
                <div
                  className={`pointer-events-none absolute z-10 transform rounded bg-neutral-800 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 group-hover:opacity-100 dark:bg-neutral-700 ${isFirstRow ? 'top-full mt-2' : 'bottom-full mb-2'} ${horizontalClass}`}
                >
                  {emojiItem.name}
                </div>
              </button>
            );
          })}
        </div>

        {filteredEmojis.length === 0 && (
          <div className="py-8 text-center text-neutral-500 dark:text-neutral-400">{searchTerm ? '未找到匹配的表情' : '暂无表情'}</div>
        )}
      </div>
    </div>
  );
};
