import { useEffect } from 'react'
import { usePlantStore } from '@/stores/plantStore'
import { compressToUTF16, decompressFromUTF16 } from 'lz-string'
import { set, get } from 'idb-keyval'

type BackupPayload = {
  plants: ReturnType<typeof usePlantStore.getState>['plants']
  careHistory: ReturnType<typeof usePlantStore.getState>['careHistory']
  careHistoryArchive?: string
  language: ReturnType<typeof usePlantStore.getState>['language']
  theme: ReturnType<typeof usePlantStore.getState>['theme']
  timestamp: number
}

const BACKUP_KEY = 'liquid-garden-backup'

export const useAutoBackup = (intervalMinutes = 30) => {
  const {
    plants,
    careHistory,
    careHistoryArchive,
    language,
    theme,
  } = usePlantStore()

  // 保存処理
  useEffect(() => {
    const saveBackup = async () => {
      const payload: BackupPayload = {
        plants,
        careHistory,
        careHistoryArchive,
        language,
        theme,
        timestamp: Date.now(),
      }
      const compressed = compressToUTF16(JSON.stringify(payload))
      await set(BACKUP_KEY, compressed).catch(console.error)
    }

    // マウント直後 & interval
    saveBackup()
    const id = setInterval(saveBackup, intervalMinutes * 60 * 1000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plants, careHistory, careHistoryArchive, language, theme, intervalMinutes])

  // 復元処理（初回のみ）
  useEffect(() => {
    const restore = async () => {
      const compressed = await get<string>(BACKUP_KEY).catch(() => null)
      if (!compressed) return
      try {
        const json = decompressFromUTF16(compressed)
        if (!json) return
        const data: BackupPayload = JSON.parse(json)
        if (data && data.plants && data.plants.length > 0) {
          // 既に植物がある場合は上書きしない
          if (usePlantStore.getState().plants.length > 0) return

          // Date 変換
          data.plants.forEach((p: any) => {
            p.lastWatered = new Date(p.lastWatered)
            p.lastSunExposure = new Date(p.lastSunExposure)
            p.lastTalk = new Date(p.lastTalk)
            p.createdAt = new Date(p.createdAt)
          })
          data.careHistory.forEach((c: any) => {
            c.timestamp = new Date(c.timestamp)
          })

          usePlantStore.setState((state) => ({
            ...state,
            plants: data.plants,
            careHistory: data.careHistory,
            careHistoryArchive: data.careHistoryArchive,
            language: data.language,
            theme: data.theme,
          }))
        }
      } catch (e) {
        console.error('バックアップ復元失敗', e)
      }
    }
    restore()
  }, [])
} 