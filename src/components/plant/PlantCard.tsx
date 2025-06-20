import React, { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Plant } from '@/types/plant'
import { useSoundEffects } from '@/hooks/useSoundEffects'
import { usePlantEmotions } from '@/hooks/usePlantEmotions'
import { useNextAction } from '@/hooks/useNextAction'
import { PlantCardHeader } from './PlantCardHeader'
import { PlantCardMetrics } from './PlantCardMetrics'
import { ChevronRight } from 'lucide-react'

interface PlantCardProps {
  plant: Plant
  size?: 'small' | 'medium' | 'large' | 'featured'
  onClick?: () => void
}

const PlantCard: React.FC<PlantCardProps> = React.memo(({ plant, size = 'medium', onClick }) => {
  const { playRippleSound, playUISound } = useSoundEffects()
  const [isHovered, setIsHovered] = useState(false)
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])
  const cardRef = useRef<HTMLDivElement>(null)
  
  // カスタムフックを使用
  const emotionalState = usePlantEmotions(plant)
  const nextAction = useNextAction(plant)

  // 液体ガラスのスタイル計算 - より軽量に
  const liquidGlassStyle = React.useMemo(() => {
    const healthRatio = plant.health / 100
    const primaryColor = healthRatio >= 0.8 ? '#10b981' : 
                        healthRatio >= 0.6 ? '#f59e0b' : 
                        healthRatio >= 0.4 ? '#f97316' : '#ef4444'
    
    return {
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(16px) saturate(120%)',
      borderRadius: '24px',
      border: `2px solid ${primaryColor}30`,
      boxShadow: `0 8px 24px rgba(0, 0, 0, 0.1)`
    }
  }, [plant.health])

  // 水面の波紋効果を生成
  const createRipple = useCallback((event: React.MouseEvent) => {
    if (!cardRef.current) return
    
    const rect = cardRef.current.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    const newRipple = {
      id: Date.now(),
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100
    }
    
    setRipples(prev => [...prev, newRipple])
    
    // 波紋を一定時間後に削除
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id))
    }, 800)
  }, [])

  const handleClick = useCallback((event: React.MouseEvent) => {
    createRipple(event)
    playRippleSound()
    if (onClick) {
      setTimeout(() => {
        onClick()
      }, 200)
    }
  }, [createRipple, playRippleSound, onClick])

  const handleHoverStart = useCallback(() => {
    setIsHovered(true)
    playUISound('hover')
  }, [playUISound])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick?.()
    }
  }, [onClick])

  return (
    <motion.div
      ref={cardRef}
      className="relative overflow-hidden cursor-pointer group focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-400/60"
      style={liquidGlassStyle}
      whileHover={{ 
        scale: 1.02,
        y: -8,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      onHoverStart={handleHoverStart}
      onHoverEnd={() => setIsHovered(false)}
      animate={{
        scale: [1, emotionalState.breathingIntensity, 1],
      }}
      transition={{ 
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      tabIndex={0}
      aria-label={`${plant.name} カード。クリックで詳細表示`}
      onKeyDown={handleKeyDown}
    >
      {/* 緊急度インジケーター */}
      {nextAction.urgency === 'urgent' && (
        <motion.div 
          className="absolute top-4 right-4 w-4 h-4 bg-red-500 rounded-full z-20 shadow-md"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.7, 1]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {/* 水面の波紋エフェクト - 最大2つに制限 */}
      {ripples.slice(0, 2).map(ripple => (
        <motion.div
          key={ripple.id}
          className="absolute pointer-events-none z-10 w-16 h-16 rounded-full border-2 border-blue-300 opacity-60"
          style={{
            left: `${ripple.x}%`,
            top: `${ripple.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      ))}

      <div className="relative z-20 p-8">
        {/* ヘッダー部分 - 分離されたコンポーネント */}
        <PlantCardHeader plant={plant} />

        {/* 状態に応じた情報表示 */}
        {nextAction.urgency === 'urgent' || nextAction.urgency === 'needed' ? (
          <div
            className={`mb-6 p-4 rounded-2xl border-2 ${
              nextAction.urgency === 'urgent' 
                ? 'border-red-400 bg-red-50' 
                : 'border-yellow-400 bg-yellow-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{nextAction.icon}</span>
                <div>
                  <p className={`font-bold text-base ${
                    nextAction.urgency === 'urgent' ? 'text-red-800' : 'text-yellow-800'
                  }`}>
                    {nextAction.text}が必要！
                  </p>
                  <p className="text-sm text-gray-600">
                    {nextAction.description}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        ) : (
          <div className="mb-6 p-4 rounded-2xl bg-white/60 border border-white/50">
            <p className="text-sm text-gray-700 text-center">
              「{emotionalState.message}」
            </p>
          </div>
        )}

        {/* 健康指標 - 分離されたコンポーネント */}
        <PlantCardMetrics plant={plant} />
      </div>

      {/* ホバーエフェクト */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none bg-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.div>
  )
}, (prevProps, nextProps) => {
  // カスタム比較関数でより細かい最適化
  return (
    prevProps.plant.id === nextProps.plant.id &&
    prevProps.plant.health === nextProps.plant.health &&
    prevProps.plant.loveLevel === nextProps.plant.loveLevel &&
    prevProps.plant.growthStage === nextProps.plant.growthStage &&
    prevProps.onClick === nextProps.onClick
  )
})

export default PlantCard
