import React, { useState, useRef, useMemo, useCallback } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { usePlantStore } from '@/stores/plantStore'
import { Plant, PlantType, GrowthStage } from '@/types/plant'
import { generatePlantPersonality, generatePlantColors, getPlantStateModifiers } from '@/utils/plantPersonality'
import { useSoundEffects } from '@/hooks/useSoundEffects'
import PlantActions from './PlantActions'
import { ChevronRight, Heart } from 'lucide-react'

interface PlantCardProps {
  plant: Plant
  size?: 'small' | 'medium' | 'large' | 'featured'
  onClick?: () => void
}

const PlantCard: React.FC<PlantCardProps> = React.memo(({ plant, size = 'medium', onClick }) => {
  const { removePlant } = usePlantStore()
  const { playRippleSound, playUISound, playPlantHeartbeat } = useSoundEffects()
  const [isHovered, setIsHovered] = useState(false)
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])
  const cardRef = useRef<HTMLDivElement>(null)
  const rippleControls = useAnimation()
  
  // メモ化された計算値
  const personality = useMemo(() => generatePlantPersonality(plant), [plant.id, plant.type])
  const colors = useMemo(() => generatePlantColors(plant, personality), [plant.id, plant.health, plant.loveLevel, personality])
  const modifiers = useMemo(() => getPlantStateModifiers(plant, personality), [plant.health, plant.loveLevel, personality])

  // みどりちゃんの感情状態を計算 - メモ化
  const emotionalState = useMemo(() => {
    if (plant.health > 80 && plant.loveLevel >= 80) {
      return {
        mood: '✨',
        feeling: 'きらきら',
        message: 'あなたの愛情に包まれて、今日もすくすくと育っています',
        glassIntensity: 0.8,
        pulseSpeed: 4,
        aura: 'radiant',
        breathingIntensity: 1.05
      }
    } else if (plant.health > 60 && plant.loveLevel >= 60) {
      return {
        mood: '🌱',
        feeling: 'うきうき',
        message: '心地よい日差しを感じています。ありがとう',
        glassIntensity: 0.6,
        pulseSpeed: 3,
        aura: 'peaceful',
        breathingIntensity: 1.03
      }
    } else if (plant.health > 40) {
      return {
        mood: '😥',
        feeling: 'ちょっと心配',
        message: 'もう少し優しさをください...',
        glassIntensity: 0.4,
        pulseSpeed: 2,
        aura: 'gentle',
        breathingIntensity: 1.02
      }
    } else if (plant.health > 20) {
      return {
        mood: '😌',
        feeling: 'しんみり',
        message: 'そばにいてくれるだけで嬉しいです',
        glassIntensity: 0.3,
        pulseSpeed: 1.5,
        aura: 'fragile',
        breathingIntensity: 1.01
      }
    } else {
      return {
        mood: '💤',
        feeling: 'おやすみ',
        message: '静かに回復の時を待っています',
        glassIntensity: 0.2,
        pulseSpeed: 1,
        aura: 'resting',
        breathingIntensity: 1.005
      }
    }
  }, [plant.health, plant.loveLevel])

  // ケア必要性のサブリミナルな視覚ヒント - メモ化
  const careHints = useMemo(() => {
    const timeSinceWater = (Date.now() - plant.lastWatered.getTime()) / (24 * 60 * 60 * 1000)
    const timeSinceSun = (Date.now() - plant.lastSunExposure.getTime()) / (24 * 60 * 60 * 1000)
    const timeSinceTalk = (Date.now() - plant.lastTalk.getTime()) / (24 * 60 * 60 * 1000)

    return {
      needsWater: timeSinceWater > 1,
      urgentWater: timeSinceWater > 2,
      needsSun: timeSinceSun > 0.5,
      urgentSun: timeSinceSun > 1,
      needsLove: plant.loveLevel < 40,
      urgentLove: plant.loveLevel < 20,
      // 視覚的ヒント
      waterDroplets: timeSinceWater > 1.5,
      sunrays: timeSinceSun > 0.8,
      heartPulse: plant.loveLevel < 30
    }
  }, [plant.lastWatered, plant.lastSunExposure, plant.lastTalk, plant.loveLevel])

  // 植物の個性的な名前表示 - メモ化
  const personalizedName = useMemo(() => {
    const variations = personality.nameVariations
    const dayIndex = Math.floor(Date.now() / (24 * 60 * 60 * 1000)) % variations.length
    return variations[dayIndex]
  }, [personality.nameVariations])

  // 成長段階の詩的表現 - メモ化
  const growth = useMemo(() => {
    switch (plant.growthStage) {
      case GrowthStage.SEED: return { emoji: '🌱', poetry: '小さな希望を宿した種' }
      case GrowthStage.SPROUT: return { emoji: '🌿', poetry: '命あふれる新芽' }
      case GrowthStage.SMALL_LEAVES: return { emoji: '🍃', poetry: '若葉色の歌声' }
      case GrowthStage.LARGE_LEAVES: return { emoji: '🌳', poetry: '深緑の豊かな歌声' }
      case GrowthStage.FLOWER: return { emoji: '🌸', poetry: '花ひらく生命の詩' }
      default: return { emoji: '🌱', poetry: '小さな希望を宿した種' }
    }
  }, [plant.growthStage])

  // コールバック関数をメモ化
  const handleDelete = useCallback(() => {
    removePlant(plant.id)
  }, [removePlant, plant.id])

  // 水面の波紋効果を生成 - メモ化
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
    }, 800) // 短縮
  }, [])

  const handleClick = useCallback((event: React.MouseEvent) => {
    createRipple(event)
    playRippleSound() // 波紋音を再生
    if (onClick) {
      // 波紋効果の後に画面遷移
      setTimeout(() => {
        onClick()
      }, 200) // 短縮
    }
  }, [createRipple, playRippleSound, onClick])

  // ホバー時の音響効果 - メモ化
  const handleHoverStart = useCallback(() => {
    setIsHovered(true)
    playUISound('hover')
  }, [playUISound])

  // 植物の鼓動を再生（愛情レベルが低い時） - メモ化
  const handleHeartbeatTrigger = useCallback(() => {
    if (plant.loveLevel < 30) {
      playPlantHeartbeat(plant.health, plant.loveLevel)
    }
  }, [plant.loveLevel, plant.health, playPlantHeartbeat])

  // 液体ガラスのスタイル計算 - メモ化して軽量化
  const liquidGlassStyle = useMemo(() => {
    const healthRatio = plant.health / 100
    const loveRatio = plant.loveLevel / 100
    
    // 健康度と愛情度に基づく色彩
    const primaryColor = healthRatio >= 0.8 ? '#10b981' : 
                        healthRatio >= 0.6 ? '#f59e0b' : 
                        healthRatio >= 0.4 ? '#f97316' : '#ef4444'
    
    const glowColor = loveRatio >= 0.8 ? '#ec4899' :
                     loveRatio >= 0.6 ? '#8b5cf6' :
                     loveRatio >= 0.4 ? '#06b6d4' : '#6b7280'
    
    return {
      background: `linear-gradient(135deg, 
        rgba(255, 255, 255, 0.9) 0%, 
        rgba(255, 255, 255, 0.7) 50%,
        rgba(255, 255, 255, 0.5) 100%)`,
      backdropFilter: `blur(${15 + healthRatio * 5}px) saturate(120%)`, // 軽量化
      borderRadius: '24px',
      border: `2px solid ${primaryColor}40`, // 軽量化
      boxShadow: `0 10px 30px rgba(0, 0, 0, 0.1), 0 4px 16px ${primaryColor}20` // 軽量化
    }
  }, [plant.health, plant.loveLevel])

  // 次に必要なアクションを判定 - メモ化
  const nextAction = useMemo(() => {
    const timeSinceWater = (Date.now() - plant.lastWatered.getTime()) / (24 * 60 * 60 * 1000)
    const timeSinceSun = (Date.now() - plant.lastSunExposure.getTime()) / (24 * 60 * 60 * 1000)
    const needsLove = plant.loveLevel < 30

    // 緊急度順でソート
    const urgentActions = []
    
    if (timeSinceWater > 2) {
      urgentActions.push({ 
        type: 'water', 
        icon: '💧', 
        text: '水やり', 
        urgency: 'urgent',
        description: 'のどがからからです'
      })
    }
    
    if (timeSinceSun > 1) {
      urgentActions.push({ 
        type: 'sun', 
        icon: '☀️', 
        text: '日光浴', 
        urgency: 'urgent',
        description: 'お日様が恋しそう'
      })
    }
    
    if (needsLove) {
      urgentActions.push({ 
        type: 'talk', 
        icon: '💕', 
        text: '話しかける', 
        urgency: plant.loveLevel < 20 ? 'urgent' : 'needed',
        description: plant.loveLevel < 20 ? 'とても寂しそう' : '話を聞いて欲しそう'
      })
    }

    // 緊急でない場合の通常アクション
    if (urgentActions.length === 0) {
      if (timeSinceWater > 0.5) {
        urgentActions.push({ 
          type: 'water', 
          icon: '💧', 
          text: '水やり', 
          urgency: 'normal',
          description: 'そろそろお水が欲しいかも'
        })
      } else if (timeSinceSun > 0.3) {
        urgentActions.push({ 
          type: 'sun', 
          icon: '☀️', 
          text: '日光浴', 
          urgency: 'normal',
          description: '光を浴びたそう'
        })
      } else {
        urgentActions.push({ 
          type: 'talk', 
          icon: '😊', 
          text: 'お世話', 
          urgency: 'normal',
          description: '元気に過ごしています'
        })
      }
    }

    return urgentActions[0] // 最も緊急なアクションを返す
  }, [plant.lastWatered, plant.lastSunExposure, plant.loveLevel])

  return (
    <motion.div
      ref={cardRef}
      className="relative overflow-hidden cursor-pointer group"
      style={liquidGlassStyle}
      whileHover={{ 
        scale: 1.02, // 軽量化
        y: -8, // 軽量化
        transition: { duration: 0.2, ease: "easeOut" } // 短縮
      }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      onHoverStart={handleHoverStart}
      onHoverEnd={() => setIsHovered(false)}
      // 呼吸アニメーションを軽量化
      animate={{
        scale: [1, 1.003, 1], // 軽量化
      }}
      transition={{ 
        duration: 6, // 長めに設定してGPU負荷軽減
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {/* 緊急度インジケーター - 軽量化 */}
      {nextAction.urgency === 'urgent' && (
        <div className="absolute top-4 right-4 w-4 h-4 bg-red-500 rounded-full z-20 shadow-md" />
      )}

      {/* 水面の波紋エフェクト - 軽量化 */}
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
        {/* ヘッダー部分 - より印象的な階層 */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2 text-gray-800">
              {personalizedName}
            </h3>
            
            <p className="text-base text-gray-700 leading-relaxed font-medium">
              {growth.poetry}
            </p>
          </div>
          
          {/* 植物の感情表現 - 軽量化 */}
          <div className="text-4xl ml-6">
            {growth.emoji}
          </div>
        </div>

        {/* 状態に応じた情報表示 - 軽量化 */}
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

        {/* 統合された健康指標 - より魅力的なデザイン */}
        <div className="space-y-6">
          {/* 元気ゲージ */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-800">元気</span>
              <span className={`text-sm font-bold ${
                plant.health >= 80 ? 'text-green-600' :
                plant.health >= 60 ? 'text-yellow-600' :
                plant.health >= 40 ? 'text-orange-600' :
                'text-red-600'
              }`}>
                {plant.health}%
              </span>
            </div>
            
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${plant.health}%`,
                  background: plant.health >= 80 
                    ? '#10b981' 
                    : plant.health >= 60
                    ? '#f59e0b'
                    : plant.health >= 40
                    ? '#f97316'
                    : '#ef4444'
                }}
              />
            </div>
          </div>

          {/* 愛情度 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-800">愛情度</span>
              <span className="text-sm font-bold text-pink-600">
                {Math.round(plant.loveLevel)}%
              </span>
            </div>
            
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 bg-pink-500"
                style={{
                  width: `${plant.loveLevel}%`
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 簡素化されたホバーエフェクト */}
      {isHovered && (
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none bg-white/10"
        />
      )}
    </motion.div>
  )
})

export default PlantCard
