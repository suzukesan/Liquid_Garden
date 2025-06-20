import { useEffect, useRef } from 'react'
import { usePlantStore } from '@/stores/plantStore'
import { useToastStore } from '@/stores/toastStore'
import { useConfetti } from './useConfetti'

export const useAchievementToast = () => {
  const { achievements } = usePlantStore()
  const { show } = useToastStore()
  const { fire } = useConfetti()
  const unlockedSet = useRef<Set<string>>(new Set())

  useEffect(() => {
    achievements.forEach((a) => {
      if (a.unlocked && !unlockedSet.current.has(a.id)) {
        unlockedSet.current.add(a.id)
        show({ message: `${a.name}を達成しました!`, emoji: a.emoji })
        fire(a.emoji)
      }
    })
  }, [achievements, show, fire])
} 