export type Season = 'spring' | 'summer' | 'autumn' | 'winter'

/**
 * 現在の季節を取得（北半球基準）。
 * - 春: 3–5 月
 * - 夏: 6–8 月
 * - 秋: 9–11 月
 * - 冬: 12–2 月
 */
export const getCurrentSeason = (date: Date = new Date()): Season => {
  const month = date.getMonth() + 1 // 1-indexed
  if (month >= 3 && month <= 5) return 'spring'
  if (month >= 6 && month <= 8) return 'summer'
  if (month >= 9 && month <= 11) return 'autumn'
  return 'winter'
} 