import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import LiquidDroplet from '../liquid-glass/LiquidDroplet'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = '確認',
  cancelText = 'キャンセル',
  type = 'danger'
}) => {
  const getTypeColor = () => {
    switch (type) {
      case 'danger':
        return 'rgba(239, 68, 68, 0.3)'
      case 'warning':
        return 'rgba(245, 158, 11, 0.3)'
      case 'info':
        return 'rgba(59, 130, 246, 0.3)'
      default:
        return 'rgba(156, 163, 175, 0.3)'
    }
  }

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景オーバーレイ */}
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 transform-gpu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* モーダル本体 */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4 transform-gpu"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="w-full max-w-md p-6 space-y-6"
              style={{
                background: `linear-gradient(135deg, 
                  rgba(255, 255, 255, 0.95) 0%, 
                  rgba(255, 255, 255, 0.9) 100%)`,
                backdropFilter: 'blur(24px) saturate(130%)',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: `
                  0 20px 60px rgba(0, 0, 0, 0.15),
                  inset 0 2px 12px rgba(255, 255, 255, 0.4)
                `,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* アイコンとタイトル */}
              <div className="text-center space-y-4">
                <motion.div
                  className="flex justify-center"
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{
                      background: `radial-gradient(circle, ${getTypeColor()} 0%, transparent 70%)`,
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    <AlertTriangle 
                      size={32} 
                      className={
                        type === 'danger' ? 'text-red-500' :
                        type === 'warning' ? 'text-yellow-500' :
                        'text-blue-500'
                      } 
                    />
                  </div>
                </motion.div>

                <h3 className="text-xl font-bold text-gray-800">
                  {title}
                </h3>
              </div>

              {/* メッセージ */}
              <div className="text-center">
                <p className="text-gray-600 leading-relaxed">
                  {message}
                </p>
              </div>

              {/* アクションボタン */}
              <div className="flex space-x-3 pt-2">
                {/* キャンセルボタン */}
                <LiquidDroplet
                  size={120}
                  color="rgba(156, 163, 175, 0.2)"
                  onTouch={onClose}
                  className="flex-1"
                >
                  <span className="text-sm font-medium text-gray-700">
                    {cancelText}
                  </span>
                </LiquidDroplet>

                {/* 確認ボタン */}
                <LiquidDroplet
                  size={120}
                  color={getTypeColor()}
                  onTouch={handleConfirm}
                  className="flex-1"
                >
                  <span 
                    className={`text-sm font-medium ${
                      type === 'danger' ? 'text-red-700' :
                      type === 'warning' ? 'text-yellow-700' :
                      'text-blue-700'
                    }`}
                  >
                    {confirmText}
                  </span>
                </LiquidDroplet>
              </div>

              {/* 装飾的な水滴エフェクト */}
              <motion.div
                className="absolute -top-2 -right-2 w-4 h-4 opacity-30"
                style={{
                  background: getTypeColor(),
                  borderRadius: '50% 40% 50% 40%',
                  filter: 'blur(1px)',
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ConfirmModal 