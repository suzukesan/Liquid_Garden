import React, { useState, useRef } from 'react'
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

const PlantCard: React.FC<PlantCardProps> = ({ plant, size = 'medium', onClick }) => {
  const { removePlant } = usePlantStore()
  const { playRippleSound, playUISound, playPlantHeartbeat } = useSoundEffects()
  const [isHovered, setIsHovered] = useState(false)
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])
  const cardRef = useRef<HTMLDivElement>(null)
  const rippleControls = useAnimation()
  
  const personality = generatePlantPersonality(plant)
  const colors = generatePlantColors(plant, personality)
  const modifiers = getPlantStateModifiers(plant, personality)

  // みどりちゃんの感情状態を計算
  const getEmotionalState = () => {
    if (plant.health > 80 && plant.loveLevel >= 4) {
      return {
        mood: '✨',
        feeling: 'きらきら',
        message: 'あなたの愛情に包まれて、今日もすくすくと育っています',
        glassIntensity: 0.8,
        pulseSpeed: 4,
        aura: 'radiant',
        breathingIntensity: 1.05
      }
    } else if (plant.health > 60 && plant.loveLevel >= 3) {
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
  }

  const emotionalState = getEmotionalState()

  // ケア必要性のサブリミナルな視覚ヒント
  const getCareHints = () => {
    const timeSinceWater = (Date.now() - plant.lastWatered.getTime()) / (24 * 60 * 60 * 1000)
    const timeSinceSun = (Date.now() - plant.lastSunExposure.getTime()) / (24 * 60 * 60 * 1000)
    const timeSinceTalk = (Date.now() - plant.lastTalk.getTime()) / (24 * 60 * 60 * 1000)

    return {
      needsWater: timeSinceWater > 1,
      urgentWater: timeSinceWater > 2,
      needsSun: timeSinceSun > 0.5,
      urgentSun: timeSinceSun > 1,
      needsLove: plant.loveLevel < 4,
      urgentLove: plant.loveLevel < 2,
      // 視覚的ヒント
      waterDroplets: timeSinceWater > 1.5,
      sunrays: timeSinceSun > 0.8,
      heartPulse: plant.loveLevel < 3
    }
  }

  const careHints = getCareHints()

  // 植物の個性的な名前表示
  const getPersonalizedName = () => {
    const variations = personality.nameVariations
    const dayIndex = Math.floor(Date.now() / (24 * 60 * 60 * 1000)) % variations.length
    return variations[dayIndex]
  }

  // 成長段階の詩的表現
  const getPoeticalGrowthStage = () => {
    switch (plant.growthStage) {
      case GrowthStage.SEED: return { emoji: '🌱', poetry: '小さな希望を宿した種' }
      case GrowthStage.SPROUT: return { emoji: '🌿', poetry: '命あふれる新芽' }
      case GrowthStage.SMALL_LEAVES: return { emoji: '🍃', poetry: '若葉色の歌声' }
      case GrowthStage.LARGE_LEAVES: return { emoji: '🌳', poetry: '深緑の豊かな歌声' }
      case GrowthStage.FLOWER: return { emoji: '🌸', poetry: '花ひらく生命の詩' }
      default: return { emoji: '🌱', poetry: '小さな希望を宿した種' }
    }
  }

  const growth = getPoeticalGrowthStage()

  const handleDelete = () => {
    removePlant(plant.id)
  }

  // 水面の波紋効果を生成
  const createRipple = (event: React.MouseEvent) => {
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
    }, 1000)
  }

  const handleClick = (event: React.MouseEvent) => {
    createRipple(event)
    playRippleSound() // 波紋音を再生
    if (onClick) {
      // 波紋効果の後に画面遷移
      setTimeout(() => {
        onClick()
      }, 300)
    }
  }

  // ホバー時の音響効果
  const handleHoverStart = () => {
    setIsHovered(true)
    playUISound('hover')
  }

  // 植物の鼓動を再生（愛情レベルが低い時）
  const handleHeartbeatTrigger = () => {
    if (plant.loveLevel < 3) {
      playPlantHeartbeat(plant.health, plant.loveLevel)
    }
  }

  // 液体ガラスのスタイル計算 - より大胆で印象的
  const getLiquidGlassStyle = () => {
    const healthRatio = plant.health / 100
    const loveRatio = plant.loveLevel / 5
    
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
      backdropFilter: `blur(${20 + healthRatio * 10}px) saturate(150%)`,
      borderRadius: '24px',
      border: `3px solid ${primaryColor}40`,
      boxShadow: `
        0 20px 60px rgba(0, 0, 0, 0.15),
        0 8px 32px ${primaryColor}30,
        inset 0 2px 16px rgba(255, 255, 255, 0.8),
        inset 0 -2px 16px rgba(0, 0, 0, 0.05),
        0 0 ${loveRatio * 40}px ${glowColor}40`
    }
  }

  // 次に必要なアクションを判定
  const getNextAction = () => {
    const timeSinceWater = (Date.now() - plant.lastWatered.getTime()) / (24 * 60 * 60 * 1000)
    const timeSinceSun = (Date.now() - plant.lastSunExposure.getTime()) / (24 * 60 * 60 * 1000)
    const needsLove = plant.loveLevel < 3

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
        urgency: plant.loveLevel < 2 ? 'urgent' : 'needed',
        description: plant.loveLevel < 2 ? 'とても寂しそう' : '話を聞いて欲しそう'
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
  }

  const nextAction = getNextAction()

  return (
    <motion.div
      ref={cardRef}
      className="relative overflow-hidden cursor-pointer group"
      style={getLiquidGlassStyle()}
      whileHover={{ 
        scale: 1.03, 
        y: -12,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      whileTap={{ scale: 0.97 }}
      onClick={handleClick}
      onHoverStart={handleHoverStart}
      onHoverEnd={() => setIsHovered(false)}
      animate={{
        scale: [1, 1.005, 1],
      }}
      transition={{ 
        duration: 4 + personality.shyness,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {/* 緊急度インジケーター - 統一された表現 */}
      {nextAction.urgency === 'urgent' && (
        <motion.div
          className="absolute top-4 right-4 w-5 h-5 bg-red-500 rounded-full z-20 shadow-lg"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.8, 1, 0.8],
            boxShadow: [
              '0 0 0 0 rgba(239, 68, 68, 0.7)',
              '0 0 0 8px rgba(239, 68, 68, 0)',
              '0 0 0 0 rgba(239, 68, 68, 0)'
            ]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {/* 水面の波紋エフェクト - より印象的 */}
      {ripples.map(ripple => (
        <motion.div
          key={ripple.id}
          className="absolute pointer-events-none z-10"
          style={{
            left: `${ripple.x}%`,
            top: `${ripple.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
          initial={{ scale: 0, opacity: 0.9 }}
          animate={{ 
            scale: [0, 4, 6],
            opacity: [0.9, 0.6, 0]
          }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <div
            className="w-24 h-24 rounded-full border-3"
            style={{
              borderColor: `${colors.primary}60`,
              background: `radial-gradient(circle, ${colors.glow}30 0%, transparent 70%)`,
              boxShadow: `0 0 20px ${colors.glow}40`
            }}
          />
        </motion.div>
      ))}

      {/* 流れる光の粒子 - より豪華 */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full pointer-events-none"
          style={{
            background: `linear-gradient(45deg, ${colors.glow}, ${colors.primary})`,
            boxShadow: `0 0 8px ${colors.glow}80`
          }}
          animate={{
            x: [-30, window.innerWidth + 30],
            y: [
              Math.random() * 300,
              Math.random() * 300 + 50,
              Math.random() * 300
            ],
            opacity: [0, 0.9, 0],
            scale: [0.5, 1.2, 0.5]
          }}
          transition={{
            duration: 10 + i * 2,
            repeat: Infinity,
            delay: i * 1.5,
            ease: "linear"
          }}
        />
      ))}

      <div className="relative z-20 p-8">
        {/* ヘッダー部分 - より印象的な階層 */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <motion.h3 
              className="text-2xl font-bold mb-2"
              style={{
                background: `linear-gradient(135deg, #1f2937 0%, #374151 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
              animate={{
                scale: [1, 1.02, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {getPersonalizedName()}
            </motion.h3>
            
            <motion.p 
              className="text-base text-gray-700 leading-relaxed font-medium"
              animate={{
                opacity: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {getPoeticalGrowthStage().poetry}
            </motion.p>
          </div>
          
          {/* 植物の感情表現 - より大きく印象的 */}
          <motion.div
            className="text-5xl ml-6"
            animate={{
              scale: [1, 1.15, 1],
              rotate: [0, 8, -8, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
            }}
          >
            {getPoeticalGrowthStage().emoji}
          </motion.div>
        </div>

        {/* 状態に応じた情報表示 - より目立つデザイン */}
        {nextAction.urgency === 'urgent' || nextAction.urgency === 'needed' ? (
          <motion.div
            className={`mb-8 p-6 rounded-3xl border-3 ${
              nextAction.urgency === 'urgent' 
                ? 'border-red-400 bg-red-50' 
                : 'border-yellow-400 bg-yellow-50'
            }`}
            style={{
              boxShadow: nextAction.urgency === 'urgent' 
                ? '0 8px 32px rgba(239, 68, 68, 0.2), inset 0 1px 0 rgba(255,255,255,0.8)' 
                : '0 8px 32px rgba(245, 158, 11, 0.2), inset 0 1px 0 rgba(255,255,255,0.8)'
            }}
            animate={nextAction.urgency === 'urgent' ? {
              borderColor: ['rgba(248, 113, 113, 0.6)', 'rgba(239, 68, 68, 0.8)', 'rgba(248, 113, 113, 0.6)'],
              boxShadow: [
                '0 8px 32px rgba(239, 68, 68, 0.2)',
                '0 12px 40px rgba(239, 68, 68, 0.3)',
                '0 8px 32px rgba(239, 68, 68, 0.2)'
              ]
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <motion.span 
                  className="text-4xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {nextAction.icon}
                </motion.span>
                <div>
                  <p className={`font-bold text-lg ${
                    nextAction.urgency === 'urgent' ? 'text-red-800' : 'text-yellow-800'
                  }`}>
                    {nextAction.text}が必要！
                  </p>
                  <p className="text-sm text-gray-700 font-medium">
                    {nextAction.description}
                  </p>
                </div>
              </div>
              <motion.div
                className="text-gray-600"
                animate={{
                  x: [0, 6, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <ChevronRight className="w-6 h-6" />
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            className="mb-8 p-6 rounded-3xl"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.6) 100%)',
              backdropFilter: 'blur(12px)',
              border: '2px solid rgba(255,255,255,0.5)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8)'
            }}
            animate={{
              opacity: [0.9, 1, 0.9]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <p className="text-base text-gray-800 italic text-center leading-relaxed font-medium">
              「{emotionalState.message}」
            </p>
          </motion.div>
        )}

        {/* 統合された健康指標 - より魅力的なデザイン */}
        <div className="space-y-6">
          {/* 元気ゲージ */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-gray-800">元気</span>
              <motion.span 
                className={`text-base font-black ${
                  plant.health >= 80 ? 'text-green-600' :
                  plant.health >= 60 ? 'text-yellow-600' :
                  plant.health >= 40 ? 'text-orange-600' :
                  'text-red-600'
                }`}
                animate={{
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {plant.health}%
              </motion.span>
            </div>
            
            <div className="relative">
              <div 
                className="h-4 rounded-full overflow-hidden"
                style={{
                  background: 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(8px)',
                  border: '2px solid rgba(255,255,255,0.8)',
                  boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                <motion.div
                  className="h-full rounded-full relative overflow-hidden"
                  style={{
                    background: plant.health >= 80 
                      ? 'linear-gradient(90deg, #10b981, #34d399, #6ee7b7)' 
                      : plant.health >= 60
                      ? 'linear-gradient(90deg, #f59e0b, #fbbf24, #fcd34d)'
                      : plant.health >= 40
                      ? 'linear-gradient(90deg, #f97316, #fb923c, #fdba74)'
                      : 'linear-gradient(90deg, #ef4444, #f87171, #fca5a5)',
                    boxShadow: `0 0 20px ${
                      plant.health >= 80 ? '#10b98140' :
                      plant.health >= 60 ? '#f59e0b40' :
                      plant.health >= 40 ? '#f9731640' : '#ef444440'
                    }`
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${plant.health}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                >
                  {/* ゲージ内のキラキラエフェクト */}
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)'
                    }}
                    animate={{
                      x: ['-100%', '200%']
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                </motion.div>
              </div>
            </div>
          </div>

          {/* 愛情度 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-gray-800">愛情度</span>
              <motion.span 
                className="text-base font-black text-pink-600"
                animate={{
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {plant.loveLevel}/5
              </motion.span>
            </div>
            
            <div className="flex items-center justify-center space-x-2">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: i < plant.loveLevel ? [1, 1.3, 1] : [1],
                    opacity: i < plant.loveLevel ? [0.9, 1, 0.9] : [0.3],
                    y: i < plant.loveLevel ? [0, -2, 0] : [0]
                  }}
                  transition={{
                    duration: 1.8 + i * 0.2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{
                    filter: i < plant.loveLevel ? 'drop-shadow(0 2px 4px rgba(236, 72, 153, 0.3))' : 'none'
                  }}
                >
                  <Heart 
                    className={`w-6 h-6 ${
                      i < plant.loveLevel ? 'text-pink-500 fill-pink-500' : 'text-gray-300'
                    }`} 
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 植物の生命力を表すオーラエフェクト - 健康状態で変化 */}
      <motion.div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, 
            ${colors.glow}${Math.round((plant.loveLevel + plant.health/20) * 10).toString(16)} 0%, 
            transparent 70%)`,
          filter: `blur(${plant.loveLevel * 4 + (plant.health/25)}px)`,
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2 + plant.health/500, 0.5 + plant.health/200, 0.2 + plant.health/500],
        }}
        transition={{
          duration: emotionalState.pulseSpeed + 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* 緊急ケア必要時の微細な警告オーラ */}
      {(careHints.urgentWater || careHints.urgentSun || careHints.urgentLove) && (
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 50%, 
              rgba(255, 182, 193, 0.1) 0%, 
              transparent 60%)`,
          }}
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {/* ホバー時の液体波紋エフェクト */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 50%, 
              rgba(255, 255, 255, 0.2) 0%, 
              transparent 60%)`,
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.2, opacity: [0, 0.5, 0] }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      )}
    </motion.div>
  )
}

export default PlantCard
