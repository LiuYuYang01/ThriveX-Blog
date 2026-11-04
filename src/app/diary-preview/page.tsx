import DiaryReader from '@/app/diary/components/DiaryReader';
import type { Diary } from '@/types/app/diary';
import '@/app/diary/diary.scss';

const pages: Diary[] = [
  {
    "id": 1,
    "diaryDate": "2026-08-03",
    "title": null,
    "content": "示例页：夜里下了一场很短的雨，天亮以后空气里有青草味。这一页只是用来验证排版，随时可以删掉。",
    "images": [],
    "mood": "🌿",
    "weather": "rainy",
    "location": "厦门市 · 思明区",
    "createTime": 1792753756000,
    "updateTime": null
  },
  {
    "id": 2,
    "diaryDate": "2026-08-17",
    "title": "关于一台旧相机",
    "content": "示例页：把落灰的相机翻出来，电池仓里有一层薄薄的氧化痕迹。修好之后第一张拍糊了，第二张也没保住，但快门声还是很让人安心。",
    "images": [
      "/images/bg/xueshan1.png",
      "/images/bg/xueshan1.png"
    ],
    "mood": "☕",
    "weather": "sunny",
    "location": "厦门市 · 沙坡尾",
    "createTime": 1792753756000,
    "updateTime": null
  },
  {
    "id": 3,
    "diaryDate": "2026-09-06",
    "title": null,
    "content": "示例页：地铁上读完了一本很薄的书，出站时发现天已经黑了。这种日子没什么值得记的，可还是想记一下。",
    "images": [],
    "mood": null,
    "weather": "night",
    "location": null,
    "createTime": 1792753756000,
    "updateTime": null
  },
  {
    "id": 4,
    "diaryDate": "2026-10-02",
    "title": "两个人, 一张桌",
    "content": "示例页：换了一张更大的桌子，桌面有一道浅浅的刀痕。我把台灯往左挪了十厘米，写字的时候手影终于不压在纸上了。",
    "images": [],
    "mood": "🙂",
    "weather": "cloudy",
    "location": "厦门市 · 家里",
    "createTime": 1792753756000,
    "updateTime": null
  },
  {
    "id": 5,
    "diaryDate": "2026-10-18",
    "title": null,
    "content": "示例页：风很大，晾在外面的衬衫掉了一次。捡起来重新挂好，第二次学了乖，用两个夹子。",
    "images": [],
    "mood": "🌾",
    "weather": "windy",
    "location": null,
    "createTime": 1792753756000,
    "updateTime": null
  },
  {
    "id": 7,
    "diaryDate": "2026-10-19",
    "title": "把书桌重新摆了一遍",
    "content": "示例页：把显示器抬高了两厘米，椅子往后挪了半拳。桌面只剩下一盏灯、一杯水、一叠没写完的纸。\n\n原来让我烦躁的不是事情多，是眼睛里同时装得下太多东西。",
    "images": [],
    "mood": "🌿",
    "weather": "cloudy",
    "location": "厦门市 · 家里",
    "createTime": 1792840000000,
    "updateTime": null
  },
  {
    "id": 6,
    "diaryDate": "2026-10-22",
    "title": "慢慢来",
    "content": "示例页：慢慢来。\n\n早上七点四十的地铁，车厢里挤得连手机都举不起来。我被人潮推着往前，鞋尖抵着前一个人的鞋跟，窗外的隧道灯一根一根往后跑。这样的早晨重复了多久，我数不过来。\n\n到站的时候天光从入口处漫进来，才想起很久没有看过太阳升起来的样子。它每天都升起来，只是我每天都在它升起来之前把自己塞进了车厢。\n\n下班我没有直接回家，绕到环岛路走了一段。海风把外套吹得鼓起来，路灯把影子拉得很长，远处还有人在放风筝。我在台阶上坐到天彻底黑掉，听浪一下一下拍堤。\n\n回去的路上买了一杯热的。我想，日子不该只有赶路和挤车，也该有一点用来发呆的缝隙。慢慢来，比较快。",
    "images": [],
    "mood": "🕯️",
    "weather": "overcast",
    "location": "厦门市 · 环岛路",
    "createTime": 1792753756000,
    "updateTime": null
  },
  {
    "id": 8,
    "diaryDate": "2026-10-24",
    "title": "今天的雪",
    "content": "示例页：下午开始飘雪，先到的是小冰粒，打在窗上沙沙响。\n\n等到傍晚，雪片就大了，路灯下面一片一片斜着落。我站在窗口看了很久，忘了冷。\n\n明天大概能堆一个很丑的雪人。",
    "images": [
      "/images/bg/xueshan1.png"
    ],
    "mood": "❄️",
    "weather": "snowy",
    "location": "厦门市 · 窗边",
    "createTime": 1792930000000,
    "updateTime": 1792997340350
  }
];

export default function DiaryPreviewPage() {
  return <DiaryReader pages={pages} />;
}
