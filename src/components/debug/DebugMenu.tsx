import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useDebugStore } from '@/stores/debugStore'
import { usePlantStore } from '@/stores/plantStore'
import { GrowthStage } from '@/types/plant'
import { t } from '@/utils/i18n'

const DebugMenu: React.FC = () => {
  const { open, setOpen } = useDebugStore()
  const { plants, waterPlant, giveSunExposure, talkToPlant } = usePlantStore()

  const close = () => setOpen(false)

  // helper to mutate plant state
  const mutatePlant = (id: string, mutator: (p: any) => any) => {
    usePlantStore.setState((state: any) => ({
      plants: state.plants.map((pl: any) => pl.id === id ? mutator(pl) : pl)
    }))
  }

  const changeHealth = (id: string, delta: number) => {
    mutatePlant(id, (p) => ({ ...p, health: Math.max(0, Math.min(100, p.health + delta)) }))
  }

  const changeLove = (id: string, delta: number) => {
    mutatePlant(id, (p) => ({ ...p, loveLevel: Math.max(0, Math.min(100, p.loveLevel + delta)) }))
  }

  const changeProgress = (id: string, delta: number) => {
    mutatePlant(id, (p) => {
      const newProg = Math.min(100, Math.max(0, p.growthProgress + delta))
      return { ...p, growthProgress: newProg }
    })
  }

  const stageUp = (id: string) => {
    mutatePlant(id, (p) => {
      const next = {
        [GrowthStage.SPROUT]: GrowthStage.SMALL_LEAVES,
        [GrowthStage.SMALL_LEAVES]: GrowthStage.LARGE_LEAVES,
        [GrowthStage.LARGE_LEAVES]: GrowthStage.FLOWER,
        [GrowthStage.FLOWER]: GrowthStage.FLOWER
      } as Record<GrowthStage, GrowthStage>
      return { ...p, growthStage: next[p.growthStage as GrowthStage], growthProgress: 0 }
    })
  }

  const rewindTime = (id: string, key: 'water' | 'sun' | 'talk', days: number = 1) => {
    const ms = days * 24 * 60 * 60 * 1000
    mutatePlant(id, (p) => {
      const map: Record<typeof key, keyof typeof p> = {
        water: 'lastWatered',
        sun: 'lastSunExposure',
        talk: 'lastTalk'
      }
      const k = map[key]
      return { ...p, [k]: new Date((p[k] as Date).getTime() - ms) }
    })
  }

  if (!open) return null

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl w-[90vw] max-w-lg max-h-[90vh] overflow-auto shadow-2xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Debug Menu</h3>
              <button onClick={close} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                <X size={20} />
              </button>
            </div>

            <section className="space-y-2">
              <h4 className="font-semibold">Plants ({plants.length})</h4>
              {plants.map((p) => (
                <div key={p.id} className="flex items-center justify-between text-sm border-b border-gray-300 dark:border-gray-700 py-1">
                  <span>{p.name} ({p.growthStage})</span>
                  <div className="space-x-1 flex flex-wrap justify-end">
                    <button className="px-2 py-0.5 bg-blue-500 text-white rounded" onClick={() => waterPlant(p.id)}>💧</button>
                    <button className="px-2 py-0.5 bg-yellow-500 text-white rounded" onClick={() => giveSunExposure(p.id)}>☀️</button>
                    <button className="px-2 py-0.5 bg-pink-500 text-white rounded" onClick={() => talkToPlant(p.id)}>💬</button>

                    <button className="px-1 py-0.5 bg-green-500 text-white text-xs rounded" onClick={() => changeHealth(p.id, +10)}>HP＋</button>
                    <button className="px-1 py-0.5 bg-green-700 text-white text-xs rounded" onClick={() => changeHealth(p.id, -10)}>HP−</button>

                    <button className="px-1 py-0.5 bg-purple-500 text-white text-xs rounded" onClick={() => changeLove(p.id, +10)}>Love＋</button>
                    <button className="px-1 py-0.5 bg-purple-700 text-white text-xs rounded" onClick={() => changeLove(p.id, -10)}>Love−</button>

                    <button className="px-1 py-0.5 bg-gray-500 text-white text-xs rounded" onClick={() => changeProgress(p.id, +10)}>+10%</button>
                    <button className="px-1 py-0.5 bg-gray-700 text-white text-xs rounded" onClick={() => stageUp(p.id)}>Stage↑</button>

                    <button className="px-1 py-0.5 bg-blue-200 text-xs rounded" onClick={() => rewindTime(p.id,'water')}>⏪W</button>
                    <button className="px-1 py-0.5 bg-yellow-200 text-xs rounded" onClick={() => rewindTime(p.id,'sun')}>⏪S</button>
                    <button className="px-1 py-0.5 bg-pink-200 text-xs rounded" onClick={() => rewindTime(p.id,'talk')}>⏪T</button>
                  </div>
                </div>
              ))}
            </section>

            <section className="mt-6 text-sm opacity-60">
              <p>Type <code>openDebugMenu()</code> in the console to reopen.</p>
            </section>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default DebugMenu 