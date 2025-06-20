import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { PlantType } from '../../types/plant'
import { PLANT_CONFIGS } from '../../data/plantConfigs'
import { usePlantStore } from '../../stores/plantStore'
import { t, tp } from '../../utils/i18n'
import { getCurrentSeason } from '@/utils/season'

interface PlantTypeSelectorProps {
  onSelect: (type: PlantType) => void
  onCancel: () => void
}

const PlantTypeSelector: React.FC<PlantTypeSelectorProps> = ({ onSelect, onCancel }) => {
  const [selectedType, setSelectedType] = useState<PlantType | null>(null)
  const { language } = usePlantStore()

  const handleConfirm = () => {
    if (selectedType) {
      onSelect(selectedType)
    }
  }

  // 植物の特徴翻訳
  const translateCharacteristics = (characteristics: string[]) => {
    return characteristics.map(char => {
      switch (char) {
        case '初心者向け': return t('char.beginner', language)
        case '乾燥に強い': return t('char.drought_resistant', language)
        case '手入れが簡単': return t('char.easy_care', language)
        case '縦成長': return t('char.vertical_growth', language)
        case '場所を取らない': return t('char.space_saving', language)
        case '空気清浄': return t('char.air_purifying', language)
        case '丸い葉': return t('char.round_leaves', language)
        case '存在感': return t('char.presence', language)
        case '成長が早い': return t('char.fast_growth', language)
        case '耐陰性': return t('char.shade_tolerant', language)
        case '手間いらず': return t('char.low_maintenance', language)
        case '南国風': return t('char.tropical', language)
        case 'ハート型葉': return t('char.heart_shaped', language)
        case '幸運の象徴': return t('char.lucky', language)
        case '個性的': return t('char.unique', language)
        default: return char
      }
    })
  }

  // 成長速度翻訳
  const translateGrowthSpeed = (speed: string) => {
    switch (speed) {
      case 'slow': return t('growth.speed.slow', language)
      case 'medium': return t('growth.speed.medium', language)
      case 'fast': return t('growth.speed.fast', language)
      default: return speed
    }
  }

  // 植物名翻訳 (PlantType はすべて小文字スネークケース)
  const translatePlantName = (type: PlantType) => {
    switch (type) {
      case PlantType.PACHIRA: return t('plant.pachira', language)
      case PlantType.SANSEVIERIA: return t('plant.sansevieria', language)
      case PlantType.RUBBER_TREE: return t('plant.rubber_tree', language)
      case PlantType.KENTIA_PALM: return t('plant.kentia_palm', language)
      case PlantType.MONSTERA: return t('plant.monstera', language)
      case PlantType.SPRING_SAKURA: return t('plant.spring_sakura', language)
      case PlantType.SUMMER_SUNFLOWER: return t('plant.summer_sunflower', language)
      case PlantType.AUTUMN_MAPLE: return t('plant.autumn_maple', language)
      case PlantType.WINTER_POINSETTIA: return t('plant.winter_poinsettia', language)
      default:
        return PLANT_CONFIGS[type as PlantType]?.name ?? type
    }
  }

  const iconMap: Record<PlantType, string> = {
    [PlantType.PACHIRA]: '🌿',
    [PlantType.SANSEVIERIA]: '🪴',
    [PlantType.RUBBER_TREE]: '🌳',
    [PlantType.KENTIA_PALM]: '🌴',
    [PlantType.MONSTERA]: '🍃',
    [PlantType.SPRING_SAKURA]: '🌸',
    [PlantType.SUMMER_SUNFLOWER]: '🌻',
    [PlantType.AUTUMN_MAPLE]: '🍁',
    [PlantType.WINTER_POINSETTIA]: '❄️'
  }

  const currentSeason = getCurrentSeason()

  // 現在季節のラベルマップ
  const seasonLabelJa: Record<import('@/utils/season').Season, string> = {
    spring: '春',
    summer: '夏',
    autumn: '秋',
    winter: '冬'
  }
  const seasonLabelEn: Record<import('@/utils/season').Season, string> = {
    spring: 'Spring',
    summer: 'Summer',
    autumn: 'Autumn',
    winter: 'Winter'
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <motion.div
        className="bg-white/20 dark:bg-black/30 backdrop-blur-xl rounded-3xl p-8 max-w-4xl w-full border border-white/30 dark:border-white/10 max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            {t('select.plant.title', language)}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {t('select.plant.subtitle', language)}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {Object.entries(PLANT_CONFIGS)
            .filter(([_, cfg]) => !cfg.availableSeason || cfg.availableSeason === currentSeason)
            .map(([type, config]) => (
            <motion.div
              key={type}
              className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedType === type
                  ? 'border-green-500 bg-green-50/80 dark:bg-green-900/40'
                  : 'border-white/30 dark:border-white/20 bg-white/10 dark:bg-black/20 hover:bg-white/20 dark:hover:bg-black/30'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              data-testid="plant-type-item"
              onClick={() => setSelectedType(type as PlantType)}
            >
              {/* 季節限定バッジ */}
              {config.availableSeason && (
                <span
                  className="absolute top-2 right-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-yellow-400/90 text-gray-800 shadow"
                >
                  {language === 'ja'
                    ? `${seasonLabelJa[config.availableSeason]}限定`
                    : `${seasonLabelEn[config.availableSeason]} Only`}
                </span>
              )}
              <div className="text-center">
                <div 
                  className="text-5xl mb-4"
                  style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
                >
                  {iconMap[type as PlantType] ?? '🌱'}
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">
                  {translatePlantName(type as PlantType) ?? config.name}
                </h3>
                
                {/* 特徴 */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    {t('characteristics', language)}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {translateCharacteristics(config.characteristics).join(' • ')}
                  </p>
                </div>
                
                {/* ケア要件 */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-200 font-medium">
                      {t('growth.speed', language)}:
                    </span>
                    <span className="text-gray-600 dark:text-gray-300">
                      {translateGrowthSpeed(config.growthSpeed)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-200 font-medium">
                      {t('water.frequency', language)}:
                    </span>
                    <span className="text-gray-600 dark:text-gray-300">
                      {config.careRequirements.waterFrequency === 1
                        ? t('water.daily', language)
                        : tp('water.interval', language, { num: config.careRequirements.waterFrequency })
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-200 font-medium">
                      {t('sun.requirement', language)}:
                    </span>
                    <span className="text-gray-600 dark:text-gray-300">
                      {language === 'ja' 
                        ? `${config.careRequirements.sunRequirement}${t('sun.hours', language)}`
                        : `${config.careRequirements.sunRequirement} ${t('sun.hours', language)}`
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-200 font-medium">
                      {t('talk.bonus', language)}:
                    </span>
                    <span className="text-gray-600 dark:text-gray-300">
                      {config.careRequirements.talkBonus 
                        ? t('talk.effective', language)
                        : t('talk.not_much', language)
                      }
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center space-x-4">
          <motion.button
            className="px-8 py-3 bg-gray-500/20 text-gray-700 rounded-full font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCancel}
          >
            {t('cancel', language)}
          </motion.button>
          <motion.button
            className={`px-8 py-3 rounded-full font-medium ${
              selectedType
                ? 'bg-green-500 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            whileHover={selectedType ? { scale: 1.05 } : {}}
            whileTap={selectedType ? { scale: 0.95 } : {}}
            data-testid="confirm-plant-button"
            onClick={handleConfirm}
            disabled={!selectedType}
          >
            {t('select.this.plant', language)}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default PlantTypeSelector 