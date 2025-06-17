export interface Plant {
  id: string
  name: string
  type: PlantType
  growthStage: GrowthStage
  health: number // 0-100
  growthProgress: number // 0-100 for current stage
  loveLevel: number // 0-5
  lastWatered: Date
  lastSunExposure: Date
  lastTalk: Date
  createdAt: Date
}

export enum PlantType {
  PACHIRA = 'pachira',
  SANSEVIERIA = 'sansevieria', 
  RUBBER_TREE = 'rubber_tree',
  KENTIA_PALM = 'kentia_palm',
  MONSTERA = 'monstera'
}

export enum GrowthStage {
  SEED = 'seed',
  SPROUT = 'sprout',
  SMALL_LEAVES = 'small_leaves',
  LARGE_LEAVES = 'large_leaves',
  FLOWER = 'flower'
}

export interface PlantCareAction {
  id: string
  plantId: string
  action: CareActionType
  timestamp: Date
  value?: number
}

export enum CareActionType {
  WATER = 'water',
  SUN_EXPOSURE = 'sun_exposure',
  TALK = 'talk'
}

export interface PlantConfig {
  name: string
  type: PlantType
  growthSpeed: 'slow' | 'medium' | 'fast'
  characteristics: string[]
  liquidGlassEffect: {
    color: string
    effect: string
    pattern: string
  }
  careRequirements: {
    waterFrequency: number // days
    sunRequirement: number // hours per day
    talkBonus: boolean
  }
}
