import { Plant, PlantType, GrowthStage } from '../types/plant'

export interface PlantArtConfig {
  art: string[]
  description: string
}

export const generatePlantArt = (plant: Plant): PlantArtConfig => {
  const { type, growthStage, health, loveLevel } = plant

  // 健康状態による葉の色調整
  const getLeafEmoji = () => {
    if (health >= 80) return '🌿'
    if (health >= 60) return '🍃'
    if (health >= 40) return '🥬'
    return '🍂'
  }

  // 愛情度による装飾
  const getLoveDecorations = () => {
    const decorations = []
    if (loveLevel >= 80) decorations.push('💖', '✨', '🌟')
    else if (loveLevel >= 60) decorations.push('💕', '✨')
    else if (loveLevel >= 40) decorations.push('💚')
    return decorations
  }

  switch (type) {
    case PlantType.PACHIRA:
      return generatePachiraArt(growthStage, getLeafEmoji(), getLoveDecorations(), health)
    
    case PlantType.SANSEVIERIA:
      return generateSansevieriaArt(growthStage, getLeafEmoji(), getLoveDecorations(), health)
    
    case PlantType.RUBBER_TREE:
      return generateRubberTreeArt(growthStage, getLeafEmoji(), getLoveDecorations(), health)
    
    case PlantType.KENTIA_PALM:
      return generateKentiaPalmArt(growthStage, getLeafEmoji(), getLoveDecorations(), health)
    
    case PlantType.MONSTERA:
      return generateMonsteraArt(growthStage, getLeafEmoji(), getLoveDecorations(), health)
    
    default:
      return { art: ['🌱'], description: '不明な植物' }
  }
}

const generatePachiraArt = (stage: GrowthStage, leaf: string, decorations: string[], health: number): PlantArtConfig => {
  const trunk = health >= 70 ? '🪵' : health >= 40 ? '🟫' : '🤎'
  const soil = '🟫'
  
  switch (stage) {
    case GrowthStage.SEED:
      return {
        art: [
          '   ✨',
          ' 🌰🌱',
          '🟫🟫🟫'
        ],
        description: '種の状態'
      }
    
    case GrowthStage.SPROUT:
      return {
        art: [
          `   ${leaf}`,
          `   🌱`,
          `  ${trunk}`,
          `🟫🟫🟫`
        ],
        description: '発芽'
      }
    
    case GrowthStage.SMALL_LEAVES:
      return {
        art: [
          `  ${leaf}${leaf}`,
          `   ${leaf}`,
          `   🌱`,
          `   ${trunk}`,
          `   ${trunk}`,
          ` ${soil}${soil}${soil}`
        ],
        description: '小さな葉'
      }
    
    case GrowthStage.LARGE_LEAVES:
      return {
        art: [
          `${decorations[0] || ''} ${leaf}${leaf}${leaf} ${decorations[1] || ''}`,
          `   ${leaf}${leaf}🖐️${leaf}${leaf}`,
          `     ${leaf}${leaf}${leaf}`,
          `        ${trunk}`,
          `        ${trunk}`,
          `        ${trunk}`,
          `   ${soil}${soil}${soil}${soil}${soil}`,
          `  ${soil}${soil}${soil}${soil}${soil}${soil}`
        ],
        description: '一本立ちパキラ'
      }
    
    case GrowthStage.FLOWER:
      return {
        art: [
          `${decorations[0] || '✨'} ${leaf}${leaf}${leaf}${leaf}${leaf} ${decorations[1] || '✨'}`,
          `  ${leaf}${leaf}${leaf}🖐️${leaf}${leaf}${leaf}`,
          `    ${leaf}${leaf}${leaf}${leaf}${leaf}`,
          `      ${leaf}${leaf}${leaf}`,
          `         ${trunk}`,
          `         ${trunk}`,
          `         ${trunk}`,
          `         ${trunk}`,
          `         ${trunk}`,
          `    ${soil}${soil}${soil}${soil}${soil}${soil}`,
          `   ${soil}${soil}${soil}${soil}${soil}${soil}${soil}`,
          decorations.length > 2 ? `  ${decorations[2]}   ${decorations[2]}   ${decorations[2]}` : ''
        ].filter(Boolean),
        description: '立派なパキラ'
      }
  }
  
  return { art: ['🌱'], description: '成長中' }
}

