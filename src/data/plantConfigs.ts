import { PlantConfig, PlantType } from '@/types/plant'

export const PLANT_CONFIGS: Record<PlantType, PlantConfig> = {
  [PlantType.PACHIRA]: {
    name: 'パキラ',
    type: PlantType.PACHIRA,
    growthSpeed: 'slow',
    characteristics: ['初心者向け', '乾燥に強い', '手入れが簡単'],
    liquidGlassEffect: {
      color: 'rgba(34, 197, 94, 0.3)', // 緑がかった
      effect: 'wave',
      pattern: 'ripple'
    },
    careRequirements: {
      waterFrequency: 3, // 3日に1回
      sunRequirement: 4, // 1日4時間
      talkBonus: true
    }
  },
  [PlantType.SANSEVIERIA]: {
    name: 'サンスベリア',
    type: PlantType.SANSEVIERIA,
    growthSpeed: 'medium',
    characteristics: ['縦成長', '場所を取らない', '空気清浄'],
    liquidGlassEffect: {
      color: 'rgba(255, 255, 255, 0.2)', // クリアガラス
      effect: 'linear',
      pattern: 'straight'
    },
    careRequirements: {
      waterFrequency: 7, // 週1回
      sunRequirement: 6, // 1日6時間
      talkBonus: false
    }
  },
  [PlantType.RUBBER_TREE]: {
    name: 'ゴムの木',
    type: PlantType.RUBBER_TREE,
    growthSpeed: 'fast',
    characteristics: ['丸い葉', '存在感', '成長が早い'],
    liquidGlassEffect: {
      color: 'rgba(251, 146, 60, 0.25)', // 温かみのある
      effect: 'circular',
      pattern: 'round'
    },
    careRequirements: {
      waterFrequency: 2, // 2日に1回
      sunRequirement: 8, // 1日8時間
      talkBonus: true
    }
  },
  [PlantType.KENTIA_PALM]: {
    name: 'ケンチャヤシ',
    type: PlantType.KENTIA_PALM,
    growthSpeed: 'slow',
    characteristics: ['耐陰性', '手間いらず', '南国風'],
    liquidGlassEffect: {
      color: 'rgba(59, 130, 246, 0.3)', // 青みがかった
      effect: 'tropical',
      pattern: 'wave'
    },
    careRequirements: {
      waterFrequency: 4, // 4日に1回
      sunRequirement: 3, // 1日3時間
      talkBonus: false
    }
  },
  [PlantType.MONSTERA]: {
    name: 'モンステラ',
    type: PlantType.MONSTERA,
    growthSpeed: 'medium',
    characteristics: ['ハート型葉', '幸運の象徴', '個性的'],
    liquidGlassEffect: {
      color: 'rgba(236, 72, 153, 0.25)', // ハート型
      effect: 'heart',
      pattern: 'organic'
    },
    careRequirements: {
      waterFrequency: 3, // 3日に1回
      sunRequirement: 5, // 1日5時間
      talkBonus: true
    }
  }
}
