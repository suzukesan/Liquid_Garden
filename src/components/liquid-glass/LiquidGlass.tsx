import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface LiquidGlassProps {
  children: React.ReactNode
  className?: string
  glassColor?: string
  effect?: 'wave' | 'linear' | 'circular' | 'tropical' | 'heart'
  onClick?: () => void
  isHovered?: boolean
}

const LiquidGlass: React.FC<LiquidGlassProps> = ({
  children,
  className,
  glassColor = 'rgba(255, 255, 255, 0.2)',
  effect = 'wave',
  onClick,
  isHovered = false
}) => {
  const getEffectStyles = () => {
    const baseStyles = {
      backdropFilter: 'blur(16px) saturate(180%)',
      backgroundColor: glassColor,
      border: '1px solid rgba(255, 255, 255, 0.125)',
      borderRadius: '12px',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    }

    switch (effect) {
      case 'wave':
        return {
          ...baseStyles,
          background: `linear-gradient(135deg, ${glassColor} 0%, rgba(255, 255, 255, 0.1) 100%)`,
        }
      case 'linear':
        return {
          ...baseStyles,
          background: `linear-gradient(180deg, ${glassColor} 0%, rgba(255, 255, 255, 0.05) 100%)`,
        }
      case 'circular':
        return {
          ...baseStyles,
          background: `radial-gradient(circle, ${glassColor} 0%, rgba(255, 255, 255, 0.1) 100%)`,
          borderRadius: '50%',
        }
      case 'heart':
        return {
          ...baseStyles,
          background: `radial-gradient(ellipse, ${glassColor} 0%, rgba(255, 255, 255, 0.1) 100%)`,
          borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
        }
      default:
        return baseStyles
    }
  }

  const animationVariants = {
    initial: { scale: 1, rotateY: 0 },
    hover: {
      scale: 1.05,
      rotateY: 5,
    },
    tap: {
      scale: 0.95,
      rotateY: -2,
    }
  }

  return (
    <motion.div
      className={cn(
        'relative overflow-hidden cursor-pointer transform-gpu',
        className
      )}
      style={getEffectStyles()}
      variants={animationVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      animate={isHovered ? 'hover' : 'initial'}
      onClick={onClick}
    >
      {/* Glass reflection effect */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, transparent 50%)',
          transform: 'translateX(-100%)',
        }}
        animate={{
          transform: isHovered ? 'translateX(100%)' : 'translateX(-100%)',
        }}
        transition={{
          duration: 0.6,
          ease: 'easeInOut'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 p-4">
        {children}
      </div>
      
      {/* Liquid effect overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${isHovered ? '50%' : '0%'} ${isHovered ? '50%' : '0%'}, rgba(255, 255, 255, 0.2) 0%, transparent 50%)`,
        }}
        animate={{
          opacity: isHovered ? 0.8 : 0.3,
        }}
        transition={{
          duration: 0.3,
          ease: 'easeOut'
        }}
      />
    </motion.div>
  )
}

export default LiquidGlass