const generateSansevieriaArt = (stage: GrowthStage, leaf: string, decorations: string[], health: number): PlantArtConfig => {
  const soil = '🟫'
  
  switch (stage) {
    case GrowthStage.SEED:
      return {
        art: [
          ' 🌰',
          '🟫🟫'
        ],
        description: '種の状態'
      }
    
    case GrowthStage.SPROUT:
      return {
        art: [
          ` ${leaf}`,
          ' 🌱',
          `${soil}${soil}`
        ],
        description: '発芽'
      }
    
    case GrowthStage.SMALL_LEAVES:
      return {
        art: [
          ` ${leaf} ${decorations[0] || ''}`,
          ` ${leaf}`,
          ` ${leaf}`,
          ` 🌱`,
          `${soil}${soil}${soil}`
        ],
        description: '縦に成長中'
      }
    
    case GrowthStage.LARGE_LEAVES:
      return {
        art: [
          ` ${leaf} ${leaf} ${decorations[0] || ''}`,
          ` ${leaf} ${leaf}`,
          ` ${leaf} ${leaf}`,
          ` ${leaf} ${leaf}`,
          ` ${leaf} ${leaf}`,
          ` 🌱 🌱`,
          `${soil}${soil}${soil}${soil}${soil}`
        ],
        description: 'サンスベリア'
      }
    
    case GrowthStage.FLOWER:
      return {
        art: [
          `${decorations[0] || '✨'} ${leaf} ${leaf} ${leaf} ${decorations[1] || '✨'}`,
          ` ${leaf} ${leaf} ${leaf}`,
          ` ${leaf} ${leaf} ${leaf}`,
          ` ${leaf} ${leaf} ${leaf}`,
          ` ${leaf} ${leaf} ${leaf}`,
          ` ${leaf} ${leaf} ${leaf}`,
          ` ${leaf} ${leaf} ${leaf}`,
          ` 🌱 🌱 🌱`,
          `${soil}${soil}${soil}${soil}${soil}${soil}${soil}`,
          decorations.length > 2 ? ` ${decorations[2]}     ${decorations[2]}` : ''
        ].filter(Boolean),
        description: '立派なサンスベリア'
      }
  }
  
  return { art: ['🌱'], description: '成長中' }
}

const generateRubberTreeArt = (stage: GrowthStage, leaf: string, decorations: string[], health: number): PlantArtConfig => {
  const trunk = health >= 70 ? '🪵' : health >= 40 ? '🟫' : '🤎'
  const soil = '🟫'
  
  switch (stage) {
    case GrowthStage.SEED:
      return {
        art: [
          ' 🌰✨',
          '🟫🟫🟫'
        ],
        description: '種の状態'
      }
    
    case GrowthStage.SPROUT:
      return {
        art: [
          ` ${leaf}`,
          ' 🌱',
          ` ${trunk}`,
          `${soil}${soil}${soil}`
        ],
        description: '発芽'
      }
    
    case GrowthStage.SMALL_LEAVES:
      return {
        art: [
          `  ${leaf}${leaf} ${decorations[0] || ''}`,
          `  ${leaf}${leaf}`,
          `   ${trunk}`,
          `   ${trunk}`,
          ` ${soil}${soil}${soil}${soil}`
        ],
        description: '小さなゴムの木'
      }
    
    case GrowthStage.LARGE_LEAVES:
      return {
        art: [
          ` ${decorations[0] || ''} ${leaf}${leaf}${leaf}${leaf}`,
          `   ${leaf}${leaf}${leaf}${leaf}${leaf}`,
          `    ${leaf}${leaf}${leaf}`,
          `      ${trunk}`,
          `      ${trunk}`,
          `      ${trunk}`,
          `   ${soil}${soil}${soil}${soil}${soil}`,
          `  ${soil}${soil}${soil}${soil}${soil}${soil}`
        ],
        description: 'ゴムの木'
      }
    
    case GrowthStage.FLOWER:
      return {
        art: [
          `${decorations[0] || '✨'} ${leaf}${leaf}${leaf}${leaf}${leaf}${leaf} ${decorations[1] || '✨'}`,
          `  ${leaf}${leaf}${leaf}${leaf}${leaf}${leaf}${leaf}`,
          `   ${leaf}${leaf}${leaf}${leaf}${leaf}${leaf}`,
          `     ${leaf}${leaf}${leaf}${leaf}`,
          `       ${trunk}${trunk}`,
          `       ${trunk}${trunk}`,
          `       ${trunk}${trunk}`,
          `       ${trunk}${trunk}`,
          `    ${soil}${soil}${soil}${soil}${soil}${soil}${soil}`,
          `   ${soil}${soil}${soil}${soil}${soil}${soil}${soil}${soil}`,
          decorations.length > 2 ? `  ${decorations[2]}       ${decorations[2]}` : ''
        ].filter(Boolean),
        description: '立派なゴムの木'
      }
  }
  
  return { art: ['🌱'], description: '成長中' }
}

