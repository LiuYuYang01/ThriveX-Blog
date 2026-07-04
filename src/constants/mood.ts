export const MOOD_OPTIONS = [
  { emoji: '😊', label: '开心', score: 5 },
  { emoji: '🥰', label: '幸福', score: 5 },
  { emoji: '😌', label: '平静', score: 4 },
  { emoji: '🤔', label: '思考', score: 3 },
  { emoji: '😐', label: '一般', score: 3 },
  { emoji: '😴', label: '疲惫', score: 2 },
  { emoji: '😢', label: '难过', score: 1 },
  { emoji: '😤', label: '生气', score: 1 },
] as const;

export const moodScore = (emoji?: string) =>
  MOOD_OPTIONS.find((m) => m.emoji === emoji)?.score ?? 3;
