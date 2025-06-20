import React from 'react'
import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import { Achievement } from '@/types/gamification'

interface AchievementBadgeProps {
  achievement: Achievement
  size?: number
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({ achievement, size = 100 }) => {
  const isUnlocked = achievement.unlocked

  const gradient = isUnlocked
    ? 'linear-gradient(135deg, #facc15 0%, #f97316 100%)'
    : 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)'

  return (
    <motion.div
      className="relative flex items-center justify-center rounded-full transform-gpu"
      style={{
        width: size,
        height: size,
        background: gradient,
        boxShadow: isUnlocked
          ? '0 4px 12px rgba(251, 191, 36, 0.6)'
          : '0 2px 6px rgba(107, 114, 128, 0.5)',
        filter: isUnlocked ? 'none' : 'grayscale(0.8)',
      }}
      animate={isUnlocked ? { scale: [0.9, 1.05, 1] } : {}}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      role="img"
      aria-label={achievement.name}
    >
      <span className="text-4xl select-none" aria-hidden>
        {achievement.emoji}
      </span>

      {/* 背景レイヤーで立体感を演出 */}
      {[
        { scale: 2, opacity: 0.12, blur: 4 },
        { scale: 1.5, opacity: 0.2, blur: 2 },
        { scale: 1.2, opacity: 0.35, blur: 1 }
      ].map((layer, idx) => (
        <span
          key={idx}
          className="absolute inset-0 flex items-center justify-center select-none"
          aria-hidden
          style={{
            transform: `scale(${layer.scale})`,
            opacity: layer.opacity,
            filter: `blur(${layer.blur}px)`
          }}
        >
          {achievement.emoji}
        </span>
      ))}

      {!isUnlocked && (
        <Lock className="absolute inset-0 m-auto text-white/80" size={32} />
      )}
    </motion.div>
  )
}

export default AchievementBadge 