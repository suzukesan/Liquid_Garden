import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Plant, PlantType, GrowthStage, PlantCareAction } from '@/types/plant'

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

const createNewPlant = (type: PlantType): Plant => ({
  id: `plant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  name: `My ${type}`,
  type,
  growthStage: GrowthStage.SEED,
  health: 100,
  growthProgress: 0,
  loveLevel: 0,
  lastWatered: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  lastSunExposure: new Date(Date.now() - 24 * 60 * 60 * 1000),
  lastTalk: new Date(Date.now() - 24 * 60 * 60 * 1000),
  createdAt: new Date()
})

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
                  loveLevel: Math.min(5, plant.loveLevel + 0.1)
                }
              : plant
          ),
          careHistory: [
            ...state.careHistory,
            {
              id: `care-${Date.now()}`,
              plantId,
              action: 'water' as const,
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
              action: 'sun_exposure' as const,
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
                  loveLevel: Math.min(5, plant.loveLevel + 0.2)
                }
              : plant
          ),
          careHistory: [
            ...state.careHistory,
            {
              id: `care-${Date.now()}`,
              plantId,
              action: 'talk' as const,
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
      version: 1
    }
  )
)
