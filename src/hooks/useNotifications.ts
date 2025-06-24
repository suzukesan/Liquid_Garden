import { useEffect, useCallback, useState } from 'react'
import { usePlantStore } from '@/stores/plantStore'
import { Plant } from '@/types/plant'
import { t } from '@/utils/i18n'

interface NotificationSettings {
  enabled: boolean
  careReminders: boolean
  growthEvents: boolean
  reminderInterval: number // 分単位
}

export const useNotifications = () => {
  const { plants, language } = usePlantStore()
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [settings, setSettings] = useState<NotificationSettings>(() => {
    const saved = localStorage.getItem('notification-settings')
    if (saved) {
      return JSON.parse(saved)
    }
    return {
      enabled: false,
      careReminders: true,
      growthEvents: true,
      reminderInterval: 120 // 2時間ごと
    }
  })

  // 通知権限の確認と取得
  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.warn('このブラウザは通知をサポートしていません')
      return false
    }

    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      return result === 'granted'
    } catch (error) {
      console.error('通知権限の取得に失敗しました:', error)
      return false
    }
  }, [])

  // 通知設定の更新
  const updateSettings = useCallback((newSettings: Partial<NotificationSettings>) => {
    const updated = { ...settings, ...newSettings }
    setSettings(updated)
    localStorage.setItem('notification-settings', JSON.stringify(updated))
  }, [settings])

  // 通知の有効/無効切り替え
  const toggleNotifications = useCallback(async (enabled: boolean) => {
    if (enabled && permission !== 'granted') {
      const granted = await requestPermission()
      if (!granted) {
        return false
      }
    }
    updateSettings({ enabled })
    return true
  }, [permission, requestPermission, updateSettings])

  // 通知を送信
  const sendNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (!settings.enabled || permission !== 'granted') {
      return
    }

    try {
      const notification = new Notification(title, {
        icon: '/icon-192x192.png', // PWA用アイコンを使用
        badge: '/icon-96x96.png',
        tag: 'liquid-garden',
        ...options
      })

      notification.onclick = () => {
        window.focus()
        notification.close()
      }
    } catch (error) {
      console.error('通知の送信に失敗しました:', error)
    }
  }, [settings.enabled, permission])

  // 植物のケアが必要かチェック
  const checkPlantCareNeeds = useCallback((plant: Plant) => {
    const now = Date.now()
    const dayInMs = 24 * 60 * 60 * 1000
    
    const timeSinceWater = (now - plant.lastWatered.getTime()) / dayInMs
    const timeSinceSun = (now - plant.lastSunExposure.getTime()) / dayInMs
    const timeSinceTalk = (now - plant.lastTalk.getTime()) / dayInMs

    const needs = []
    
    if (timeSinceWater > 2) {
      needs.push({
        type: 'water',
        urgency: 'urgent',
        message: t('water.thirsty', language)
      })
    } else if (timeSinceWater > 1) {
      needs.push({
        type: 'water',
        urgency: 'normal',
        message: t('water.wants', language)
      })
    }

    if (timeSinceSun > 1) {
      needs.push({
        type: 'sun',
        urgency: 'urgent',
        message: t('sun.misses', language)
      })
    } else if (timeSinceSun > 0.5) {
      needs.push({
        type: 'sun',
        urgency: 'normal',
        message: t('sun.wants', language)
      })
    }

    if (plant.loveLevel < 20) {
      needs.push({
        type: 'talk',
        urgency: 'urgent',
        message: t('talk.lonely', language)
      })
    } else if (plant.loveLevel < 40 || timeSinceTalk > 1) {
      needs.push({
        type: 'talk',
        urgency: 'normal',
        message: t('talk.wants', language)
      })
    }

    return needs
  }, [language])

  // ケアリマインダーをチェックして通知
  const checkCareReminders = useCallback(() => {
    if (!settings.enabled || !settings.careReminders) {
      return
    }

    const plantsNeedingCare = plants.filter(plant => {
      const needs = checkPlantCareNeeds(plant)
      return needs.some(need => need.urgency === 'urgent')
    })

    if (plantsNeedingCare.length > 0) {
      const title = `🌱 ${t('notification.care_needed', language)}`
      const body = `${plantsNeedingCare.length}${t('notification.care_count', language)}`

      sendNotification(title, { body })
    }
  }, [plants, settings, checkPlantCareNeeds, sendNotification, language])

  // 成長イベント通知
  const notifyGrowthEvent = useCallback((plant: Plant, newStage: string) => {
    if (!settings.enabled || !settings.growthEvents) {
      return
    }

    const title = `🌸 ${plant.name}${t('notification.growth_event', language)}`
    const body = `${t('notification.new_stage', language)} ${t(`growth.${newStage}`, language)}`

    sendNotification(title, { body })
  }, [settings, sendNotification, language])

  // 定期的なケアチェック
  useEffect(() => {
    if (!settings.enabled || !settings.careReminders) {
      return
    }

    // 初回チェック
    checkCareReminders()

    // 定期チェックの設定
    const interval = setInterval(() => {
      checkCareReminders()
    }, settings.reminderInterval * 60 * 1000)

    return () => clearInterval(interval)
  }, [settings, checkCareReminders])

  // 通知権限の初期確認
  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission)
    }
  }, [])

  return {
    // 状態
    permission,
    settings,
    
    // アクション
    requestPermission,
    updateSettings,
    toggleNotifications,
    sendNotification,
    notifyGrowthEvent,
    checkCareReminders,
    
    // ユーティリティ
    checkPlantCareNeeds,
    isSupported: 'Notification' in window
  }
} 