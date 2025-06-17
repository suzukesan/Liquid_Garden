import { Plant, PlantType } from '@/types/plant'

export interface PlantPersonality {
  // 物理的特徴
  leanAngle: number      // 傾き角度 (-15 ~ 15度)
  leafCount: number      // 葉の数の補正 (-2 ~ +3)
  colorVariation: number // 色の変化 (0.8 ~ 1.2)
  sizeVariation: number  // サイズ変化 (0.9 ~ 1.1)
  
  // 動きの特徴
  swaySpeed: number      // 揺れの速さ (0.5 ~ 2.0)
  swayAmplitude: number  // 揺れの幅 (0.7 ~ 1.3)
  glowIntensity: number  // 輝きの強さ (0.8 ~ 1.5)
  
  // 性格的特徴
  shyness: number        // 恥ずかしがり屋度 (0 ~ 1)
  playfulness: number    // 遊び好き度 (0 ~ 1)
  sensitivity: number    // 敏感さ (0 ~ 1)
  
  // 個性的な名前候補
  nameVariations: string[]
}

// 植物のIDに基づいた安定したランダム生成
const seededRandom = (seed: string, min: number, max: number): number => {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // 32bit整数に変換
  }
  const normalized = Math.abs(Math.sin(hash)) // 0-1の範囲に正規化
  return min + normalized * (max - min)
}

const seededRandomInt = (seed: string, min: number, max: number): number => {
  return Math.floor(seededRandom(seed, min, max + 1))
}

// 植物タイプ別の名前バリエーション
const getNameVariations = (type: PlantType): string[] => {
  switch (type) {
    case 'pachira':
      return [
        'みどりちゃん', 'パッチー', 'リーフィ', 'みどり丸',
        'ぱきぱき', 'グリーニー', 'わかば', 'みど太',
        'リーフ子', 'パキラン', 'みどりん', 'グリーン君'
      ]
    case 'sansevieria':
      return [
        'サンちゃん', 'スリム', 'トラちゃん', 'シャープ',
        'サンサン', 'スッキリ', 'トラ吉', 'ストレート',
        'サンス', 'スマート', 'シュッと', 'タテタテ'
      ]
    case 'monstera':
      return [
        'モンちゃん', 'ハート', 'モンスター', 'あなあな',
        'モンモン', 'ハートン', '穴太郎', 'モンテラ',
        'ハーティ', 'あなちゃん', 'モンスタ', 'ハート君'
      ]
    default:
      return ['みどりちゃん', 'グリーン', 'わかば', 'リーフ']
  }
}

export const generatePlantPersonality = (plant: Plant): PlantPersonality => {
  const seed = plant.id
  
  return {
    // 物理的特徴（植物IDで固定）
    leanAngle: seededRandom(seed + 'lean', -15, 15),
    leafCount: seededRandomInt(seed + 'leaves', -2, 3),
    colorVariation: seededRandom(seed + 'color', 0.8, 1.2),
    sizeVariation: seededRandom(seed + 'size', 0.9, 1.1),
    
    // 動きの特徴
    swaySpeed: seededRandom(seed + 'speed', 0.5, 2.0),
    swayAmplitude: seededRandom(seed + 'amplitude', 0.7, 1.3),
    glowIntensity: seededRandom(seed + 'glow', 0.8, 1.5),
    
    // 性格
    shyness: seededRandom(seed + 'shy', 0, 1),
    playfulness: seededRandom(seed + 'play', 0, 1),
    sensitivity: seededRandom(seed + 'sense', 0, 1),
    
    nameVariations: getNameVariations(plant.type)
  }
}

// 植物の状態に基づく動的な表現調整
export const getPlantStateModifiers = (plant: Plant, personality: PlantPersonality) => {
  const healthRatio = plant.health / 100
  const happinessRatio = plant.loveLevel / 5
  
  return {
    // 健康状態による調整
    swaySpeed: personality.swaySpeed * (0.3 + healthRatio * 0.7),
    glowIntensity: personality.glowIntensity * (0.5 + happinessRatio * 0.5),
    colorSaturation: healthRatio * personality.colorVariation,
    
    // 気分による調整
    bounceHeight: happinessRatio * personality.playfulness * 5,
    shyReaction: personality.shyness * (1 - happinessRatio * 0.5),
    
    // 注意を引く必要性
    needsAttention: plant.health < 50 || 
      (Date.now() - plant.lastWatered.getTime()) > 2 * 24 * 60 * 60 * 1000
  }
}

// プロシージャルな色生成
export const generatePlantColors = (plant: Plant, personality: PlantPersonality) => {
  const baseHue = plant.type === 'pachira' ? 120 : // 緑
                  plant.type === 'sansevieria' ? 140 : // 黄緑
                  plant.type === 'monstera' ? 110 : 120 // 深緑
  
  const healthRatio = plant.health / 100
  const variation = personality.colorVariation
  
  return {
    primary: `hsl(${baseHue + (variation - 1) * 20}, ${60 + healthRatio * 20}%, ${40 + healthRatio * 15}%)`,
    secondary: `hsl(${baseHue + (variation - 1) * 20}, ${40 + healthRatio * 30}%, ${60 + healthRatio * 10}%)`,
    glow: `hsl(${baseHue + (variation - 1) * 20}, ${80}%, ${70}%)`,
    glass: `hsla(${baseHue + (variation - 1) * 20}, ${30 + healthRatio * 20}%, ${85}%, 0.3)`
  }
} 