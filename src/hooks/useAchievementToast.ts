import { useEffect, useRef } from 'react'
import { usePlantStore } from '@/stores/plantStore'
import { useToastStore } from '@/stores/toastStore'
import { useConfetti } from './useConfetti'
import { t } from '@/utils/i18n'

export const useAchievementToast = () => {
  const { achievements, language } = usePlantStore()
  const { show } = useToastStore()
  const { fire } = useConfetti()
  const unlockedSet = useRef<Set<string>>(new Set())

  useEffect(() => {
    achievements.forEach((a) => {
      if (a.unlocked && !unlockedSet.current.has(a.id)) {
        unlockedSet.current.add(a.id)
        
        // 翻訳されたメッセージを取得
        const achievementName = t(`achievement.${a.id}.name`, language)
        const message = `${achievementName}${t('achievement.unlocked', language)}`
        
        show({ message, emoji: a.emoji })
        fire(a.emoji)
      }
    })
  }, [achievements, show, fire, language])
} 