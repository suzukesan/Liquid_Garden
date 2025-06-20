import { useMemo } from 'react'
import { Plant } from '@/types/plant'

interface EmotionalState {
  mood: string
  feeling: string
  message: string
  glassIntensity: number
  pulseSpeed: number
  aura: string
  breathingIntensity: number
}

export const usePlantEmotions = (plant: Plant): EmotionalState => {
  return useMemo(() => {
    if (plant.health > 80 && plant.loveLevel >= 80) {
      return {
        mood: '✨',
        feeling: 'きらきら',
        message: 'あなたの愛情に包まれて、今日もすくすくと育っています',
        glassIntensity: 0.8,
        pulseSpeed: 4,
        aura: 'radiant',
        breathingIntensity: 1.05
      }
    } else if (plant.health > 60 && plant.loveLevel >= 60) {
      return {
        mood: '🌱',
        feeling: 'うきうき',
        message: '心地よい日差しを感じています。ありがとう',
        glassIntensity: 0.6,
        pulseSpeed: 3,
        aura: 'peaceful',
        breathingIntensity: 1.03
      }
    } else if (plant.health > 40) {
      return {
        mood: '😥',
        feeling: 'ちょっと心配',
        message: 'もう少し優しさをください...',
        glassIntensity: 0.4,
        pulseSpeed: 2,
        aura: 'gentle',
        breathingIntensity: 1.02
      }
    } else if (plant.health > 20) {
      return {
        mood: '😌',
        feeling: 'しんみり',
        message: 'そばにいてくれるだけで嬉しいです',
        glassIntensity: 0.3,
        pulseSpeed: 1.5,
        aura: 'fragile',
        breathingIntensity: 1.01
      }
    } else {
      return {
        mood: '💤',
        feeling: 'おやすみ',
        message: '静かに回復の時を待っています',
        glassIntensity: 0.2,
        pulseSpeed: 1,
        aura: 'resting',
        breathingIntensity: 1.005
      }
    }
  }, [plant.health, plant.loveLevel])
} 