const generateKentiaPalmArt = (stage: GrowthStage, leaf: string, decorations: string[], health: number): PlantArtConfig => {
  const trunk = health >= 70 ? '🪵' : health >= 40 ? '🟫' : '🤎'
  const palm = '🌴'
  const soil = '🟫'
  
  switch (stage) {
    case GrowthStage.SEED:
      return {
        art: [
          ' 🥥',
          '🟫🟫'
        ],
        description: '種の状態'
      }
    
    case GrowthStage.SPROUT:
      return {
        art: [
          ` ${leaf}`,
          ' 🌱',
          `${soil}${soil}`
        ],
        description: '発芽'
      }
    
    case GrowthStage.SMALL_LEAVES:
      return {
        art: [
          `${leaf}   ${leaf} ${decorations[0] || ''}`,
          ` ${leaf} ${leaf}`,
          `  🌱`,
          ` ${trunk}`,
          `${soil}${soil}${soil}`
        ],
        description: '小さなヤシ'
      }
    
    case GrowthStage.LARGE_LEAVES:
      return {
        art: [
          `${leaf}     ${leaf} ${decorations[0] || ''}`,
          ` ${leaf}   ${leaf}`,
          `  ${leaf} ${leaf}`,
          `   ${palm}`,
          `   ${trunk}`,
          `   ${trunk}`,
          ` ${soil}${soil}${soil}${soil}${soil}`
        ],
        description: 'ケンチャヤシ'
      }
    
    case GrowthStage.FLOWER:
      return {
        art: [
          `${decorations[0] || '🌺'} ${leaf}       ${leaf} ${decorations[1] || '🌺'}`,
          `  ${leaf}     ${leaf}`,
          `   ${leaf}   ${leaf}`,
          `    ${leaf} ${leaf}`,
          `     ${palm}`,
          `     ${trunk}`,
          `     ${trunk}`,
          `     ${trunk}`,
          `     ${trunk}`,
          `  ${soil}${soil}${soil}${soil}${soil}${soil}${soil}`,
          decorations.length > 2 ? ` ${decorations[2]}         ${decorations[2]}` : ''
        ].filter(Boolean),
        description: '立派なケンチャヤシ'
      }
  }
  
  return { art: ['🌱'], description: '成長中' }
}

const generateMonsteraArt = (stage: GrowthStage, leaf: string, decorations: string[], health: number): PlantArtConfig => {
  const trunk = health >= 70 ? '🪵' : health >= 40 ? '🟫' : '🤎'
  const heart = health >= 60 ? '💚' : '🤎'
  const soil = '🟫'
  
  switch (stage) {
    case GrowthStage.SEED:
      return {
        art: [
          ' 🌰💕',
          '🟫🟫🟫'
        ],
        description: '種の状態'
      }
    
    case GrowthStage.SPROUT:
      return {
        art: [
          ` ${heart}`,
          ' 🌱',
          ` ${trunk}`,
          `${soil}${soil}${soil}`
        ],
        description: '発芽'
      }
    
    case GrowthStage.SMALL_LEAVES:
      return {
        art: [
          ` ${decorations[0] || ''} ${heart}${heart}`,
          `  ${heart}${heart}`,
          `   ${trunk}`,
          `   ${trunk}`,
          ` ${soil}${soil}${soil}${soil}`
        ],
        description: '小さなモンステラ'
      }
    
    case GrowthStage.LARGE_LEAVES:
      return {
        art: [
          ` ${decorations[0] || ''} ${heart}${heart}${heart}`,
          `   ${heart}${heart}${heart}${heart}`,
          `    ${heart}${heart}${heart}`,
          `      ${trunk}`,
          `      ${trunk}`,
          `      ${trunk}`,
          `   ${soil}${soil}${soil}${soil}${soil}`,
          `  ${soil}${soil}${soil}${soil}${soil}${soil}`
        ],
        description: 'モンステラ'
      }
    
    case GrowthStage.FLOWER:
      return {
        art: [
          `${decorations[0] || '✨'} ${heart}${heart}${heart}${heart}${heart} ${decorations[1] || '✨'}`,
          `  ${heart}${heart}${heart}${heart}${heart}${heart}`,
          `   ${heart}${heart}🕳️${heart}${heart}${heart}`,
          `    ${heart}${heart}${heart}${heart}${heart}`,
          `      ${heart}${heart}${heart}`,
          `        ${trunk}`,
          `        ${trunk}`,
          `        ${trunk}`,
          `        ${trunk}`,
          `     ${soil}${soil}${soil}${soil}${soil}${soil}`,
          `    ${soil}${soil}${soil}${soil}${soil}${soil}${soil}`,
          decorations.length > 2 ? `   ${decorations[2]}       ${decorations[2]}` : ''
        ].filter(Boolean),
        description: '立派なモンステラ（穴あき葉）'
      }
  }
  
  return { art: ['🌱'], description: '成長中' }
} 