import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { PlantType } from '../../types/plant'
import { PLANT_CONFIGS } from '../../data/plantConfigs'

interface PlantTypeSelectorProps {
  onSelect: (type: PlantType) => void
  onCancel: () => void
}

const PlantTypeSelector: React.FC<PlantTypeSelectorProps> = ({ onSelect, onCancel }) => {
  const [selectedType, setSelectedType] = useState<PlantType | null>(null)

  const handleConfirm = () => {
    if (selectedType) {
      onSelect(selectedType)
    }
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
        className="bg-white/20 backdrop-blur-xl rounded-3xl p-8 max-w-2xl w-full border border-white/30"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          どの植物を迎えますか？
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {Object.entries(PLANT_CONFIGS).map(([type, config]) => (
            <motion.div
              key={type}
              className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedType === type
                  ? 'border-green-500 bg-green-50/80'
                  : 'border-white/30 bg-white/10 hover:bg-white/20'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedType(type as PlantType)}
            >
              <div className="text-center">
                <div 
                  className="text-4xl mb-3"
                  style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
                >
                  {type === 'PACHIRA' ? '🌿' : 
                   type === 'SANSEVIERIA' ? '🪴' :
                   type === 'RUBBER_TREE' ? '🌳' :
                   type === 'KENTIA_PALM' ? '🌴' :
                   type === 'MONSTERA' ? '🍃' : '🌱'}
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {config.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {config.characteristics.join('・')}
                </p>
                <div className="space-y-1 text-xs text-gray-700">
                  <div>成長: {
                    config.growthSpeed === 'slow' ? 'ゆっくり' :
                    config.growthSpeed === 'medium' ? '中程度' :
                    config.growthSpeed === 'fast' ? '早い' : config.growthSpeed
                  }</div>
                  <div>水やり: {config.careRequirements.waterFrequency}日に1回</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center space-x-4">
          <motion.button
            className="px-6 py-3 bg-gray-500/20 text-gray-700 rounded-full font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCancel}
          >
            キャンセル
          </motion.button>
          <motion.button
            className={`px-6 py-3 rounded-full font-medium ${
              selectedType
                ? 'bg-green-500 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            whileHover={selectedType ? { scale: 1.05 } : {}}
            whileTap={selectedType ? { scale: 0.95 } : {}}
            onClick={handleConfirm}
            disabled={!selectedType}
          >
            この子を迎える
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default PlantTypeSelector 