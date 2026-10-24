import type { IconType } from 'react-icons';
import {
  GiFluffyCloud,
  GiFog,
  GiLightningStorm,
  GiMoon,
  GiRaining,
  GiSnowing,
  GiSun,
  GiSunCloud,
  GiWindyStripes,
} from 'react-icons/gi';

// 后台写入的天气是英文标识，这里只负责展示
export const WEATHER_META: Record<string, { label: string; icon: IconType }> = {
  sunny: { label: '晴', icon: GiSun },
  cloudy: { label: '多云', icon: GiSunCloud },
  overcast: { label: '阴', icon: GiFluffyCloud },
  rainy: { label: '雨', icon: GiRaining },
  snowy: { label: '雪', icon: GiSnowing },
  windy: { label: '风', icon: GiWindyStripes },
  foggy: { label: '雾', icon: GiFog },
  thunder: { label: '雷阵雨', icon: GiLightningStorm },
  night: { label: '夜', icon: GiMoon },
};
