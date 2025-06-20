import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Plant, PlantType, GrowthStage, PlantCareAction, CareActionType } from '@/types/plant'
import { useNotifications } from '@/hooks/useNotifications'
import { compressToUTF16, decompressFromUTF16 } from 'lz-string'
import { Achievement } from '@/types/gamification'

// 言語設定の型を追加
export type Language = 'ja' | 'en'

interface PlantStore {
  plants: Plant[]
  careHistory: PlantCareAction[]
  careHistoryArchive?: string // compressed older history
  selectedPlant: Plant | null
  language: Language // 言語設定を追加
  theme: 'auto' | 'light' | 'dark' // テーマ設定を追加
  achievements: Achievement[]
  stats: {
    waterCount: number
    sunCount: number
    talkCount: number
  }
  
  // Actions
  addPlant: (type: PlantType) => void
  removePlant: (plantId: string) => void
  selectPlant: (plantId: string) => void
  
  // Care actions
  waterPlant: (plantId: string) => void
  giveSunExposure: (plantId: string) => void
  talkToPlant: (plantId: string) => void
  
  // Growth
  updatePlantGrowth: (plantId: string) => void
  
  // Utilities
  getPlantById: (plantId: string) => Plant | undefined
  
  // Language
  setLanguage: (language: Language) => void // 言語設定関数を追加
  // Theme
  setTheme: (theme: 'auto' | 'light' | 'dark') => void // テーマ設定関数を追加
  // Gamification
  unlockAchievement: (id: string) => void
}

