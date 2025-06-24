import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Volume2, VolumeX, Settings } from 'lucide-react'
import { usePlantStore } from '@/stores/plantStore'
import { useSoundEffects } from '@/hooks/useSoundEffects'
import { t } from '@/utils/i18n'
import { Plant, PlantType } from '@/types/plant'
import PlantCard from '@/components/plant/PlantCard'
import PlantDetailView from '@/components/plant/PlantDetailView'
import PlantTypeSelector from '@/components/plant/PlantTypeSelector'
import SettingsPanel from '@/components/ui/SettingsPanel'

const BentoGarden: React.FC = () => {
  const { plants, addPlant, language, theme } = usePlantStore()
  const { 
    playUISound, 
    startAmbientSound, 
    stopAmbientSound, 
    isAmbientPlaying,
    setMasterVolume,
    volume 
  } = useSoundEffects()
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionOrigin, setTransitionOrigin] = useState({ x: 0, y: 0 })
  const [showPlantSelector, setShowPlantSelector] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  // 時間帯の検出
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'day' | 'evening'>('day')

  useEffect(() => {
    const updateTimeOfDay = () => {
      const hour = new Date().getHours()
      if (hour >= 5 && hour < 11) {
        setTimeOfDay('morning')
      } else if (hour >= 11 && hour < 17) {
        setTimeOfDay('day')
      } else {
        setTimeOfDay('evening')
      }
    }

    updateTimeOfDay()
    const interval = setInterval(updateTimeOfDay, 60000) // 1分ごとに更新

    return () => clearInterval(interval)
  }, [])

  // 感情的優先度でソート
  const sortedPlants = [...plants].sort((a, b) => {
    const getEmotionalPriority = (plant: Plant) => {
      const timeSinceWater = (Date.now() - plant.lastWatered.getTime()) / (24 * 60 * 60 * 1000)
      const timeSinceSun = (Date.now() - plant.lastSunExposure.getTime()) / (24 * 60 * 60 * 1000)
      const attention = timeSinceWater > 2 ? 100 : timeSinceWater > 1 ? 50 : 0
      const sunAttention = timeSinceSun > 1 ? 80 : timeSinceSun > 0.5 ? 40 : 0
      const loveAttention = plant.loveLevel < 2 ? 90 : plant.loveLevel < 4 ? 30 : 0
      
      return attention + sunAttention + loveAttention + plant.loveLevel * 10 + plant.health
    }
    
    return getEmotionalPriority(b) - getEmotionalPriority(a)
  })

  // Liquid遷移のためのマウスポジション追跡
  const handlePlantClick = (plant: Plant, event?: React.MouseEvent) => {
    if (event) {
      const rect = event.currentTarget.getBoundingClientRect()
      setTransitionOrigin({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      })
    } else {
      setTransitionOrigin({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
      })
    }
    
    setIsTransitioning(true)
    
    // 少し遅延させて液体効果を見せる
    setTimeout(() => {
      setSelectedPlant(plant)
    }, 300)
  }

  const handleBackToGarden = () => {
    setIsTransitioning(true)
    
    setTimeout(() => {
      setSelectedPlant(null)
      setIsTransitioning(false)
    }, 300)
  }

  const handleAddPlant = () => {
    playUISound('click')
    setShowPlantSelector(true)
  }

  const handlePlantTypeSelect = (type: PlantType) => {
    playUISound('success')
    addPlant(type)
    setShowPlantSelector(false)
  }

  const handleCancelPlantSelection = () => {
    playUISound('click')
    setShowPlantSelector(false)
  }

  const handleOpenSettings = () => {
    playUISound('click')
    setShowSettings(true)
  }

  const handleCloseSettings = () => {
    playUISound('click')
    setShowSettings(false)
  }

  // 環境音の制御
  const toggleAmbientSound = () => {
    if (isAmbientPlaying) {
      stopAmbientSound()
    } else {
      startAmbientSound()
    }
    playUISound('click')
  }

  // 時間帯に応じた背景スタイル - より大胆なコントラスト
  const getTimeBasedBackground = () => {
    if (theme === 'dark') {
      return {
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        overlay: 'rgba(0, 0, 0, 0.4)'
      }
    }

    if (theme === 'light') {
      // ライトテーマでは時間帯に関係なく昼間の明るいグラデーション
      return {
        background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 25%, #60a5fa 50%, #3b82f6 75%, #1d4ed8 100%)',
        overlay: 'rgba(255, 255, 255, 0.2)'
      }
    }

    // auto テーマの場合のみ時間帯を考慮
    const hour = new Date().getHours()

    if (hour >= 6 && hour < 12) {
      // 朝：鮮やかなグラデーション
      return {
        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 25%, #fbbf24 50%, #f59e0b 75%, #d97706 100%)',
        overlay: 'rgba(255, 255, 255, 0.15)'
      }
    } else if (hour >= 12 && hour < 18) {
      // 昼：明るく活力的
      return {
        background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 25%, #60a5fa 50%, #3b82f6 75%, #1d4ed8 100%)',
        overlay: 'rgba(255, 255, 255, 0.2)'
      }
    } else if (hour >= 18 && hour < 22) {
      // 夕方：温かみのあるオレンジ
      return {
        background: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 25%, #fb923c 50%, #f97316 75%, #ea580c 100%)',
        overlay: 'rgba(255, 255, 255, 0.1)'
      }
    } else {
      // 夜：深く神秘的
      return {
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 25%, #3730a3 50%, #4338ca 75%, #4f46e5 100%)',
        overlay: 'rgba(255, 255, 255, 0.05)'
      }
    }
  }

  const backgroundStyle = getTimeBasedBackground()

  // 時間帯に応じた挨拶 - より具体的で魅力的
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours()
    
    if (hour >= 6 && hour < 12) {
      return {
        main: t('greeting.morning.main', language),
        sub: t('greeting.morning.sub', language)
      }
    } else if (hour >= 12 && hour < 18) {
      return {
        main: t('greeting.afternoon.main', language),
        sub: t('greeting.afternoon.sub', language)
      }
    } else if (hour >= 18 && hour < 22) {
      return {
        main: t('greeting.evening.main', language),
        sub: t('greeting.evening.sub', language)
      }
    } else {
      return {
        main: t('greeting.night.main', language),
        sub: t('greeting.night.sub', language)
      }
    }
  }

  const greeting = getTimeBasedGreeting()

  // 詳細画面を表示中の場合
  if (selectedPlant) {
    return (
      <div className={`min-h-screen ${backgroundStyle.background} relative overflow-hidden`}>
        {/* Liquid遷移オーバーレイ */}
        <AnimatePresence>
          {isTransitioning && (
            <motion.div
              className="fixed inset-0 z-50 pointer-events-none transform-gpu"
              style={{
                background: `radial-gradient(circle, 
                  rgba(255, 255, 255, 0.8) 0%, 
                  rgba(255, 255, 255, 0.4) 40%,
                  transparent 70%)`
              }}
              initial={{ 
                scale: 0,
                opacity: 0,
                x: transitionOrigin.x - window.innerWidth / 2,
                y: transitionOrigin.y - window.innerHeight / 2,
                borderRadius: '50%'
              }}
              animate={{ 
                scale: 4,
                opacity: [0, 0.3, 0],
                x: 0,
                y: 0,
                borderRadius: ['50%', '30%', '0%']
              }}
              exit={{
                scale: 0,
                opacity: 0
              }}
              transition={{
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              onAnimationComplete={() => setIsTransitioning(false)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key="detail"
            initial={{ 
              opacity: 0, 
              scale: 0.8,
              filter: 'blur(20px)'
            }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              filter: 'blur(0px)'
            }}
            exit={{ 
              opacity: 0, 
              scale: 1.1,
              filter: 'blur(10px)'
            }}
            transition={{
              duration: 0.6,
              delay: 0.2,
              ease: "easeOut"
            }}
          >
            <PlantDetailView 
              plant={selectedPlant} 
              onBack={handleBackToGarden}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    )
  }

  // メイン庭画面
  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        background: backgroundStyle.background,
      }}
    >
      {/* 動的オーバーレイ - 明確なコントラスト */}
      <div 
        className="absolute inset-0"
        style={{
          background: backgroundStyle.overlay,
          backdropFilter: 'blur(1px)'
        }}
      />

      {/* 装飾的な背景エレメント - 視覚的フック */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* 浮遊する光の粒子 */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-30 transform-gpu"
            animate={{
              x: [0, window.innerWidth || 1200],
              y: [
                Math.random() * (window.innerHeight || 800),
                Math.random() * (window.innerHeight || 800),
                Math.random() * (window.innerHeight || 800),
              ],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              delay: i * 2,
              ease: "linear",
            }}
          />
        ))}

        {/* 大きな装飾円 */}
        <motion.div
          className="absolute -top-20 -right-20 w-40 h-40 rounded-full transform-gpu"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        
        <motion.div
          className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full transform-gpu"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* 強化されたヘッダー - 明確な階層 */}
        <motion.div
          className="text-center mb-16 transform-gpu"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* メインタイトル - 大胆で印象的 */}
          <motion.h1 
            className="text-6xl md:text-7xl font-bold mb-6"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #e2e8f0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 4px 20px rgba(0,0,0,0.3)',
            }}
            animate={{
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            Liquid Garden
          </motion.h1>

          {/* 時間帯別の挨拶 - 大きく目立つ */}
          <motion.h2
            className="text-2xl md:text-3xl font-semibold text-white mb-4"
            style={{
              textShadow: '0 2px 10px rgba(0,0,0,0.5)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {greeting.main}
          </motion.h2>

          {/* サブタイトル - 具体的で魅力的 */}
          <motion.p
            className="text-lg md:text-xl text-white opacity-90 max-w-2xl mx-auto leading-relaxed"
            style={{
              textShadow: '0 1px 5px rgba(0,0,0,0.3)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ delay: 0.5 }}
          >
            {greeting.sub}
          </motion.p>
        </motion.div>

        {/* 植物がいない場合の魅力的なウェルカム画面 */}
        {plants.length === 0 ? (
          <motion.div
            className="max-w-2xl mx-auto text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* 大胆なコールトゥアクション */}
            <motion.div
              className="p-12 rounded-3xl mb-8"
              style={{
                background: 'rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
              }}
              whileHover={{
                scale: 1.02,
                boxShadow: '0 25px 80px rgba(0, 0, 0, 0.3)',
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="text-8xl mb-8"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                🌱
              </motion.div>

              <h3 className="text-3xl font-bold text-white mb-6">
                {language === 'ja' ? 'あなたの庭は空っぽです' : 'Your garden is empty'}
              </h3>
              
              <p className="text-xl text-white opacity-90 mb-8 leading-relaxed">
                {t('description', language)}<br />
                {language === 'ja' ? '特別な成長の物語を始めませんか？' : 'Ready to start growing?'}
              </p>

              <motion.button
                data-testid="add-plant-button"
                onClick={handleAddPlant}
                className="px-12 py-4 bg-white text-gray-800 rounded-full text-xl font-semibold"
                style={{
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 15px 40px rgba(0, 0, 0, 0.3)',
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                🌟 {t('start.button', language)}
              </motion.button>
            </motion.div>
          </motion.div>
        ) : (
          <div className="space-y-12">
            {/* 植物カードコンテナ - 改善されたレスポンシブグリッド */}
            <div className={`grid gap-8 ${
              plants.length === 1 ? 'grid-cols-1 max-w-lg mx-auto' :
              plants.length === 2 ? 'grid-cols-1 lg:grid-cols-2' :
              plants.length <= 4 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2' :
              'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3'
            }`}>
              {plants.map((plant) => (
                <motion.div
                  key={plant.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: plants.indexOf(plant) * 0.1,
                    ease: "easeOut" 
                  }}
                  className="h-full"
                >
                  <PlantCard
                    plant={plant}
                    size={plants.length === 1 ? 'featured' : plants.length <= 2 ? 'large' : 'medium'}
                    onClick={() => setSelectedPlant(plant)}
                  />
                </motion.div>
              ))}
            </div>

            {/* 新しい植物追加ボタン - より魅力的 */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: plants.length * 0.1 + 0.5 }}
            >
              <motion.button
                data-testid="add-plant-button"
                onClick={handleAddPlant}
                className="px-8 py-4 rounded-full text-lg font-semibold"
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(12px)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                }}
                whileHover={{
                  scale: 1.05,
                  background: 'rgba(255, 255, 255, 0.3)',
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                ✨ {t('add.plant', language)}
              </motion.button>
            </motion.div>

            {/* 植物が多い場合の概要表示 */}
            {plants.length > 4 && (
              <motion.div
                className="p-8 rounded-3xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="text-center">
                  <p className="text-xl text-white mb-6 font-medium">
                    🌿 {plants.length}匹の植物たちが、あなたを待っています
                  </p>
                  
                  {/* 緊急ケアが必要な植物の概要 */}
                  <div className="flex flex-wrap justify-center gap-3">
                    {plants.filter(plant => {
                      const timeSinceWater = (Date.now() - plant.lastWatered.getTime()) / (24 * 60 * 60 * 1000)
                      const timeSinceSun = (Date.now() - plant.lastSunExposure.getTime()) / (24 * 60 * 60 * 1000)
                      return timeSinceWater > 2 || timeSinceSun > 1 || plant.loveLevel < 2
                    }).slice(0, 3).map(plant => (
                      <motion.button
                        key={plant.id}
                        className="px-4 py-2 rounded-full text-sm font-medium"
                        style={{
                          background: 'rgba(255, 255, 255, 0.9)',
                          color: '#dc2626',
                          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                        }}
                        whileHover={{ 
                          scale: 1.05,
                          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedPlant(plant)}
                      >
                        🚨 {plant.name}{t('urgent.care.waiting', language)}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* コントロールボタン群 */}
      <div className="fixed top-6 right-6 z-20 flex flex-col space-y-3">
        {/* 設定ボタン */}
        <motion.button
          onClick={handleOpenSettings}
          className="p-4 rounded-full shadow-lg"
          style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}
          whileHover={{ 
            scale: 1.1, 
            background: 'rgba(255, 255, 255, 0.9)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}
          whileTap={{ scale: 0.9 }}
          onHoverStart={() => playUISound('hover')}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.1 }}
        >
          <Settings size={24} className="text-blue-600" />
        </motion.button>

        {/* 音響制御ボタン */}
        <motion.button
          onClick={toggleAmbientSound}
          className="p-4 rounded-full shadow-lg"
          style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}
          whileHover={{ 
            scale: 1.1, 
            background: 'rgba(255, 255, 255, 0.9)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}
          whileTap={{ scale: 0.9 }}
          onHoverStart={() => playUISound('hover')}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          {isAmbientPlaying ? (
            <Volume2 size={24} className="text-blue-600" />
          ) : (
            <VolumeX size={24} className="text-gray-600" />
          )}
        </motion.button>
      </div>

      {/* 植物タイプ選択ダイアログ */}
      <AnimatePresence>
        {showPlantSelector && (
          <PlantTypeSelector
            onSelect={handlePlantTypeSelect}
            onCancel={handleCancelPlantSelection}
          />
        )}
      </AnimatePresence>

      {/* 設定パネル */}
      <AnimatePresence>
        {showSettings && (
          <SettingsPanel onClose={handleCloseSettings} />
        )}
      </AnimatePresence>
    </div>
  )
}

export default BentoGarden 