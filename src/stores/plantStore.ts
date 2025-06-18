import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Plant, PlantType, GrowthStage, PlantCareAction, CareActionType } from '@/types/plant'

interface PlantStore {
  plants: Plant[]
  careHistory: PlantCareAction[]
  selectedPlant: Plant | null
  
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

      addPlant: (type: PlantType) => {
        const newPlant = createNewPlant(type)
        set((state) => ({
          plants: [...state.plants, newPlant],
          selectedPlant: newPlant
        }))
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
                  break
                case GrowthStage.SPROUT:
                  newGrowthStage = GrowthStage.SMALL_LEAVES
                  newGrowthProgress = 0
                  break
                case GrowthStage.SMALL_LEAVES:
                  newGrowthStage = GrowthStage.LARGE_LEAVES
                  newGrowthProgress = 0
                  break
                case GrowthStage.LARGE_LEAVES:
                  newGrowthStage = GrowthStage.FLOWER
                  newGrowthProgress = 0
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
      },

      getPlantById: (plantId: string) => {
        return get().plants.find(p => p.id === plantId)
      }
    }),
    {
      name: 'liquid-garden-storage',
      version: 3, // バージョンを上げて既存のデータをクリア
      // Dateオブジェクトの適切な処理
      partialize: (state) => ({
        plants: state.plants,
        careHistory: state.careHistory,
        selectedPlant: state.selectedPlant
      }),
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
        }
      }
    }
  )
)
