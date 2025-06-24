import { useMemo } from 'react'
import { Plant } from '@/types/plant'
import { usePlantStore } from '@/stores/plantStore'
import { t } from '@/utils/i18n'

export interface NextAction {
  type: 'water' | 'sun' | 'talk'
  icon: string
  text: string
  urgency: 'urgent' | 'needed' | 'normal'
  description: string
}

export const useNextAction = (plant: Plant): NextAction => {
  const { language } = usePlantStore()
  
  return useMemo(() => {
    const timeSinceWater = (Date.now() - plant.lastWatered.getTime()) / (24 * 60 * 60 * 1000)
    const timeSinceSun = (Date.now() - plant.lastSunExposure.getTime()) / (24 * 60 * 60 * 1000)
    const needsLove = plant.loveLevel < 30

    // 緊急度順でソート
    const urgentActions: NextAction[] = []
    
    if (timeSinceWater > 2) {
      urgentActions.push({ 
        type: 'water', 
        icon: '💧', 
        text: t('care.water', language), 
        urgency: 'urgent',
        description: t('water.thirsty', language)
      })
    }
    
    if (timeSinceSun > 1) {
      urgentActions.push({ 
        type: 'sun', 
        icon: '☀️', 
        text: t('care.sunlight', language), 
        urgency: 'urgent',
        description: t('sun.misses', language)
      })
    }
    
    if (needsLove) {
      urgentActions.push({ 
        type: 'talk', 
        icon: '💕', 
        text: t('care.talk', language), 
        urgency: plant.loveLevel < 20 ? 'urgent' : 'needed',
        description: plant.loveLevel < 20 ? t('talk.lonely', language) : t('talk.wants', language)
      })
    }

    // 緊急でない場合の通常アクション
    if (urgentActions.length === 0) {
      if (timeSinceWater > 0.5) {
        urgentActions.push({ 
          type: 'water', 
          icon: '💧', 
          text: t('care.water', language), 
          urgency: 'normal',
          description: t('water.wants', language)
        })
      } else if (timeSinceSun > 0.3) {
        urgentActions.push({ 
          type: 'sun', 
          icon: '☀️', 
          text: t('care.sunlight', language), 
          urgency: 'normal',
          description: t('sun.wants', language)
        })
      } else {
        urgentActions.push({ 
          type: 'talk', 
          icon: '😊', 
          text: t('care.talk', language), 
          urgency: 'normal',
          description: t('care.happy', language)
        })
      }
    }

    // 最も緊急なアクションを返す
    return urgentActions[0] || { 
      type: 'talk', 
      icon: '😊', 
      text: t('care.talk', language), 
      urgency: 'normal',
      description: t('care.happy', language)
    }
  }, [plant, language])
} 