export interface DiaryQuestion {
  id: number;
  question: string;
}

export interface Diary {
  id: number;
  // 后端以 YYYY-MM-DD 返回，避免时区换算把日期挪一天
  diaryDate: string;
  title?: string;
  content: string;
  images: string[];
  mood?: string;
  weather?: string;
  location?: string;
  createTime?: number;
  updateTime?: number;
}

export interface DiaryMonth {
  year: number;
  month: number;
  count: number;
}

export interface DiaryBook {
  year: number;
  month: number;
  total: number;
  months: DiaryMonth[];
  entries: Diary[];
}