const createNewPlant = (type: PlantType): Plant => {
  const plantId = `plant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  
  // 植物タイプ別のランダムな名前
  const getRandomName = (plantType: PlantType): string => {
    const names = {
      [PlantType.PACHIRA]: ['みどりちゃん', 'パッチー', 'リーフィ', 'わかば'],
      [PlantType.SANSEVIERIA]: ['サンちゃん', 'スリム', 'トラちゃん', 'シャープ'],
      [PlantType.MONSTERA]: ['モンちゃん', 'ハート', 'あなあな', 'モンスター'],
      [PlantType.RUBBER_TREE]: ['ゴムちゃん', 'ぷるぷる', 'ラバー', 'もちもち'],
      [PlantType.KENTIA_PALM]: ['ヤシの実', 'トロピカル', 'パーム', 'リゾート']
    }
    const typeNames = names[plantType] || ['みどりちゃん']
    return typeNames[Math.floor(Math.random() * typeNames.length)]
  }

  return {
    id: plantId,
    name: getRandomName(type),
    type,
    growthStage: GrowthStage.SEED,
    health: Math.floor(Math.random() * 40) + 60, // 60-100でランダム
    growthProgress: Math.floor(Math.random() * 30), // 0-30でランダム
    loveLevel: Math.floor(Math.random() * 30) + 20, // 20-50でランダム
    lastWatered: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000), // 0-3日前
    lastSunExposure: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000),
    lastTalk: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000),
    createdAt: new Date()
  }
}

export const usePlantStore = create<PlantStore>()(
  persist(
    (set, get) => ({
      plants: [],
      careHistory: [],
      selectedPlant: null,
      language: 'ja', // デフォルトは日本語
      theme: 'auto', // テーマは自動
      achievements: [
        { id: 'first_plant', name: 'はじめの一歩', emoji: '🌱', description: '最初の植物を植えた', unlocked: false },
        { id: 'water_10', name: 'ウォーターマスター', emoji: '💧', description: '水やり10回達成', unlocked: false },
        { id: 'love_max', name: 'ラブフル', emoji: '❤️', description: '愛情度MAXの植物を育てた', unlocked: false },
        { id: 'flower_bloom', name: '開花の瞬間', emoji: '🌸', description: '花を咲かせた', unlocked: false }
      ],
      stats: { waterCount: 0, sunCount: 0, talkCount: 0 },

      addPlant: (type: PlantType) => {
        const newPlant = createNewPlant(type)
        set((state) => ({
          plants: [...state.plants, newPlant],
          selectedPlant: newPlant
        }))
        // unlock first plant achievement
        const { unlockAchievement } = get()
        if (get().plants.length === 1) unlockAchievement('first_plant')
      },

      removePlant: (plantId: string) => {
        set((state) => ({
          plants: state.plants.filter(p => p.id !== plantId),
          selectedPlant: state.selectedPlant?.id === plantId ? null : state.selectedPlant,
          careHistory: state.careHistory.filter(c => c.plantId !== plantId)
        }))
      },

      selectPlant: (plantId: string) => {
        const plant = get().plants.find(p => p.id === plantId)
        set({ selectedPlant: plant || null })
      },

      waterPlant: (plantId: string) => {
        const now = new Date()
        set((state) => ({
          plants: state.plants.map(plant =>
            plant.id === plantId
              ? {
                  ...plant,
                  lastWatered: now,
                  health: Math.min(100, plant.health + 10),
                  loveLevel: Math.min(100, plant.loveLevel + 2)
                }
              : plant
          ),
          careHistory: [
            ...state.careHistory,
            {
              id: `care-${Date.now()}`,
              plantId,
              action: CareActionType.WATER,
              timestamp: now
            }
          ]
        }))
        // stats & achievement check
        set((state) => ({ stats: { ...state.stats, waterCount: state.stats.waterCount + 1 } }))
        if (get().stats.waterCount + 1 === 10) get().unlockAchievement('water_10')
      },

      giveSunExposure: (plantId: string) => {
        const now = new Date()
        set((state) => ({
          plants: state.plants.map(plant =>
            plant.id === plantId
              ? {
                  ...plant,
                  lastSunExposure: now,
                  health: Math.min(100, plant.health + 5),
                  growthProgress: Math.min(100, plant.growthProgress + 2)
                }
              : plant
          ),
          careHistory: [
            ...state.careHistory,
            {
              id: `care-${Date.now()}`,
              plantId,
              action: CareActionType.SUN_EXPOSURE,
              timestamp: now
            }
          ]
        }))
      },

      talkToPlant: (plantId: string) => {
        const now = new Date()
        set((state) => ({
          plants: state.plants.map(plant =>
            plant.id === plantId
              ? {
                  ...plant,
                  lastTalk: now,
                  loveLevel: Math.min(100, plant.loveLevel + 5)
                }
              : plant
          ),
          careHistory: [
            ...state.careHistory,
            {
              id: `care-${Date.now()}`,
              plantId,
              action: CareActionType.TALK,
              timestamp: now
            }
          ]
        }))
      },

      updatePlantGrowth: (plantId: string) => {
        const { notifyGrowthEvent } = useNotifications()
        set((state) => ({
          plants: state.plants.map(plant => {
            if (plant.id !== plantId) return plant

            let newGrowthStage = plant.growthStage
            let newGrowthProgress = plant.growthProgress

            // Advance growth stage if progress is 100%
            if (plant.growthProgress >= 100) {
              switch (plant.growthStage) {
                case GrowthStage.SEED:
                  newGrowthStage = GrowthStage.SPROUT
                  newGrowthProgress = 0
                  notifyGrowthEvent?.(plant, 'sprout')
                  break
                case GrowthStage.SPROUT:
                  newGrowthStage = GrowthStage.SMALL_LEAVES
                  newGrowthProgress = 0
                  notifyGrowthEvent?.(plant, 'small_leaves')
                  break
                case GrowthStage.SMALL_LEAVES:
                  newGrowthStage = GrowthStage.LARGE_LEAVES
                  newGrowthProgress = 0
                  notifyGrowthEvent?.(plant, 'large_leaves')
                  break
                case GrowthStage.LARGE_LEAVES:
                  newGrowthStage = GrowthStage.FLOWER
                  newGrowthProgress = 0
                  notifyGrowthEvent?.(plant, 'flower')
                  // unlock flower bloom achievement
                  get().unlockAchievement('flower_bloom')
                  break
                default:
                  // Already at max stage
                  break
              }
            }

            return {
              ...plant,
              growthStage: newGrowthStage,
              growthProgress: newGrowthProgress
            }
          })
        }))
        // love_max achievement is handled in talkToPlant
      },

      getPlantById: (plantId: string) => {
        return get().plants.find(p => p.id === plantId)
      },

      setLanguage: (language: Language) => {
        set({ language })
      },

      setTheme: (theme: 'auto' | 'light' | 'dark') => {
        set({ theme })
      },

      unlockAchievement: (id: string) => {
        set((state) => ({
          achievements: state.achievements.map((a) =>
            a.id === id && !a.unlocked ? { ...a, unlocked: true, unlockedAt: new Date() } : a
          )
        }))
      }
    }),
    {
      name: 'liquid-garden-storage',
      version: 4, // バージョンを上げて既存のデータをクリア
      // Dateオブジェクトの適切な処理
      partialize: (state) => {
        // 30日より古い履歴をアーカイブ
        const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000
        const now = Date.now()
        const recent: PlantCareAction[] = []
        const old: PlantCareAction[] = []

        state.careHistory.forEach((c) => {
          if (now - c.timestamp.getTime() > THIRTY_DAYS) old.push(c)
          else recent.push(c)
        })

        const archiveStr = old.length > 0 ? compressToUTF16(JSON.stringify(old)) : state.careHistoryArchive ?? undefined

        return {
          plants: state.plants,
          careHistory: recent,
          careHistoryArchive: archiveStr,
          selectedPlant: state.selectedPlant,
          theme: state.theme,
          language: state.language,
          achievements: state.achievements,
          stats: state.stats
        }
      },
      onRehydrateStorage: () => (state) => {
        if (state) {
          // 文字列からDateオブジェクトに変換
          state.plants = state.plants.map(plant => ({
            ...plant,
            lastWatered: new Date(plant.lastWatered),
            lastSunExposure: new Date(plant.lastSunExposure),
            lastTalk: new Date(plant.lastTalk),
            createdAt: new Date(plant.createdAt)
          }))
          
          if (state.selectedPlant) {
            state.selectedPlant = {
              ...state.selectedPlant,
              lastWatered: new Date(state.selectedPlant.lastWatered),
              lastSunExposure: new Date(state.selectedPlant.lastSunExposure),
              lastTalk: new Date(state.selectedPlant.lastTalk),
              createdAt: new Date(state.selectedPlant.createdAt)
            }
          }
          
          state.careHistory = state.careHistory.map(care => ({
            ...care,
            timestamp: new Date(care.timestamp)
          }))

          // 展開して古い履歴をメモリには読み込まないが必要なら利用可能
          if (state.careHistoryArchive) {
            try {
              const decompressed = decompressFromUTF16(state.careHistoryArchive)
              // JSON parse check
              JSON.parse(decompressed || '[]')
            } catch (_) {
              // ignore corruption
            }
          }

          // ensure date for achievements
          state.achievements = state.achievements.map((a) => a.unlockedAt ? { ...a, unlockedAt: new Date(a.unlockedAt as any) } : a)
        }
      }
    }
  )
)
