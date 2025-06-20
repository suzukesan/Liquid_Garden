import { useMemo } from 'react'
import { Plant } from '@/types/plant'

interface NextAction {
  type: string
  icon: string
  text: string
  urgency: 'urgent' | 'needed' | 'normal'
  description: string
}

export const useNextAction = (plant: Plant): NextAction => {
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
        text: '水やり', 
        urgency: 'urgent',
        description: 'のどがからからです'
      })
    }
    
    if (timeSinceSun > 1) {
      urgentActions.push({ 
        type: 'sun', 
        icon: '☀️', 
        text: '日光浴', 
        urgency: 'urgent',
        description: 'お日様が恋しそう'
      })
    }
    
    if (needsLove) {
      urgentActions.push({ 
        type: 'talk', 
        icon: '💕', 
        text: '話しかける', 
        urgency: plant.loveLevel < 20 ? 'urgent' : 'needed',
        description: plant.loveLevel < 20 ? 'とても寂しそう' : '話を聞いて欲しそう'
      })
    }

    // 緊急でない場合の通常アクション
    if (urgentActions.length === 0) {
      if (timeSinceWater > 0.5) {
        urgentActions.push({ 
          type: 'water', 
          icon: '💧', 
          text: '水やり', 
          urgency: 'normal',
          description: 'そろそろお水が欲しいかも'
        })
      } else if (timeSinceSun > 0.3) {
        urgentActions.push({ 
          type: 'sun', 
          icon: '☀️', 
          text: '日光浴', 
          urgency: 'normal',
          description: '光を浴びたそう'
        })
      } else {
        urgentActions.push({ 
          type: 'talk', 
          icon: '😊', 
          text: 'お世話', 
          urgency: 'normal',
          description: '元気に過ごしています'
        })
      }
    }

    return urgentActions[0] // 最も緊急なアクションを返す
  }, [plant.lastWatered, plant.lastSunExposure, plant.loveLevel])
} 