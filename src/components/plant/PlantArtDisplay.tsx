import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Plant } from '@/types/plant'
import { generatePlantArt } from '@/utils/plantAsciiArt'

interface PlantArtDisplayProps {
  plant: Plant
  size?: 'small' | 'medium' | 'large'
  showDescription?: boolean
  className?: string
}

const PlantArtDisplay: React.FC<PlantArtDisplayProps> = ({ 
  plant, 
  size = 'medium', 
  showDescription = false,
  className = ''
}) => {
  // AAアート生成をメモ化（植物の主要な状態が変わった時のみ再計算）
  const artConfig = useMemo(() => 
    generatePlantArt(plant), 
    [plant.type, plant.growthStage, plant.health, plant.loveLevel]
  )
  
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'text-xs leading-none'
      case 'medium':
        return 'text-sm leading-tight'
      case 'large':
        return 'text-base leading-snug'
      default:
        return 'text-sm leading-tight'
    }
  }

  return (
    <motion.div
      className={`text-center ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* AAアート本体 */}
      <motion.div
        className={`font-mono whitespace-pre-line select-none ${getSizeClasses()}`}
        animate={{
          scale: [1, 1.02, 1],
          rotate: [0, 0.5, -0.5, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))',
          textShadow: '0 0 1px rgba(255,255,255,0.8)'
        }}
      >
        {artConfig.art.join('\n')}
      </motion.div>
      
      {/* 説明テキスト */}
      {showDescription && (
        <motion.p
          className="text-xs text-gray-600 mt-2 italic"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          {artConfig.description}
        </motion.p>
      )}
    </motion.div>
  )
}

export default PlantArtDisplay 