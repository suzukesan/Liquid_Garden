import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MoreVertical, Edit3, Settings, Heart } from 'lucide-react'

interface PlantActionsProps {
  onDelete: () => void
  className?: string
}

const PlantActions: React.FC<PlantActionsProps> = ({ onDelete, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsOpen(!isOpen)
  }

  const handleAction = (action: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation()
    action()
    setIsOpen(false)
  }

  return (
    <div className={`relative ${className}`}>
      {/* メインボタン */}
      <motion.button
        onClick={handleToggle}
        className="p-2 rounded-full bg-white bg-opacity-80 backdrop-blur-sm border border-gray-200 hover:bg-opacity-100 transition-all duration-200"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}
      >
        <MoreVertical size={16} className="text-gray-600" />
      </motion.button>

      {/* ドロップダウンメニュー */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* 背景オーバーレイ */}
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            
            {/* メニュー */}
            <motion.div
              className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl border border-gray-200 shadow-lg z-50"
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              style={{
                backdropFilter: 'blur(20px)',
                backgroundColor: 'rgba(255, 255, 255, 0.95)'
              }}
            >
              <div className="py-2">
                {/* 名前を変更 */}
                <motion.button
                  onClick={handleAction(() => {
                    // TODO: 名前変更機能を実装
                    console.log('名前を変更')
                  })}
                  className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                  whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
                >
                  <Edit3 size={16} className="text-gray-500" />
                  <span>名前を変更</span>
                </motion.button>

                {/* 詳細設定 */}
                <motion.button
                  onClick={handleAction(() => {
                    // TODO: 詳細設定機能を実装
                    console.log('詳細設定')
                  })}
                  className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                  whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
                >
                  <Settings size={16} className="text-gray-500" />
                  <span>詳細設定</span>
                </motion.button>

                {/* 区切り線 */}
                <div className="my-1 border-t border-gray-100" />

                {/* お別れする */}
                <motion.button
                  onClick={handleAction(onDelete)}
                  className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3 transition-colors"
                  whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.05)' }}
                >
                  <Heart size={16} className="text-red-500" />
                  <span>お別れする</span>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PlantActions 