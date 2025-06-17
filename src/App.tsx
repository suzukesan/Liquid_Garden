import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Settings, Leaf } from 'lucide-react'
import { usePlantStore } from '@/stores/plantStore'
import { PlantType } from '@/types/plant'
import PlantCard from '@/components/plant/PlantCard'
import { Button } from '@/components/ui/button'
import LiquidGlass from '@/components/liquid-glass/LiquidGlass'
import './App.css'

function App() {
  const { plants, addPlant } = usePlantStore()
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'day' | 'evening'>('day')

  // Time-based background effect
  useEffect(() => {
    const updateTimeOfDay = () => {
      const hour = new Date().getHours()
      if (hour < 6 || hour >= 18) {
        setTimeOfDay('evening')
      } else if (hour < 12) {
        setTimeOfDay('morning')
      } else {
        setTimeOfDay('day')
      }
    }

    updateTimeOfDay()
    const interval = setInterval(updateTimeOfDay, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  const getBackgroundClass = () => {
    switch (timeOfDay) {
      case 'morning':
        return 'bg-gradient-to-br from-orange-200 via-pink-200 to-blue-200'
      case 'day':
        return 'bg-gradient-to-br from-blue-200 via-green-200 to-yellow-200'
      case 'evening':
        return 'bg-gradient-to-br from-purple-300 via-blue-300 to-indigo-400'
      default:
        return 'bg-gradient-to-br from-blue-200 via-green-200 to-yellow-200'
    }
  }

  const handleAddPlant = () => {
    // MVP: Only add Pachira for now
    addPlant(PlantType.PACHIRA)
  }

  const getTimeGreeting = () => {
    switch (timeOfDay) {
      case 'morning':
        return '🌅 おはようございます！'
      case 'day':
        return '☀️ こんにちは！'
      case 'evening':
        return '🌙 こんばんは！'
      default:
        return '🌱 Welcome!'
    }
  }

  return (
    <div className={`min-h-screen transition-all duration-1000 ${getBackgroundClass()}`}>
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 text-4xl opacity-30"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          🍃
        </motion.div>
        <motion.div
          className="absolute top-40 right-20 text-3xl opacity-25"
          animate={{
            y: [0, 15, 0],
            rotate: [0, -3, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        >
          🌿
        </motion.div>
        <motion.div
          className="absolute bottom-32 left-1/4 text-2xl opacity-20"
          animate={{
            y: [0, -10, 0],
            rotate: [0, 2, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        >
          🌱
        </motion.div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <LiquidGlass 
          className="max-w-4xl mx-auto"
          glassColor="rgba(255, 255, 255, 0.15)"
          effect="wave"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Leaf className="w-8 h-8 text-green-600" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-white">Liquid Garden</h1>
                <p className="text-sm text-white/80">{getTimeGreeting()}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </LiquidGlass>
      </header>

      {/* Main Content */}
      <main className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto">
          {plants.length === 0 ? (
            // Welcome Screen
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center py-16"
            >
              <LiquidGlass 
                className="max-w-md mx-auto"
                glassColor="rgba(255, 255, 255, 0.2)"
                effect="circular"
              >
                <div className="space-y-6">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="text-8xl"
                  >
                    🌱
                  </motion.div>
                  
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Liquid Gardenへようこそ！
                    </h2>
                    <p className="text-white/80 mb-6">
                      癒し系植物育成アプリで、バーチャルガーデンを始めましょう
                    </p>
                  </div>
                  
                  <Button
                    onClick={handleAddPlant}
                    size="lg"
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    最初の植物を育てる
                  </Button>
                </div>
              </LiquidGlass>
            </motion.div>
          ) : (
            // Plants Grid (Bento Box Layout)
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">
                  あなたの植物たち ({plants.length})
                </h2>
                <Button
                  onClick={handleAddPlant}
                  variant="outline"
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  植物を追加
                </Button>
              </div>

              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {plants.map((plant, index) => (
                  <motion.div
                    key={plant.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <PlantCard plant={plant} />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 mt-12">
        <LiquidGlass 
          className="max-w-4xl mx-auto"
          glassColor="rgba(255, 255, 255, 0.1)"
        >
          <div className="text-center">
            <p className="text-white/60 text-sm">
              Liquid Garden MVP - 植物育成アプリ
            </p>
            <p className="text-white/40 text-xs mt-1">
              データはローカルに保存されます
            </p>
          </div>
        </LiquidGlass>
      </footer>
    </div>
  )
}

export default App
