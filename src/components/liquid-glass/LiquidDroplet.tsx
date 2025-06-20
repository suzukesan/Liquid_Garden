import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

interface LiquidDropletProps {
  size?: number
  color?: string
  intensity?: number
  children?: React.ReactNode
  className?: string
  onTouch?: () => void
}

const LiquidDroplet: React.FC<LiquidDropletProps> = ({
  size = 120,
  color = 'rgba(100, 200, 255, 0.3)',
  intensity = 1,
  children,
  className = '',
  onTouch
}) => {
  const [isRippling, setIsRippling] = useState(false)
  const [touchPosition, setTouchPosition] = useState({ x: 50, y: 50 })
  const dropletRef = useRef<HTMLDivElement>(null)

  const handleInteraction = (event: React.MouseEvent | React.TouchEvent) => {
    if (dropletRef.current) {
      const rect = dropletRef.current.getBoundingClientRect()
      const x = ('clientX' in event ? event.clientX : event.touches[0].clientX) - rect.left
      const y = ('clientY' in event ? event.clientY : event.touches[0].clientY) - rect.top
      
      setTouchPosition({
        x: (x / rect.width) * 100,
        y: (y / rect.height) * 100
      })
    }
    
    setIsRippling(true)
    onTouch?.()
    
    setTimeout(() => setIsRippling(false), 1000)
  }

  return (
    <motion.div
      ref={dropletRef}
      className={`relative overflow-hidden cursor-pointer transform-gpu ${className}`}
      style={{
        willChange: 'transform, opacity',
        width: size,
        height: size,
        borderRadius: '50% 40% 50% 40%',
        background: `radial-gradient(circle at ${touchPosition.x}% ${touchPosition.y}%, 
          rgba(255, 255, 255, 0.4) 0%, 
          ${color} 30%, 
          rgba(255, 255, 255, 0.1) 100%)`,
        backdropFilter: 'blur(20px) saturate(150%)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: `
          0 8px 32px rgba(0, 0, 0, 0.1),
          inset 0 2px 8px rgba(255, 255, 255, 0.3),
          inset 0 -2px 8px rgba(0, 0, 0, 0.1)
        `,
      }}
      onMouseDown={handleInteraction}
      onTouchStart={handleInteraction}
      whileHover={{ 
        scale: 1.05,
        rotateZ: [0, 2, -2, 0],
        transition: { duration: 0.3 }
      }}
      whileTap={{ scale: 0.95 }}
      animate={{
        rotateZ: isRippling ? [0, 5, -5, 0] : 0,
        scale: isRippling ? [1, 1.1, 1] : 1,
      }}
      transition={{
        duration: 0.6,
        ease: "easeOut"
      }}
    >
      {/* 内部の波紋エフェクト */}
      {isRippling && (
        <motion.div
          className="absolute"
          style={{
            left: `${touchPosition.x}%`,
            top: `${touchPosition.y}%`,
            transform: 'translate(-50%, -50%)',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            border: '2px solid rgba(255, 255, 255, 0.6)',
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ 
            scale: [0, 3, 6], 
            opacity: [1, 0.5, 0] 
          }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      )}

      {/* 光の反射 */}
      <motion.div
        className="absolute inset-0 opacity-40"
        style={{
          background: `linear-gradient(45deg, 
            transparent 30%, 
            rgba(255, 255, 255, 0.6) 50%, 
            transparent 70%)`,
          borderRadius: 'inherit',
        }}
        animate={{
          x: isRippling ? ['-100%', '100%'] : ['-100%', '-100%'],
        }}
        transition={{
          duration: 0.8,
          ease: "easeInOut",
          delay: isRippling ? 0.1 : 0
        }}
      />

      {/* コンテンツ */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {children}
      </div>

      {/* 液体のうねり */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(ellipse at ${touchPosition.x}% ${touchPosition.y}%, 
            rgba(255, 255, 255, 0.8) 0%, 
            transparent 50%)`,
          borderRadius: 'inherit',
        }}
        animate={{
          scale: isRippling ? [0.8, 1.2, 1] : 1,
          opacity: isRippling ? [0.2, 0.6, 0.2] : 0.2,
        }}
        transition={{ duration: 0.8 }}
      />
    </motion.div>
  )
}

export default LiquidDroplet 