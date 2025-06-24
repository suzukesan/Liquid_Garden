import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Droplets } from 'lucide-react'
import { Plant } from '@/types/plant'
import { usePlantStore } from '@/stores/plantStore'
import { useSoundEffects } from '@/hooks/useSoundEffects'

import PlantArtDisplay from '@/components/plant/PlantArtDisplay'
import { useToast } from '@/hooks/useToast'
import { t } from '@/utils/i18n'

interface WateringModalProps {
  plant: Plant
  onClose: () => void
  onWaterComplete: () => void
}

const WateringModal: React.FC<WateringModalProps> = ({ 
  plant, 
  onClose, 
  onWaterComplete 
}) => {
  const { waterPlant, language } = usePlantStore()
  const { playWaterSound } = useSoundEffects()
  const { show: showToast } = useToast()
  
  const [isWatering, setIsWatering] = useState(false)
  const [waterDrops, setWaterDrops] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([])
  const [plantReaction, setPlantReaction] = useState<'happy' | 'refreshed' | null>(null)
  const [canPosition, setCanPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  
  const modalRef = useRef<HTMLDivElement>(null)
  const plantRef = useRef<HTMLDivElement>(null)
  const canRef = useRef<HTMLDivElement>(null)
  
  // じょうろの初期位置を設定
  useEffect(() => {
    if (modalRef.current) {
      const rect = modalRef.current.getBoundingClientRect()
      setCanPosition({ 
        x: rect.width / 4 - 50, 
        y: rect.height - 120 
      })
    }
  }, [])

  // 水やり処理
  const handleWaterPlant = async () => {
    if (isWatering) return

    setIsWatering(true)
    
    // 水滴アニメーション生成
    const drops = []
    for (let i = 0; i < 8; i++) {
      drops.push({
        id: Date.now() + i,
        x: canPosition.x + 25 + (Math.random() - 0.5) * 30,
        y: canPosition.y - 10,
        delay: i * 100
      })
    }
    setWaterDrops(drops)

    // 音効果
    await playWaterSound()
    
    // 植物の反応
    setTimeout(() => {
      setPlantReaction('happy')
    }, 500)

    setTimeout(() => {
      setPlantReaction('refreshed')
    }, 1500)

    // 実際の水やり処理
    setTimeout(() => {
      waterPlant(plant.id)
      showToast({ message: `${plant.name}${t('plant.happy_reaction', language)}`, emoji: '💧✨' })
      
      // 完了後の処理
      setTimeout(() => {
        setIsWatering(false)
        setWaterDrops([])
        setPlantReaction(null)
        onWaterComplete()
        onClose()
      }, 1000)
    }, 2000)
  }

  // じょうろのドラッグ処理
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    const rect = modalRef.current?.getBoundingClientRect()
    if (!rect) return

    const startX = e.clientX - rect.left - canPosition.x
    const startY = e.clientY - rect.top - canPosition.y

    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - rect.left - startX
      const newY = e.clientY - rect.top - startY
      
      // モーダル内での制限
      const maxX = rect.width - 100
      const maxY = rect.height - 100
      
      setCanPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      
      // 植物の近くにドロップした場合は水やり実行
      if (plantRef.current && canRef.current) {
        const plantRect = plantRef.current.getBoundingClientRect()
        const canRect = canRef.current.getBoundingClientRect()
        
        const distance = Math.hypot(
          plantRect.left + plantRect.width/2 - (canRect.left + canRect.width/2),
          plantRect.top + plantRect.height/2 - (canRect.top + canRect.height/2)
        )
        
        if (distance < 120) {
          handleWaterPlant()
        }
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
             <motion.div
         ref={modalRef}
         className="relative w-[500px] h-[450px] bg-gradient-to-b from-sky-100 to-green-50 rounded-3xl shadow-2xl overflow-hidden"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, rgba(135, 206, 235, 0.3) 0%, rgba(144, 238, 144, 0.3) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.3)'
        }}
      >
        {/* クローズボタン */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white transition-all"
        >
          <X size={20} className="text-gray-600" />
        </button>

        {/* タイトル */}
        <div className="absolute top-4 left-4 z-10">
          <h3 className="text-lg font-bold text-gray-700">
            {t('care.water', language)} - {plant.name}
          </h3>
          <p className="text-sm text-gray-600">
            {isWatering ? t('watering.in_progress', language) : t('watering.instruction', language)}
          </p>
        </div>

        {/* 植物表示 */}
        <div 
          ref={plantRef}
          className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          <motion.div
            animate={
              plantReaction === 'happy' 
                ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }
                : plantReaction === 'refreshed'
                ? { scale: [1, 1.05, 1], filter: ['brightness(1)', 'brightness(1.3)', 'brightness(1)'] }
                : isWatering 
                ? { scale: [1, 1.02, 1] }
                : {}
            }
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <PlantArtDisplay 
              plant={plant} 
              size="large"
              className="mb-2"
            />
            
            {/* 植物の感情表示 */}
            <motion.div 
              className="text-center text-3xl"
              animate={
                plantReaction === 'happy' ? { scale: [1, 1.3, 1] } :
                plantReaction === 'refreshed' ? { y: [0, -10, 0] } : {}
              }
            >
              {plantReaction === 'happy' && '😊'}
              {plantReaction === 'refreshed' && '✨'}
              {!plantReaction && !isWatering && (
                plant.health < 50 ? '😔' : 
                Date.now() - plant.lastWatered.getTime() > 2 * 24 * 60 * 60 * 1000 ? '🥺' : 
                '🙂'
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* 水滴エフェクト */}
        <AnimatePresence>
          {waterDrops.map((drop) => (
            <motion.div
              key={drop.id}
              className="absolute text-blue-400 text-2xl pointer-events-none"
              initial={{ 
                x: drop.x, 
                y: drop.y, 
                scale: 0, 
                opacity: 0 
              }}
              animate={{ 
                y: drop.y + 200,
                scale: [0, 1, 0.8, 0],
                opacity: [0, 1, 1, 0],
                rotate: [0, 360]
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 1.5, 
                delay: drop.delay / 1000,
                ease: "easeIn"
              }}
            >
              💧
            </motion.div>
          ))}
        </AnimatePresence>

        {/* ドラッグ可能なじょうろ */}
                 <motion.div
           ref={canRef}
           className={`absolute cursor-${isDragging ? 'grabbing' : 'grab'} user-select-none`}
           style={{
             left: canPosition.x,
             top: canPosition.y,
             zIndex: 20
           }}
           onMouseDown={handleMouseDown}
           animate={
             isWatering 
               ? { rotate: [-15, 15, -10], scale: [1, 1.05, 1] }
               : isDragging 
               ? { scale: 1.1, rotate: 5 }
               : { 
                   y: [0, -3, 0],
                   rotate: [0, 1, -1, 0]
                 }
           }
           transition={{
             duration: isDragging ? 0.1 : 3,
             repeat: !isDragging && !isWatering ? Infinity : 0,
             ease: "easeInOut"
           }}
         >
           <div className="relative">
             {/* じょうろ本体 - より立体的な楕円形 */}
             <div 
               className="relative w-20 h-16 flex items-center justify-center shadow-xl"
               style={{
                 background: 'linear-gradient(145deg, #4FC3F7 0%, #29B6F6 50%, #0288D1 100%)',
                 borderRadius: '50% 50% 45% 45% / 60% 60% 40% 40%',
                 boxShadow: `
                   0 8px 20px rgba(2, 136, 209, 0.4),
                   inset 0 2px 0 rgba(255, 255, 255, 0.3),
                   inset 0 -2px 0 rgba(0, 0, 0, 0.1)
                 `
               }}
             >
               {/* 光沢効果 */}
               <div 
                 className="absolute top-1 left-2 w-6 h-3 rounded-full opacity-40"
                 style={{
                   background: 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, transparent 100%)'
                 }}
               />
               
               {/* 水位インジケーター */}
               <div 
                 className="absolute bottom-2 left-2 right-2 h-6 rounded-b-lg opacity-60"
                 style={{
                   background: 'linear-gradient(0deg, rgba(135, 206, 235, 0.8) 0%, rgba(173, 216, 230, 0.4) 100%)',
                   borderRadius: '0 0 40% 40%'
                 }}
               />
               
               {/* 中央のロゴ部分 */}
               <div className="relative z-10 text-white drop-shadow-lg">
                 <Droplets size={24} />
               </div>
             </div>
             
             {/* じょうろの注ぎ口 - より本物らしく */}
             <div 
               className="absolute -right-3 top-3"
               style={{
                 width: '24px',
                 height: '12px',
                 background: 'linear-gradient(145deg, #29B6F6 0%, #0288D1 100%)',
                 borderRadius: '0 50% 50% 0',
                 boxShadow: '0 2px 6px rgba(2, 136, 209, 0.3)'
               }}
             >
               {/* 注ぎ口の先端 */}
               <div 
                 className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-600 rounded-full"
                 style={{
                   boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)'
                 }}
               />
               
               {/* シャワーヘッド風の穴 */}
               <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 flex flex-col space-y-0.5">
                 <div className="w-0.5 h-0.5 bg-blue-800 rounded-full"></div>
                 <div className="w-0.5 h-0.5 bg-blue-800 rounded-full ml-0.5"></div>
                 <div className="w-0.5 h-0.5 bg-blue-800 rounded-full"></div>
               </div>
             </div>
             
             {/* 持ち手 - より立体的 */}
             <div 
               className="absolute -left-2 top-2 w-4 h-10"
               style={{
                 borderLeft: '4px solid #29B6F6',
                 borderTop: '2px solid #29B6F6',
                 borderBottom: '2px solid #0288D1',
                 borderRadius: '20px 0 0 20px',
                 background: 'linear-gradient(90deg, transparent 0%, rgba(41, 182, 246, 0.1) 100%)',
                 boxShadow: '-2px 0 4px rgba(2, 136, 209, 0.2)'
               }}
             >
               {/* 持ち手の内側装飾 */}
               <div 
                 className="absolute left-1 top-2 w-1 h-6 rounded-full opacity-30"
                 style={{
                   background: 'linear-gradient(0deg, #0288D1 0%, #29B6F6 100%)'
                 }}
               />
             </div>
             
             {/* 水やり中のエフェクト - より多彩に */}
             {isWatering && (
               <>
                 <motion.div
                   className="absolute -right-8 top-5 text-lg"
                   animate={{
                     opacity: [0, 1, 0],
                     scale: [0.5, 1, 0.5],
                     x: [0, 5, 10]
                   }}
                   transition={{
                     duration: 0.6,
                     repeat: Infinity,
                     delay: 0
                   }}
                 >
                   💧
                 </motion.div>
                 <motion.div
                   className="absolute -right-7 top-6 text-sm"
                   animate={{
                     opacity: [0, 1, 0],
                     scale: [0.5, 1, 0.5],
                     x: [0, 3, 8]
                   }}
                   transition={{
                     duration: 0.6,
                     repeat: Infinity,
                     delay: 0.1
                   }}
                 >
                   💦
                 </motion.div>
                 <motion.div
                   className="absolute -right-9 top-7 text-sm"
                   animate={{
                     opacity: [0, 1, 0],
                     scale: [0.5, 1, 0.5],
                     x: [0, 7, 12]
                   }}
                   transition={{
                     duration: 0.6,
                     repeat: Infinity,
                     delay: 0.2
                   }}
                 >
                   💧
                 </motion.div>
               </>
             )}
             
             {/* アイドル状態でのキラキラエフェクト */}
             {!isWatering && !isDragging && (
               <motion.div
                 className="absolute -top-2 -right-2 text-yellow-300 text-xs"
                 animate={{
                   opacity: [0, 1, 0],
                   scale: [0, 1, 0],
                   rotate: [0, 180, 360]
                 }}
                 transition={{
                   duration: 2,
                   repeat: Infinity,
                   delay: 1
                 }}
               >
                 ✨
               </motion.div>
             )}
           </div>
         </motion.div>

        {/* インストラクション */}
        {!isWatering && (
          <motion.div
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <p className="text-sm text-gray-600 bg-white/70 px-4 py-2 rounded-full">
              🫱 {t('watering.instruction', language)}
            </p>
          </motion.div>
        )}


      </motion.div>
    </motion.div>
  )
}

export default WateringModal 