import { PlantConfig, PlantType } from '@/types/plant'

export const PLANT_CONFIGS: Record<PlantType, PlantConfig> = {
  [PlantType.PACHIRA]: {
    name: 'パキラ',
    type: PlantType.PACHIRA,
    growthSpeed: 'medium',
    characteristics: ['初心者向け', '乾燥に強い', '空気清浄'],
    liquidGlassEffect: {
      color: 'rgba(34, 197, 94, 0.3)', // 緑がかった
      effect: 'wave',
      pattern: 'ripple'
    },
    careRequirements: {
      waterFrequency: 7, // 7日に1回
      sunRequirement: 3, // 1日3時間
      talkBonus: true
    }
  },
  [PlantType.SANSEVIERIA]: {
    name: 'サンスベリア',
    type: PlantType.SANSEVIERIA,
    growthSpeed: 'slow',
    characteristics: ['縦成長', '場所を取らない', '空気清浄'],
    liquidGlassEffect: {
      color: 'rgba(255, 255, 255, 0.2)', // クリアガラス
      effect: 'linear',
      pattern: 'straight'
    },
    careRequirements: {
      waterFrequency: 14, // 2週間に1回
      sunRequirement: 4, // 1日4時間
      talkBonus: false
    }
  },
  [PlantType.RUBBER_TREE]: {
    name: 'ゴムの木',
    type: PlantType.RUBBER_TREE,
    growthSpeed: 'medium',
    characteristics: ['丸い葉', '存在感', '成長が早い'],
    liquidGlassEffect: {
      color: 'rgba(251, 146, 60, 0.25)', // 温かみのある
      effect: 'circular',
      pattern: 'round'
    },
    careRequirements: {
      waterFrequency: 7, // 7日に1回
      sunRequirement: 6, // 1日6時間
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
      waterFrequency: 5, // 5日に1回
      sunRequirement: 3, // 1日3時間
      talkBonus: false
    }
  },
  [PlantType.MONSTERA]: {
    name: 'モンステラ',
    type: PlantType.MONSTERA,
    growthSpeed: 'fast',
    characteristics: ['ハート型葉', '幸運の象徴', '個性的'],
    liquidGlassEffect: {
      color: 'rgba(236, 72, 153, 0.25)', // ハート型
      effect: 'heart',
      pattern: 'organic'
    },
    careRequirements: {
      waterFrequency: 5, // 5日に1回
      sunRequirement: 4, // 1日4時間
      talkBonus: true
    }
  },
  [PlantType.WINTER_POINSETTIA]: {
    name: 'ポインセチア (冬限定)',
    type: PlantType.WINTER_POINSETTIA,
    growthSpeed: 'slow',
    characteristics: ['冬のシンボル', '鮮やかな赤', '華やか'],
    liquidGlassEffect: {
      color: 'rgba(220, 38, 38, 0.35)',
      effect: 'snow',
      pattern: 'flake'
    },
    careRequirements: {
      waterFrequency: 5,
      sunRequirement: 4,
      talkBonus: true
    },
    availableSeason: 'winter'
  },
  [PlantType.SPRING_SAKURA]: {
    name: '桜 (春限定)',
    type: PlantType.SPRING_SAKURA,
    growthSpeed: 'fast',
    characteristics: ['春の象徴', '花見', '儚さ'],
    liquidGlassEffect: {
      color: 'rgba(236, 72, 153, 0.35)',
      effect: 'petal',
      pattern: 'sakura'
    },
    careRequirements: {
      waterFrequency: 3,
      sunRequirement: 6,
      talkBonus: false
    },
    availableSeason: 'spring'
  },
  [PlantType.SUMMER_SUNFLOWER]: {
    name: 'ひまわり (夏限定)',
    type: PlantType.SUMMER_SUNFLOWER,
    growthSpeed: 'fast',
    characteristics: ['太陽を追う', '元気', '背高い'],
    liquidGlassEffect: {
      color: 'rgba(250, 204, 21, 0.35)',
      effect: 'sun',
      pattern: 'ripple'
    },
    careRequirements: {
      waterFrequency: 2,
      sunRequirement: 8,
      talkBonus: false
    },
    availableSeason: 'summer'
  },
  [PlantType.AUTUMN_MAPLE]: {
    name: '紅葉カエデ (秋限定)',
    type: PlantType.AUTUMN_MAPLE,
    growthSpeed: 'medium',
    characteristics: ['紅葉', '深紅', '日本的'],
    liquidGlassEffect: {
      color: 'rgba(190, 24, 24, 0.35)',
      effect: 'leaf',
      pattern: 'fall'
    },
    careRequirements: {
      waterFrequency: 6,
      sunRequirement: 5,
      talkBonus: true
    },
    availableSeason: 'autumn'
  }
}
