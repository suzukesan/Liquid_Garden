import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { X, Heart } from 'lucide-react'
import { Plant } from '@/types/plant'
import { usePlantStore } from '@/stores/plantStore'
import { useSoundEffects } from '@/hooks/useSoundEffects'
import { useToast } from '@/hooks/useToast'
import PlantArtDisplay from './PlantArtDisplay'

interface LoveModalProps {
  plant: Plant
  onClose: () => void
  onLoveComplete: () => void
}

interface FloatingHeart {
  id: number
  x: number
  y: number
  size: number
  delay: number
  color: string
}

interface TouchRipple {
  id: number
  x: number
  y: number
  scale: number
}

const LoveModal: React.FC<LoveModalProps> = ({ 
  plant, 
  onClose, 
  onLoveComplete 
}) => {
  const { talkToPlant, language } = usePlantStore()
  const { playLoveSound, playUISound } = useSoundEffects()
  const { show: showToast } = useToast()
  
  // インタラクション状態
  const [isPressed, setIsPressed] = useState(false)
  const [loveProgress, setLoveProgress] = useState(0)
  const [touchCount, setTouchCount] = useState(0)
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([])
  const [touchRipples, setTouchRipples] = useState<TouchRipple[]>([])
  const [plantEmotion, setPlantEmotion] = useState<'shy' | 'happy' | 'loved' | 'glowing' | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  
  // Refs
  const modalRef = useRef<HTMLDivElement>(null)
  const plantRef = useRef<HTMLDivElement>(null)
  const pressTimerRef = useRef<NodeJS.Timeout>()
  const heartTimerRef = useRef<NodeJS.Timeout>()
  
  // アニメーションコントロール
  const plantControls = useAnimation()

  // 初期アニメーション設定は不要（静的背景を使用）

  // 長押し開始
  const handlePressStart = useCallback((event: React.PointerEvent) => {
    if (isCompleted) return
    
    setIsPressed(true)
    setLoveProgress(0)
    
    // タッチ位置にリップルエフェクト
    const rect = modalRef.current?.getBoundingClientRect()
    if (rect) {
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      
      const newRipple: TouchRipple = {
        id: Date.now(),
        x,
        y,
        scale: 0
      }
      setTouchRipples(prev => [...prev, newRipple])
      
      // リップルを削除
      setTimeout(() => {
        setTouchRipples(prev => prev.filter(r => r.id !== newRipple.id))
      }, 1000)
    }
    
    // 愛情進捗開始
    pressTimerRef.current = setInterval(() => {
      setLoveProgress(prev => {
        const newProgress = prev + 2
        if (newProgress >= 100) {
          completeLove()
          return 100
        }
        return newProgress
      })
    }, 30)
    
    // ハートエフェクト開始
    createHeartEffect()
    heartTimerRef.current = setInterval(createHeartEffect, 200)
    
    // 植物の反応
    setPlantEmotion('shy')
    setTimeout(() => setPlantEmotion('happy'), 500)
    setTimeout(() => setPlantEmotion('loved'), 1500)
    
    // 軽やかな音
    playUISound('gentle')
  }, [isCompleted])

  // 長押し終了
  const handlePressEnd = useCallback(() => {
    setIsPressed(false)
    
    if (pressTimerRef.current) {
      clearInterval(pressTimerRef.current)
    }
    if (heartTimerRef.current) {
      clearInterval(heartTimerRef.current)
    }
    
    // 愛情が不完全だったらリセット
    if (loveProgress < 100) {
      setLoveProgress(0)
      setPlantEmotion(null)
      setFloatingHearts([])
    }
  }, [loveProgress])

  // ハートエフェクト生成
  const createHeartEffect = useCallback(() => {
    if (!plantRef.current) return
    
    const hearts: FloatingHeart[] = []
    const heartColors = ['#ff69b4', '#ff1493', '#dc143c', '#ff6347', '#ffa500']
    
    for (let i = 0; i < 3; i++) {
      hearts.push({
        id: Date.now() + i,
        x: (Math.random() - 0.5) * 100,
        y: 0,
        size: Math.random() * 20 + 15,
        delay: i * 0.1,
        color: heartColors[Math.floor(Math.random() * heartColors.length)]
      })
    }
    
    setFloatingHearts(prev => [...prev, ...hearts])
    
    // 古いハートを削除
    setTimeout(() => {
      setFloatingHearts(prev => prev.filter(h => 
        !hearts.some(nh => nh.id === h.id)
      ))
    }, 3000)
  }, [])

  // 愛情完了
  const completeLove = useCallback(async () => {
    setIsCompleted(true)
    setPlantEmotion('glowing')
    
    if (pressTimerRef.current) clearInterval(pressTimerRef.current)
    if (heartTimerRef.current) clearInterval(heartTimerRef.current)
    
    // 壮大な愛情エフェクト
    playLoveSound()
    
    plantControls.start({
      scale: [1, 1.2, 1.1],
      rotate: [0, 5, -5, 0],
      filter: [
        'brightness(1)',
        'brightness(1.4) drop-shadow(0 0 30px rgba(255, 105, 180, 0.8))',
        'brightness(1.2) drop-shadow(0 0 20px rgba(255, 105, 180, 0.6))'
      ]
    }, { duration: 2 })
    
    // 大量のハート
    const celebrationHearts: FloatingHeart[] = []
    const heartColors = ['#ff69b4', '#ff1493', '#dc143c', '#ff6347', '#ffa500', '#ffb6c1']
    
    for (let i = 0; i < 15; i++) {
      celebrationHearts.push({
        id: Date.now() + i + 1000,
        x: (Math.random() - 0.5) * 300,
        y: Math.random() * 200,
        size: Math.random() * 30 + 20,
        delay: Math.random() * 1,
        color: heartColors[Math.floor(Math.random() * heartColors.length)]
      })
    }
    setFloatingHearts(celebrationHearts)
    
    // データ更新
    talkToPlant(plant.id)
    
    // タッチ回数増加
    setTouchCount(prev => prev + 1)
    
    // 成功メッセージ
    showToast({
      message: language === 'ja' 
        ? `💕 ${plant.name}があなたの愛情を感じています！` 
        : `💕 ${plant.name} feels your love!`,
      emoji: '💕'
    })
    
    // 3秒後に自動クローズ
    setTimeout(() => {
      onLoveComplete()
      onClose()
    }, 3000)
  }, [plant.id, plant.name, talkToPlant, language, showToast, onLoveComplete, onClose, playLoveSound, plantControls])

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (pressTimerRef.current) clearInterval(pressTimerRef.current)
      if (heartTimerRef.current) clearInterval(heartTimerRef.current)
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
          background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 25%, #f8bbd9 50%, #f472b6 75%, #ec4899 100%)',
          boxShadow: '0 25px 50px rgba(236, 72, 153, 0.3)'
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
            💕 {language === 'ja' ? '愛情表現' : 'Show Love'} - {plant.name}
          </h3>
          <p className="text-sm text-gray-700">
            {!isCompleted && (language === 'ja' ? '植物を長押しして愛情を込めて' : 'Long press to show your love')}
            {isCompleted && (language === 'ja' ? '愛情が伝わりました！' : 'Love delivered!')}
          </p>
        </div>

        {/* 愛情表現の対象となる植物 */}
        <motion.div
          ref={plantRef}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
          onPointerDown={handlePressStart}
          onPointerUp={handlePressEnd}
          onPointerLeave={handlePressEnd}
          animate={{
            ...plantControls,
            scale: isPressed ? 1.05 : 1
          }}
          whileHover={{ scale: 1.02 }}
          style={{
            filter: plantEmotion === 'glowing' 
              ? 'brightness(1.3) drop-shadow(0 0 30px rgba(255, 105, 180, 0.8))'
              : isPressed
              ? 'brightness(1.1) drop-shadow(0 0 15px rgba(255, 105, 180, 0.5))'
              : 'brightness(1)',
            touchAction: 'none'
          }}
        >
          <PlantArtDisplay 
            plant={plant} 
            size="large"
            className="select-none"
          />
          
          {/* 植物の感情表示 */}
          <motion.div 
            className="text-center text-4xl mt-2"
            animate={
              plantEmotion === 'shy' ? { scale: [1, 0.9, 1], rotate: [0, -5, 5, 0] } :
              plantEmotion === 'happy' ? { scale: [1, 1.2, 1], y: [0, -5, 0] } :
              plantEmotion === 'loved' ? { scale: [1, 1.1, 1], opacity: [1, 0.8, 1] } :
              plantEmotion === 'glowing' ? { 
                scale: [1, 1.15, 1], 
                rotate: [0, 2, -2, 0],
                filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)']
              } : {}
            }
            transition={{ duration: 0.6, repeat: plantEmotion ? Infinity : 0 }}
          >
            {plantEmotion === 'shy' && '😊'}
            {plantEmotion === 'happy' && '🥰'}
            {plantEmotion === 'loved' && '😍'}
            {plantEmotion === 'glowing' && '✨💖✨'}
            {!plantEmotion && (
              plant.loveLevel < 30 ? '😐' : 
              plant.loveLevel < 70 ? '🙂' : 
              '😊'
            )}
          </motion.div>
        </motion.div>

        {/* タッチリップルエフェクト */}
        <AnimatePresence>
          {touchRipples.map((ripple) => (
            <motion.div
              key={ripple.id}
              className="absolute rounded-full border-2 border-pink-300 pointer-events-none"
              style={{
                left: ripple.x - 25,
                top: ripple.y - 25,
                width: 50,
                height: 50
              }}
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ 
                scale: 3, 
                opacity: 0,
                borderColor: ['rgba(244, 114, 182, 0.8)', 'rgba(244, 114, 182, 0)']
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          ))}
        </AnimatePresence>

        {/* 浮遊ハートエフェクト */}
        <AnimatePresence>
          {floatingHearts.map((heart) => (
            <motion.div
              key={heart.id}
              className="absolute pointer-events-none"
              style={{
                left: `calc(50% + ${heart.x}px)`,
                top: `calc(50% + ${heart.y}px)`,
                fontSize: `${heart.size}px`,
                color: heart.color
              }}
              initial={{ 
                opacity: 0, 
                scale: 0,
                y: 0
              }}
              animate={{ 
                opacity: [0, 1, 1, 0],
                scale: [0, 1, 1.2, 0],
                y: -100,
                rotate: [0, 10, -10, 5],
                x: (Math.random() - 0.5) * 50
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 3, 
                delay: heart.delay,
                ease: "easeOut"
              }}
            >
              💖
            </motion.div>
          ))}
        </AnimatePresence>

        {/* 愛情進捗バー */}
        {isPressed && !isCompleted && (
          <motion.div
            className="absolute bottom-20 left-4 right-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="bg-white/30 rounded-full h-6 backdrop-blur-sm border border-pink-300">
              <motion.div
                className="h-full bg-gradient-to-r from-pink-400 to-rose-400 rounded-full flex items-center justify-center"
                style={{ width: `${loveProgress}%` }}
                animate={{
                  boxShadow: [
                    '0 0 10px rgba(244, 114, 182, 0.5)',
                    '0 0 20px rgba(244, 114, 182, 0.8)',
                    '0 0 10px rgba(244, 114, 182, 0.5)'
                  ]
                }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {loveProgress > 20 && (
                  <span className="text-white text-sm font-bold">💕</span>
                )}
              </motion.div>
            </div>
            <p className="text-center text-sm text-gray-700 mt-2 font-medium">
              💕 {language === 'ja' ? '愛情充填中' : 'Filling with love'}... {Math.round(loveProgress)}%
            </p>
          </motion.div>
        )}

        {/* 操作ガイド（初期状態のみ） */}
        {!isPressed && !isCompleted && (
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{ 
              y: [0, -8, 0],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
              <span className="text-2xl">👇</span>
              <span className="text-sm text-gray-700 font-medium">
                {language === 'ja' ? '植物を長押しして愛情を込めて♪' : 'Long press to send love ♪'}
              </span>
            </div>
          </motion.div>
        )}

        {/* 完了メッセージ */}
        {isCompleted && (
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="bg-pink-100/90 px-6 py-3 rounded-full backdrop-blur-sm border border-pink-200">
              <span className="text-lg font-semibold text-pink-800">
                💖 {language === 'ja' ? '愛情が伝わりました！' : 'Love delivered successfully!'}
              </span>
            </div>
          </motion.div>
        )}

        {/* タッチ回数表示 */}
        {touchCount > 0 && (
          <div className="absolute top-16 right-4">
            <motion.div
              className="bg-pink-100/80 px-3 py-1 rounded-full text-sm font-medium text-pink-700"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              💕 × {touchCount}
            </motion.div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default LoveModal 