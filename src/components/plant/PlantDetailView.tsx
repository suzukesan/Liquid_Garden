import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { ArrowLeft, Droplets, Sun, Heart, Calendar } from 'lucide-react'
import { usePlantStore } from '@/stores/plantStore'
import { Plant, PlantType, GrowthStage } from '@/types/plant'
import { generatePlantPersonality, generatePlantColors, getPlantStateModifiers } from '@/utils/plantPersonality'
import { useSoundEffects } from '@/hooks/useSoundEffects'
import PlantActions from './PlantActions'
import ConfirmModal from '../ui/ConfirmModal'

interface PlantDetailViewProps {
  plant: Plant
  onBack: () => void
}

const PlantDetailView: React.FC<PlantDetailViewProps> = ({ plant, onBack }) => {
  const { waterPlant, giveSunExposure, talkToPlant, removePlant } = usePlantStore()
  const { 
    playWaterSound, 
    playSunlightSound, 
    playLoveSound, 
    playUISound, 
    startAmbientSound, 
    stopAmbientSound,
    isAmbientPlaying 
  } = useSoundEffects()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [recentAction, setRecentAction] = useState<string | null>(null)
  const [isPlantReacting, setIsPlantReacting] = useState(false)
  
  const personality = generatePlantPersonality(plant)
  const colors = generatePlantColors(plant, personality)
  const modifiers = getPlantStateModifiers(plant, personality)

  // アニメーションコントロール
  const plantControls = useAnimation()
  const waterDropControls = useAnimation()
  const sunlightControls = useAnimation()
  const heartControls = useAnimation()

  // 植物の感情的なケア状態を計算
  const getEmotionalCareState = () => {
    const timeSinceWater = (Date.now() - plant.lastWatered.getTime()) / (24 * 60 * 60 * 1000)
    const timeSinceSun = (Date.now() - plant.lastSunExposure.getTime()) / (24 * 60 * 60 * 1000)
    const timeSinceTalk = (Date.now() - plant.lastTalk.getTime()) / (24 * 60 * 60 * 1000)

    return {
      water: {
        // アクション（常に動詞）
        actionText: '水をあげる',
        // 現在の状態（植物の気持ち）
        statusText: timeSinceWater > 2 ? 'のどがからからです...' : 
                   timeSinceWater > 1 ? 'そろそろお水が飲みたいです' : 
                   '今はみずみずしいよ',
        // 最後のお世話からの経過時間
        lastCareText: timeSinceWater < 1 ? '今日' : `${Math.floor(timeSinceWater)}日前`,
        // 緊急度
        urgency: timeSinceWater > 2 ? 'urgent' : timeSinceWater > 1 ? 'needed' : 'satisfied',
        // ボタンの活性状態（緊急度に基づく）
        isActive: timeSinceWater > 0.5, // 半日以上経過したら活性化
        emoji: timeSinceWater > 2 ? '🥵' : timeSinceWater > 1 ? '💧' : '✨'
      },
      sun: {
        actionText: '日光浴させる',
        statusText: timeSinceSun > 1 ? 'お日様が恋しいみたい...' : 
                   timeSinceSun > 0.5 ? 'あたたかい光が欲しそう' : 
                   '光のシャワーを浴びています',
        lastCareText: timeSinceSun < 1 ? '今日' : `${Math.floor(timeSinceSun)}日前`,
        urgency: timeSinceSun > 1 ? 'urgent' : timeSinceSun > 0.5 ? 'needed' : 'satisfied',
        isActive: timeSinceSun > 0.3, // 約8時間経過したら活性化
        emoji: timeSinceSun > 1 ? '🌙' : timeSinceSun > 0.5 ? '🌤️' : '☀️'
      },
      talk: {
        actionText: '話しかける',
        statusText: plant.loveLevel < 2 ? 'ひとりぼっちで寂しそう...' : 
                   plant.loveLevel < 4 ? 'あなたの声を待ってるみたい' : 
                   'あなたの声が大好きです',
        lastCareText: timeSinceTalk < 1 ? '今日' : `${Math.floor(timeSinceTalk)}日前`,
        urgency: plant.loveLevel < 2 ? 'urgent' : plant.loveLevel < 4 ? 'needed' : 'satisfied',
        isActive: plant.loveLevel < 5, // 最大レベル未満なら常に活性化
        emoji: plant.loveLevel < 2 ? '😢' : plant.loveLevel < 4 ? '🥺' : '🥰'
      }
    }
  }

  const emotionalCare = getEmotionalCareState()

  // 植物の生命反応を実行
  const triggerPlantReaction = async (actionType: string) => {
    setIsPlantReacting(true)
    setRecentAction(actionType)

    switch (actionType) {
      case 'water':
        // 水やり反応：萎れから回復
        await plantControls.start({
          scale: [1, 0.95, 1.1, 1],
          rotate: [0, -2, 2, 0],
          filter: ['brightness(0.8)', 'brightness(1)', 'brightness(1.2)', 'brightness(1)'],
          transition: { duration: 2, ease: "easeInOut" }
        })
        break
      
      case 'sun':
        // 日光浴反応：キラキラと輝く
        await plantControls.start({
          scale: [1, 1.1, 1],
          filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1.3)', 'brightness(1)'],
          textShadow: ['0 0 0px rgba(255,255,0,0)', '0 0 20px rgba(255,255,0,0.8)', '0 0 10px rgba(255,255,0,0.4)', '0 0 0px rgba(255,255,0,0)'],
          transition: { duration: 3, ease: "easeInOut" }
        })
        break
      
      case 'talk':
        // 会話反応：嬉しそうに揺れる
        await plantControls.start({
          rotate: [0, 5, -5, 3, -3, 0],
          scale: [1, 1.05, 1],
          transition: { duration: 1.5, ease: "easeInOut" }
        })
        break
    }

    setTimeout(() => {
      setIsPlantReacting(false)
      setRecentAction(null)
    }, 3000)
  }

  const handleWater = async () => {
    // 水滴アニメーション
    await waterDropControls.start({
      scale: [1, 1.3, 0.8, 1.2, 1],
      rotate: [0, -10, 10, -5, 0],
      filter: ['blur(0px)', 'blur(1px)', 'blur(0px)'],
      transition: { duration: 0.6, ease: "easeInOut" }
    })
    
    // 心地よい水音を再生
    await playWaterSound()
    waterPlant(plant.id)
    await triggerPlantReaction('water')
  }

  const handleSunlight = async () => {
    // 太陽アニメーション
    await sunlightControls.start({
      scale: [1, 1.4, 1],
      rotate: [0, 180, 360],
      filter: ['brightness(1)', 'brightness(2)', 'brightness(1)'],
      transition: { duration: 0.8, ease: "easeInOut" }
    })
    
    // キラキラ音を再生
    await playSunlightSound()
    giveSunExposure(plant.id)
    await triggerPlantReaction('sun')
  }

  const handleTalk = async () => {
    // ハートアニメーション
    await heartControls.start({
      scale: [1, 1.5, 1.2, 1],
      opacity: [1, 0.8, 1],
      y: [0, -10, 0],
      transition: { duration: 0.7, ease: "easeInOut" }
    })
    
    // 愛情のチャイム音を再生
    await playLoveSound()
    talkToPlant(plant.id)
    await triggerPlantReaction('talk')
  }

  const handleDelete = () => {
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    removePlant(plant.id)
    setShowDeleteModal(false)
  }

  // 植物の深い感情状態
  const getDeepEmotionalState = () => {
    if (plant.health > 80 && plant.loveLevel >= 4) {
      return { 
        text: 'あなたの愛に包まれて、幸せいっぱいです', 
        mood: '✨',
        aura: 'radiant'
      }
    } else if (plant.health > 60 && plant.loveLevel >= 3) {
      return { 
        text: '心地よい日々を過ごしています', 
        mood: '🌱',
        aura: 'peaceful'
      }
    } else if (plant.health > 40) {
      return { 
        text: 'ちょっと元気がないけれど、頑張っています', 
        mood: '🍃',
        aura: 'gentle'
      }
    } else if (plant.health > 20) {
      return { 
        text: 'そばにいてくれるだけで嬉しいです', 
        mood: '😌',
        aura: 'fragile'
      }
    } else {
      return { 
        text: '静かに回復の時を待っています', 
        mood: '💤',
        aura: 'resting'
      }
    }
  }

  const deepState = getDeepEmotionalState()

  // 液体ガラスの健康表現（透明度で健康度を表現）
  const getHealthGlassStyle = () => {
    const healthRatio = plant.health / 100
    const loveGlow = plant.loveLevel / 5
    
    // 健康度が低いほどガラスが曇る
    const clarity = 0.3 + (healthRatio * 0.4)
    const blurAmount = 15 + ((1 - healthRatio) * 10)
    
    return {
      background: `linear-gradient(135deg, 
        rgba(255, 255, 255, ${clarity}) 0%, 
        rgba(255, 255, 255, ${clarity * 0.8}) 50%,
        rgba(255, 255, 255, ${clarity * 0.6}) 100%)`,
      backdropFilter: `blur(${blurAmount}px) saturate(${100 + healthRatio * 50}%)`,
      borderRadius: '32px',
      border: `1px solid rgba(255, 255, 255, ${0.4 + loveGlow * 0.2})`,
      boxShadow: `
        0 16px 48px rgba(0, 0, 0, ${0.1 + (1 - healthRatio) * 0.05}),
        inset 0 4px 16px rgba(255, 255, 255, ${0.5 + loveGlow * 0.2}),
        0 0 ${plant.loveLevel * 30}px ${colors.glow}${Math.round(plant.loveLevel * 25).toString(16)}`
    }
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

  // 詳細画面に入った時に環境音を開始
  useEffect(() => {
    startAmbientSound()
    return () => {
      stopAmbientSound()
    }
  }, [startAmbientSound, stopAmbientSound])

  return (
    <div className="min-h-screen p-6" style={{
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0fdf4 100%)'
    }}>
      {/* 流れる光の粒子背景 */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="fixed w-2 h-2 rounded-full pointer-events-none"
          style={{
            background: `${colors.glow}40`,
            boxShadow: `0 0 8px ${colors.glow}60`
          }}
          animate={{
            x: [-50, window.innerWidth + 50],
            y: [
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight + 100,
              Math.random() * window.innerHeight
            ],
            opacity: [0, 0.6, 0],
            scale: [0.5, 1.2, 0.5]
          }}
          transition={{
            duration: 12 + i * 2,
            repeat: Infinity,
            delay: i * 1.5,
            ease: "linear"
          }}
        />
      ))}

      <div className="max-w-4xl mx-auto">
        {/* 戻るボタン - 液体的デザイン */}
        <motion.button
          onClick={() => {
            playUISound('click')
            onBack()
          }}
          className="mb-8 flex items-center space-x-2 px-6 py-3 rounded-full text-gray-700 font-medium"
          style={{
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}
          whileHover={{ 
            scale: 1.05, 
            y: -2,
            background: 'rgba(255, 255, 255, 0.9)'
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
          onHoverStart={() => playUISound('hover')}
        >
          <ArrowLeft size={20} />
          <span>庭に戻る</span>
        </motion.button>

        {/* メイン詳細カード */}
        <motion.div
          className="relative p-8 space-y-8"
          style={getHealthGlassStyle()}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* 削除アクション */}
          <PlantActions
            onDelete={handleDelete}
            className="absolute top-6 right-6"
          />

          {/* 植物の中央表示 - 生命の呼吸と反応 */}
          <div className="text-center space-y-6">
            <motion.div
              animate={plantControls}
              className="relative inline-block"
              style={{
                filter: plant.health < 30 ? 'grayscale(0.2) brightness(0.9)' : 'none'
              }}
            >
              {/* 植物の主要アイコン - 生命の呼吸 */}
              <motion.div
                className="text-8xl mb-4 inline-block"
                animate={!isPlantReacting ? {
                  scale: [1, 1.03, 1],
                  rotate: [0, 1, -1, 0]
                } : {}}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {growth.emoji}
              </motion.div>

              {/* 生命反応エフェクト */}
              {recentAction === 'water' && (
                <motion.div
                  className="absolute -top-4 -right-4 text-2xl"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: [0, 1.5, 1, 1.2, 1],
                    opacity: [0, 1, 1, 0],
                    y: [0, -20, -30, -40]
                  }}
                  transition={{ duration: 2, ease: "easeOut" }}
                >
                  💧✨
                </motion.div>
              )}

              {recentAction === 'sun' && (
                <motion.div
                  className="absolute -top-4 -left-4 text-2xl"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: [0, 1.5, 1],
                    opacity: [0, 1, 0],
                    rotate: [0, 360]
                  }}
                  transition={{ duration: 3, ease: "easeOut" }}
                >
                  ☀️✨
                </motion.div>
              )}

              {recentAction === 'talk' && (
                <motion.div
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-2xl"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: [0, 1.3, 1],
                    opacity: [0, 1, 0],
                    y: [0, -30]
                  }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                >
                  💕
                </motion.div>
              )}
            </motion.div>

            {/* 植物の名前と感情状態 */}
            <div className="space-y-3">
              <motion.h1 
                className="text-3xl font-bold"
                style={{ color: colors.primary }}
                animate={{ opacity: [0.9, 1, 0.9] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {personality.nameVariations[0]}
              </motion.h1>
              
              <motion.div
                className="flex items-center justify-center space-x-3 text-xl"
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <span>{deepState.mood}</span>
                <span className="text-gray-600 italic">{deepState.text}</span>
              </motion.div>

              <motion.p 
                className="text-gray-600 italic"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                {growth.poetry}
              </motion.p>
            </div>
          </div>

          {/* ケアアクション - クリーンで統一されたデザイン */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 水やりアクション */}
            <div className="space-y-3">
              <motion.button
                animate={waterDropControls}
                disabled={!emotionalCare.water.isActive}
                className={`w-full p-6 rounded-3xl text-center overflow-hidden transition-all duration-300 ${
                  emotionalCare.water.urgency === 'urgent' || emotionalCare.water.urgency === 'needed'
                    ? 'bg-blue-100 border-2 border-blue-300 shadow-lg'
                    : 'bg-white bg-opacity-60 border-2 border-white border-opacity-30'
                } ${
                  !emotionalCare.water.isActive 
                    ? 'opacity-60 cursor-not-allowed' 
                    : 'hover:shadow-lg cursor-pointer'
                }`}
                style={{
                  backdropFilter: 'blur(12px)',
                }}
                whileHover={emotionalCare.water.isActive ? { scale: 1.02, y: -4 } : {}}
                whileTap={emotionalCare.water.isActive ? { scale: 0.98 } : {}}
                onClick={emotionalCare.water.isActive ? handleWater : undefined}
              >
                <motion.div
                  className="text-4xl mb-3 inline-block"
                  animate={emotionalCare.water.isActive ? {
                    y: [0, -4, 0],
                    scale: [1, 1.1, 1]
                  } : {}}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Droplets className={`w-8 h-8 mx-auto ${
                    emotionalCare.water.isActive ? 'text-blue-500' : 'text-gray-400'
                  }`} />
                </motion.div>
                
                {/* アクション名のみ - クリーンなボタン */}
                <h3 className={`font-semibold text-lg ${
                  emotionalCare.water.isActive ? 'text-gray-800' : 'text-gray-500'
                }`}>
                  {emotionalCare.water.actionText}
                </h3>
              </motion.button>
              
              {/* 補足情報 - ボタンの外に分離 */}
              <div className="text-sm space-y-1 text-center">
                <p className={`italic ${
                  emotionalCare.water.urgency === 'urgent' ? 'text-blue-700 font-medium' :
                  emotionalCare.water.urgency === 'needed' ? 'text-blue-600' :
                  'text-gray-600'
                }`}>
                  {emotionalCare.water.emoji} {emotionalCare.water.statusText}
                </p>
                <p className="text-xs text-gray-500">
                  最後の水やり: {emotionalCare.water.lastCareText}
                </p>
              </div>
            </div>

            {/* 日光浴アクション */}
            <div className="space-y-3">
              <motion.button
                animate={sunlightControls}
                disabled={!emotionalCare.sun.isActive}
                className={`w-full p-6 rounded-3xl text-center overflow-hidden transition-all duration-300 ${
                  emotionalCare.sun.urgency === 'urgent' || emotionalCare.sun.urgency === 'needed'
                    ? 'bg-yellow-100 border-2 border-yellow-300 shadow-lg'
                    : 'bg-white bg-opacity-60 border-2 border-white border-opacity-30'
                } ${
                  !emotionalCare.sun.isActive 
                    ? 'opacity-60 cursor-not-allowed' 
                    : 'hover:shadow-lg cursor-pointer'
                }`}
                style={{
                  backdropFilter: 'blur(12px)',
                }}
                whileHover={emotionalCare.sun.isActive ? { scale: 1.02, y: -4 } : {}}
                whileTap={emotionalCare.sun.isActive ? { scale: 0.98 } : {}}
                onClick={emotionalCare.sun.isActive ? handleSunlight : undefined}
              >
                <motion.div
                  className="text-4xl mb-3 inline-block"
                  animate={emotionalCare.sun.isActive ? {
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  } : {}}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Sun className={`w-8 h-8 mx-auto ${
                    emotionalCare.sun.isActive ? 'text-yellow-500' : 'text-gray-400'
                  }`} />
                </motion.div>
                
                <h3 className={`font-semibold text-lg ${
                  emotionalCare.sun.isActive ? 'text-gray-800' : 'text-gray-500'
                }`}>
                  {emotionalCare.sun.actionText}
                </h3>
              </motion.button>
              
              <div className="text-sm space-y-1 text-center">
                <p className={`italic ${
                  emotionalCare.sun.urgency === 'urgent' ? 'text-yellow-700 font-medium' :
                  emotionalCare.sun.urgency === 'needed' ? 'text-yellow-600' :
                  'text-gray-600'
                }`}>
                  {emotionalCare.sun.emoji} {emotionalCare.sun.statusText}
                </p>
                <p className="text-xs text-gray-500">
                  最後の日光浴: {emotionalCare.sun.lastCareText}
                </p>
              </div>
            </div>

            {/* 愛情を伝えるアクション */}
            <div className="space-y-3">
              <motion.button
                animate={heartControls}
                disabled={!emotionalCare.talk.isActive}
                className={`w-full p-6 rounded-3xl text-center overflow-hidden transition-all duration-300 ${
                  emotionalCare.talk.urgency === 'urgent' || emotionalCare.talk.urgency === 'needed'
                    ? 'bg-pink-100 border-2 border-pink-300 shadow-lg'
                    : 'bg-white bg-opacity-60 border-2 border-white border-opacity-30'
                } ${
                  !emotionalCare.talk.isActive 
                    ? 'opacity-60 cursor-not-allowed' 
                    : 'hover:shadow-lg cursor-pointer'
                }`}
                style={{
                  backdropFilter: 'blur(12px)',
                }}
                whileHover={emotionalCare.talk.isActive ? { scale: 1.02, y: -4 } : {}}
                whileTap={emotionalCare.talk.isActive ? { scale: 0.98 } : {}}
                onClick={emotionalCare.talk.isActive ? handleTalk : undefined}
              >
                <motion.div
                  className="text-4xl mb-3 inline-block"
                  animate={emotionalCare.talk.isActive ? {
                    scale: [1, 1.2, 1],
                    opacity: [0.8, 1, 0.8]
                  } : {}}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Heart className={`w-8 h-8 mx-auto ${
                    emotionalCare.talk.isActive ? 'text-pink-500' : 'text-gray-400'
                  }`} />
                </motion.div>
                
                <h3 className={`font-semibold text-lg ${
                  emotionalCare.talk.isActive ? 'text-gray-800' : 'text-gray-500'
                }`}>
                  {emotionalCare.talk.actionText}
                </h3>
              </motion.button>
              
              <div className="text-sm space-y-1 text-center">
                <p className={`italic ${
                  emotionalCare.talk.urgency === 'urgent' ? 'text-pink-700 font-medium' :
                  emotionalCare.talk.urgency === 'needed' ? 'text-pink-600' :
                  'text-gray-600'
                }`}>
                  {emotionalCare.talk.emoji} {emotionalCare.talk.statusText}
                </p>
                <p className="text-xs text-gray-500">
                  最後の会話: {emotionalCare.talk.lastCareText}
                </p>
              </div>
            </div>
          </div>

          {/* 成長の記録 - 重複する履歴セクションを削除し、より意味のある情報に */}
          <motion.div
            className="mt-12 p-6 rounded-3xl"
            style={{
              background: 'rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              成長の軌跡
            </h3>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 rounded-2xl bg-white bg-opacity-50">
                <p className="text-xs text-gray-600 mb-1">健康状態</p>
                <p className="text-lg font-bold text-green-600">
                  {plant.health >= 80 ? '✨ とても元気' :
                   plant.health >= 60 ? '😊 元気' :
                   plant.health >= 40 ? '😐 普通' : '😰 心配'}
                </p>
              </div>
              
              <div className="p-3 rounded-2xl bg-white bg-opacity-50">
                <p className="text-xs text-gray-600 mb-1">成長段階</p>
                <p className="text-lg font-bold text-blue-600">
                  {plant.growthStage === 'small_leaves' ? '若葉' :
                   plant.growthStage === 'large_leaves' ? '成熟' : '開花'}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* 削除確認モーダル */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title={`${personality.nameVariations[0]}とのお別れ`}
        message="本当にお別れしますか？一緒に過ごした思い出は永遠に失われてしまいます..."
        confirmText="お別れする"
        cancelText="もう少し一緒にいる"
      />
    </div>
  )
}

export default PlantDetailView 