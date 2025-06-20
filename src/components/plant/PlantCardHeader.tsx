import React from 'react'
import { Plant, GrowthStage } from '@/types/plant'
import { generatePlantPersonality } from '@/utils/plantPersonality'
import { t } from '@/utils/i18n'
import { usePlantStore } from '@/stores/plantStore'

interface PlantCardHeaderProps {
  plant: Plant
}

export const PlantCardHeader: React.FC<PlantCardHeaderProps> = React.memo(({ plant }) => {
  const { language } = usePlantStore()
  
  // 植物の個性的な名前表示
  const personalizedName = React.useMemo(() => {
    const personality = generatePlantPersonality(plant)
    const variations = personality.nameVariations
    const dayIndex = Math.floor(Date.now() / (24 * 60 * 60 * 1000)) % variations.length
    return variations[dayIndex]
  }, [plant])

  // 成長段階の詩的表現
  const growth = React.useMemo(() => {
    switch (plant.growthStage) {
      case GrowthStage.SEED: return { emoji: '🌱', poetry: '小さな希望を宿した種' }
      case GrowthStage.SPROUT: return { emoji: '🌿', poetry: '命あふれる新芽' }
      case GrowthStage.SMALL_LEAVES: return { emoji: '🍃', poetry: '若葉色の歌声' }
      case GrowthStage.LARGE_LEAVES: return { emoji: '🌳', poetry: '深緑の豊かな歌声' }
      case GrowthStage.FLOWER: return { emoji: '🌸', poetry: '花ひらく生命の詩' }
      default: return { emoji: '🌱', poetry: '小さな希望を宿した種' }
    }
  }, [plant.growthStage])

  const translatedType = React.useMemo(() => {
    return t(`plant.${plant.type}`, language)
  }, [plant.type, language])

  return (
    <div className="flex items-start justify-between mb-6">
      <div className="flex-1">
        <h3 className="text-2xl font-bold mb-1 text-gray-800">
          {personalizedName}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{translatedType}</p>
        
        <p className="text-base text-gray-700 leading-relaxed font-medium">
          {growth.poetry}
        </p>
      </div>
      
      <div className="text-4xl ml-6">
        {growth.emoji}
      </div>
    </div>
  )
}) 