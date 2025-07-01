import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useAnimation, PanInfo } from 'framer-motion'
import { X, Sun, Sparkles } from 'lucide-react'
import { Plant } from '@/types/plant'
import { usePlantStore } from '@/stores/plantStore'
import { useSoundEffects } from '@/hooks/useSoundEffects'
import { useToast } from '@/hooks/useToast'
import { t } from '@/utils/i18n'
import PlantArtDisplay from './PlantArtDisplay'

interface SunlightModalProps {
  plant: Plant
  onClose: () => void
  onSunlightComplete: () => void
}

interface SunRay {
  id: number
  x: number
  y: number
  delay: number
  intensity: number
}

interface Sparkle {
  id: number
  x: number
  y: number
  delay: number
  scale: number
}

const SunlightModal: React.FC<SunlightModalProps> = ({ 
  plant, 
  onClose, 
  onSunlightComplete 
}) => {
  const { giveSunExposure, language } = usePlantStore()
  const { playSunlightSound, playUISound } = useSoundEffects()
  const { show: showToast } = useToast()
  
  // アニメーション状態
  const [isDragging, setIsDragging] = useState(false)
  const [isCharging, setIsCharging] = useState(false)
  const [chargeProgress, setChargeProgress] = useState(0)
  const [sunRays, setSunRays] = useState<SunRay[]>([])
  const [sparkles, setSparkles] = useState<Sparkle[]>([])
  const [plantReaction, setPlantReaction] = useState<'happy' | 'energized' | 'glowing' | null>(null)
  const [interactionMode, setInteractionMode] = useState<'drag' | 'charge' | 'completed'>('drag')
  
  // 位置状態
  const [plantPosition, setPlantPosition] = useState({ x: 0, y: 150 })
  const [sunPosition] = useState({ x: 0, y: -100 })
  
  // Refs
  const modalRef = useRef<HTMLDivElement>(null)
  const plantRef = useRef<HTMLDivElement>(null)
  const sparkleTimerRef = useRef<NodeJS.Timeout>()
  
  // アニメーションコントロール
  const sunControls = useAnimation()
  const plantControls = useAnimation()

  // 初期アニメーション
  useEffect(() => {
    // 太陽の輝きアニメーション
    sunControls.start({
      scale: [1, 1.2, 1],
      rotate: [0, 180, 360],
      filter: [
        'brightness(1) drop-shadow(0 0 20px rgba(255, 215, 0, 0.6))',
        'brightness(1.3) drop-shadow(0 0 30px rgba(255, 215, 0, 0.8))',
        'brightness(1) drop-shadow(0 0 20px rgba(255, 215, 0, 0.6))'
      ]
    }, {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    })

    // 背景の微細な色調変化
          // backgroundControls.start() - この機能は現在は不要なので無効化
  }, [sunControls])

  // ドラッグハンドリング
  const handleDrag = useCallback((_: any, info: PanInfo) => {
    const newX = plantPosition.x + info.delta.x
    const newY = plantPosition.y + info.delta.y
    
    // 境界制限
    const maxX = 100
    const maxY = 200
    const minX = -100
    const minY = -150
    
    const clampedX = Math.max(minX, Math.min(maxX, newX))
    const clampedY = Math.max(minY, Math.min(maxY, newY))
    
    setPlantPosition({ x: clampedX, y: clampedY })
    
    // 太陽との距離を計算
    const distance = Math.sqrt(
      Math.pow(clampedX - sunPosition.x, 2) + 
      Math.pow(clampedY - sunPosition.y, 2)
    )
    
    // 太陽の近くでエフェクト発動
    if (distance < 80 && !isCharging) {
      setIsCharging(true)
      setInteractionMode('charge')
      playSunlightSound()
      startChargingEffect()
    } else if (distance >= 80 && isCharging) {
      setIsCharging(false)
      setInteractionMode('drag')
      stopChargingEffect()
    }
  }, [plantPosition, sunPosition, isCharging, playSunlightSound])

  // チャージエフェクト開始
  const startChargingEffect = useCallback(() => {
    setChargeProgress(0)
    
    // プログレス更新
    const progressInterval = setInterval(() => {
      setChargeProgress(prev => {
        const newProgress = prev + 2
        if (newProgress >= 100) {
          clearInterval(progressInterval)
          completeSunlight()
          return 100
        }
        return newProgress
      })
    }, 50)
    
    // 太陽光線エフェクト
    const createSunRays = () => {
      const rays: SunRay[] = []
      for (let i = 0; i < 12; i++) {
        rays.push({
          id: Date.now() + i,
          x: Math.cos((i * 30) * Math.PI / 180) * 60,
          y: Math.sin((i * 30) * Math.PI / 180) * 60,
          delay: i * 0.1,
          intensity: Math.random() * 0.5 + 0.5
        })
      }
      setSunRays(rays)
    }
    
    createSunRays()
    const rayInterval = setInterval(createSunRays, 1000)
    
    // キラキラエフェクト
    const createSparkles = () => {
      const newSparkles: Sparkle[] = []
      for (let i = 0; i < 8; i++) {
        newSparkles.push({
          id: Date.now() + i,
          x: (Math.random() - 0.5) * 200,
          y: (Math.random() - 0.5) * 200,
          delay: Math.random() * 0.5,
          scale: Math.random() * 0.5 + 0.5
        })
      }
      setSparkles(prev => [...prev, ...newSparkles])
      
      // 古いキラキラを削除
      setTimeout(() => {
        setSparkles(prev => prev.filter(s => 
          !newSparkles.some(ns => ns.id === s.id)
        ))
      }, 2000)
    }
    
    sparkleTimerRef.current = setInterval(createSparkles, 300)
    
    // 植物のリアクション
    setPlantReaction('happy')
    setTimeout(() => setPlantReaction('energized'), 1000)
    setTimeout(() => setPlantReaction('glowing'), 2000)
  }, [])

  // チャージエフェクト停止
  const stopChargingEffect = useCallback(() => {
    setChargeProgress(0)
    setSunRays([])
    setSparkles([])
    setPlantReaction(null)
    
    if (sparkleTimerRef.current) {
      clearInterval(sparkleTimerRef.current)
    }
  }, [])

  // 日光浴完了
  const completeSunlight = useCallback(async () => {
    setInteractionMode('completed')
    playUISound('success')
    
    // 壮大な完了エフェクト
    plantControls.start({
      scale: [1, 1.3, 1.1],
      rotate: [0, 10, -5, 0],
      filter: [
        'brightness(1)',
        'brightness(1.5) drop-shadow(0 0 30px rgba(34, 197, 94, 0.8))',
        'brightness(1.2) drop-shadow(0 0 20px rgba(34, 197, 94, 0.6))'
      ]
    }, { duration: 2 })
    
    // 大量のキラキラ
    const celebrationSparkles: Sparkle[] = []
    for (let i = 0; i < 20; i++) {
      celebrationSparkles.push({
        id: Date.now() + i + 1000,
        x: (Math.random() - 0.5) * 300,
        y: (Math.random() - 0.5) * 300,
        delay: Math.random() * 1,
        scale: Math.random() * 1 + 0.5
      })
    }
    setSparkles(celebrationSparkles)
    
    // データ更新
    giveSunExposure(plant.id)
    
    // 成功メッセージ
    showToast({
      message: language === 'ja' ? '☀️ 日光浴完了！元気になりました！' : '☀️ Sunbath completed! Plant is energized!',
      emoji: '☀️'
    })
    
    // 3秒後に自動クローズ
    setTimeout(() => {
      onSunlightComplete()
      onClose()
    }, 3000)
  }, [plant.id, giveSunExposure, language, showToast, onSunlightComplete, onClose, playUISound, plantControls])

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (sparkleTimerRef.current) clearInterval(sparkleTimerRef.current)
    }
  }, [])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        ref={modalRef}
        className="relative w-[500px] h-[450px] rounded-3xl shadow-2xl overflow-hidden"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: 1, 
          opacity: 1
        }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 25%, #fbbf24 50%, #f59e0b 75%, #d97706 100%)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)'
        }}
      >
        {/* クローズボタン */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white transition-all"
        >
          <X size={20} className="text-gray-600" />
        </button>

        {/* タイトルとインストラクション */}
        <div className="absolute top-4 left-4 z-10">
          <h3 className="text-lg font-bold text-gray-800">
            🌞 {language === 'ja' ? '日光浴' : 'Sunbath'} - {plant.name}
          </h3>
          <p className="text-sm text-gray-700">
            {interactionMode === 'drag' && (language === 'ja' ? '植物を太陽にドラッグしてね！' : 'Drag the plant to the sun!')}
            {interactionMode === 'charge' && (language === 'ja' ? 'エネルギー充電中...' : 'Charging energy...')}
            {interactionMode === 'completed' && (language === 'ja' ? '日光浴完了！' : 'Sunbath completed!')}
          </p>
        </div>

        {/* 太陽 */}
        <motion.div
          className="absolute top-16 left-1/2 transform -translate-x-1/2"
          animate={sunControls}
          style={{
            filter: 'brightness(1.2) drop-shadow(0 0 25px rgba(255, 215, 0, 0.7))'
          }}
        >
          <Sun size={80} className="text-yellow-400" />
        </motion.div>

        {/* 太陽光線 */}
        <AnimatePresence>
          {sunRays.map((ray) => (
            <motion.div
              key={ray.id}
              className="absolute top-16 left-1/2 origin-center"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: ray.intensity,
                scale: [0, 1.5, 0],
                rotate: 360
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 1.5, 
                delay: ray.delay,
                ease: "easeOut"
              }}
              style={{
                transform: `translate(-50%, -50%) translate(${ray.x}px, ${ray.y}px)`
              }}
            >
              <div 
                className="w-1 h-12 bg-yellow-300 rounded-full"
                style={{
                  boxShadow: '0 0 10px rgba(255, 215, 0, 0.6)',
                  filter: `brightness(${ray.intensity + 0.5})`
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* キラキラエフェクト */}
        <AnimatePresence>
          {sparkles.map((sparkle) => (
            <motion.div
              key={sparkle.id}
              className="absolute top-1/2 left-1/2 pointer-events-none"
              initial={{ 
                opacity: 0, 
                scale: 0,
                x: sparkle.x,
                y: sparkle.y
              }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0, sparkle.scale, 0],
                rotate: [0, 180, 360],
                y: sparkle.y - 50
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 2, 
                delay: sparkle.delay,
                ease: "easeOut"
              }}
            >
              <Sparkles size={16} className="text-yellow-300" />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* ドラッグ可能な植物 */}
        <motion.div
          ref={plantRef}
          className="absolute top-1/2 left-1/2 cursor-move"
          drag
          dragConstraints={{
            top: -150,
            bottom: 200,
            left: -100,
            right: 100
          }}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          onDrag={handleDrag}
          animate={{
            x: plantPosition.x,
            y: plantPosition.y,
            scale: isDragging ? 1.1 : 1
          }}
          whileHover={{ scale: 1.05 }}
          whileDrag={{ scale: 1.15, cursor: "grabbing" }}
          style={{
            filter: plantReaction === 'glowing' 
              ? 'brightness(1.3) drop-shadow(0 0 20px rgba(34, 197, 94, 0.7))'
              : 'brightness(1)',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <PlantArtDisplay 
            plant={plant} 
            size="large"
            className="select-none"
          />
          
          {/* 植物の感情表示 */}
          <motion.div 
            className="text-center text-3xl mt-2"
            animate={
              plantReaction === 'happy' ? { scale: [1, 1.3, 1], y: [0, -10, 0] } :
              plantReaction === 'energized' ? { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] } :
              plantReaction === 'glowing' ? { scale: [1, 1.1, 1], opacity: [1, 0.8, 1] } : {}
            }
            transition={{ duration: 0.8, repeat: Infinity }}
          >
            {plantReaction === 'happy' && '😊'}
            {plantReaction === 'energized' && '🤩'}
            {plantReaction === 'glowing' && '✨'}
            {!plantReaction && (
              plant.health < 70 ? '😴' : '🙂'
            )}
          </motion.div>
        </motion.div>

        {/* チャージ進捗バー */}
        {isCharging && (
          <motion.div
            className="absolute bottom-20 left-4 right-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="bg-white/30 rounded-full h-4 backdrop-blur-sm border border-white/50">
              <motion.div
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
                style={{ width: `${chargeProgress}%` }}
                animate={{
                  boxShadow: [
                    '0 0 10px rgba(255, 215, 0, 0.5)',
                    '0 0 20px rgba(255, 215, 0, 0.8)',
                    '0 0 10px rgba(255, 215, 0, 0.5)'
                  ]
                }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </div>
            <p className="text-center text-sm text-gray-700 mt-2 font-medium">
              ☀️ {language === 'ja' ? 'エネルギー充電中' : 'Charging energy'}... {chargeProgress}%
            </p>
          </motion.div>
        )}

        {/* ドラッグガイド（初期状態のみ） */}
        {interactionMode === 'drag' && !isDragging && (
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{ 
              y: [0, -10, 0],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
              <span className="text-2xl">👆</span>
              <span className="text-sm text-gray-700 font-medium">
                {language === 'ja' ? '植物を太陽にドラッグしてね！' : 'Drag the plant to the sun!'}
              </span>
            </div>
          </motion.div>
        )}

        {/* 完了メッセージ */}
        {interactionMode === 'completed' && (
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="bg-green-100/90 px-6 py-3 rounded-full backdrop-blur-sm border border-green-200">
              <span className="text-lg font-semibold text-green-800">
                🎉 {language === 'ja' ? '日光浴完了！元気になったよ！' : 'Sunbath completed! Plant is energized!'}
              </span>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default SunlightModal 