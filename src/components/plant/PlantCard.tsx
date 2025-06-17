import React, { useState } from 'react'
import { motion } from 'framer-motion'
import LiquidGlass from '@/components/liquid-glass/LiquidGlass'
import { Button } from '@/components/ui/button'
import { Plant, GrowthStage } from '@/types/plant'
import { PLANT_CONFIGS } from '@/data/plantConfigs'
import { usePlantStore } from '@/stores/plantStore'
import { Droplets, Sun, MessageCircle } from 'lucide-react'

interface PlantCardProps {
  plant: Plant
  className?: string
}

const PlantCard: React.FC<PlantCardProps> = ({ plant, className }) => {
  const [isHovered, setIsHovered] = useState(false)
  const { waterPlant, giveSunExposure, talkToPlant, updatePlantGrowth } = usePlantStore()
  
  const config = PLANT_CONFIGS[plant.type]
  
  const getPlantEmoji = (stage: GrowthStage) => {
    switch (stage) {
      case GrowthStage.SEED:
        return '🌱'
      case GrowthStage.SPROUT:
        return '🌿'
      case GrowthStage.SMALL_LEAVES:
        return '🪴'
      case GrowthStage.LARGE_LEAVES:
        return '🌳'
      case GrowthStage.FLOWER:
        return '🌺'
      default:
        return '🌱'
    }
  }

  const getStageText = (stage: GrowthStage) => {
    switch (stage) {
      case GrowthStage.SEED:
        return '種子'
      case GrowthStage.SPROUT:
        return '発芽'
      case GrowthStage.SMALL_LEAVES:
        return '小さな葉'
      case GrowthStage.LARGE_LEAVES:
        return '大きな葉'
      case GrowthStage.FLOWER:
        return '花'
      default:
        return '種子'
    }
  }

  const handleCareAction = (action: 'water' | 'sun' | 'talk') => {
    switch (action) {
      case 'water':
        waterPlant(plant.id)
        break
      case 'sun':
        giveSunExposure(plant.id)
        break
      case 'talk':
        talkToPlant(plant.id)
        break
    }
    
    // Check for growth progress
    setTimeout(() => {
      updatePlantGrowth(plant.id)
    }, 100)
  }

  const getHealthColor = (health: number) => {
    if (health >= 80) return 'text-green-500'
    if (health >= 60) return 'text-yellow-500'
    if (health >= 40) return 'text-orange-500'
    return 'text-red-500'
  }

  return (
    <LiquidGlass
      className={className}
      glassColor={config.liquidGlassEffect.color}
      effect={config.liquidGlassEffect.effect as any}
      pattern={config.liquidGlassEffect.pattern as any}
      isHovered={isHovered}
      onClick={() => setIsHovered(!isHovered)}
    >
      <div 
        className="space-y-4"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Plant Display */}
        <div className="text-center">
          <motion.div
            className="text-8xl mb-2"
            animate={{
              scale: isHovered ? 1.1 : 1,
              rotate: isHovered ? 5 : 0,
            }}
            transition={{
              duration: 0.3,
              ease: 'easeOut'
            }}
          >
            {getPlantEmoji(plant.growthStage)}
          </motion.div>
          
          <h3 className="text-xl font-semibold text-foreground mb-1">
            {plant.name}
          </h3>
          
          <p className="text-sm text-muted-foreground">
            {config.name} • {getStageText(plant.growthStage)}
          </p>
        </div>

        {/* Status Bars */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">健康度</span>
            <span className={`text-sm font-medium ${getHealthColor(plant.health)}`}>
              {plant.health}%
            </span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <motion.div
              className="bg-green-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${plant.health}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">成長進度</span>
            <span className="text-sm font-medium text-blue-500">
              {Math.round(plant.growthProgress)}%
            </span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <motion.div
              className="bg-blue-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${plant.growthProgress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">愛情レベル</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-sm ${
                    i < Math.floor(plant.loveLevel) 
                      ? 'text-pink-500' 
                      : 'text-gray-300'
                  }`}
                >
                  ❤️
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Care Actions */}
        <div className="flex justify-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation()
              handleCareAction('water')
            }}
            className="flex items-center space-x-1"
          >
            <Droplets className="w-4 h-4 text-blue-500" />
            <span>水やり</span>
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation()
              handleCareAction('sun')
            }}
            className="flex items-center space-x-1"
          >
            <Sun className="w-4 h-4 text-yellow-500" />
            <span>日光浴</span>
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation()
              handleCareAction('talk')
            }}
            className="flex items-center space-x-1"
          >
            <MessageCircle className="w-4 h-4 text-green-500" />
            <span>話しかけ</span>
          </Button>
        </div>
      </div>
    </LiquidGlass>
  )
}

export default PlantCard
